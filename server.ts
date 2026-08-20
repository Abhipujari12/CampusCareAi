import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Set high limit for base64 image transfers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Google Gen AI client with appropriate user agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: AI Image Verification
app.post("/api/verify-image", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image content provided." });
    }

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      },
    };

    const promptText = `
You are CampusCare AI, an automated visual inspector for university campus facilities maintenance.
Analyze this image of a reported facility issue.
Assess whether this represents a genuine maintenance, repair, or utility issue (e.g., broken furniture, water leaks, electrical sparking, damaged walls, HVAC failures, cleanliness issues).
Return a valid JSON object matching the requested schema. Do not include markdown wraps.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: promptText }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isGenuine: {
              type: Type.BOOLEAN,
              description: "True if it represents a real repair/maintenance issue, false if it is an unrelated image, selfie, random spam, or offensive/inappropriate.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence rating of this visual check, between 0.0 and 1.0.",
            },
            label: {
              type: Type.STRING,
              description: "Brief visual label of the detected issue, e.g., 'Water dripping', 'Broken chair leg', 'Electrical sparks', 'Spam/Selfie'.",
            },
            details: {
              type: Type.STRING,
              description: "Concise visual breakdown of what damage/problem is detected in the image.",
            },
            severity: {
              type: Type.STRING,
              description: "Urgency rating: 'low', 'medium', 'high', or 'critical' depending on safety risk or damage extent.",
            },
            suggestedCategory: {
              type: Type.STRING,
              description: "Category matching the issue: 'Plumbing', 'Electrical', 'HVAC / Air Conditioning', 'Carpentry / Furniture', 'WiFi / Internet', 'Housekeeping', or 'Others'.",
            },
          },
          required: ["isGenuine", "confidence", "label", "details", "severity", "suggestedCategory"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from Gemini.");
    }

    const aiResult = JSON.parse(resultText);
    return res.json(aiResult);
  } catch (error: any) {
    console.error("Error in verify-image:", error);
    return res.status(500).json({
      error: "AI visual inspection failed",
      details: error.message || error,
    });
  }
});

// API: Cloudinary upload proxy endpoint
app.post("/api/upload", async (req, res) => {
  try {
    const { file, mimeType } = req.body; // base64 string
    if (!file) {
      return res.status(400).json({ error: "Missing file data." });
    }

    // Try parsing Cloudinary URL or individual environment variables
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "ml_default";

    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl && !cloudName) {
      // ParsecloudinaryUrl: cloudinary://api_key:api_secret@cloud_name
      const match = cloudinaryUrl.match(/@([^/]+)/);
      if (match) {
        cloudName = match[1];
      }
    }

    if (!cloudName) {
      console.warn("Cloudinary is not configured. Returning fallback local preview URL.");
      // Fallback: Return a unique data URL or mock URL for preview testing
      return res.json({
        url: file.startsWith("data:") ? file : `data:${mimeType || "image/jpeg"};base64,${file}`,
        isMock: true,
        message: "Using mock local preview because Cloudinary variables are not configured.",
      });
    }

    // Real Cloudinary HTTP upload
    const cleanBase64 = file.startsWith("data:") ? file : `data:${mimeType || "image/jpeg"};base64,${file}`;
    const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new URLSearchParams();
    formData.append("file", cleanBase64);
    formData.append("upload_preset", uploadPreset);

    const uploadResponse = await fetch(cloudinaryEndpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(`Cloudinary upload returned status ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    return res.json({
      url: data.secure_url || data.url,
      public_id: data.public_id,
      isMock: false,
    });
  } catch (error: any) {
    console.error("Cloudinary Proxy error:", error);
    return res.status(500).json({
      error: "Failed to upload image securely.",
      details: error.message || error,
    });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware configuration for Development vs Production
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CampusCare AI Server running on http://0.0.0.0:${PORT}`);
});
