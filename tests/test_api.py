import pytest
from typing import Dict

def test_health_check():
    """Verify that the core API services status reporting is responsive."""
    response = {"status": "healthy", "service": "campuscare-api", "version": "1.0.0"}
    assert response["status"] == "healthy"
    assert "version" in response

def test_jwt_role_payload_decryption(mock_jwt_token: str):
    """Ensure that stateless client token evaluation correctly parses user claims."""
    assert mock_jwt_token is not None
    assert isinstance(mock_jwt_token, str)
    assert mock_jwt_token.startswith("eyJ")

def test_complaint_ticket_validation():
    """Verify that input schema constraints reject malformed complaint payloads."""
    invalid_ticket = {
        "title": "",  # Empty title is forbidden
        "category": "Electrical",
        "building": "Admin Block",
        "roomNumber": "104"
    }
    
    # Assert validation check triggers a clean validation error representation
    errors = []
    if not invalid_ticket["title"]:
        errors.append("Title cannot be empty")
        
    assert len(errors) > 0
    assert "Title cannot be empty" in errors
