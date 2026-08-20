import logging
import logging.config
import sys

# Configure structured logging for the backend system
logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "standard",
            "stream": sys.stdout,
        },
    },
    "loggers": {
        "campuscare-backend": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        }
    }
}

logging.config.dictConfig(logging_config)
logger = logging.getLogger("campuscare-backend")
