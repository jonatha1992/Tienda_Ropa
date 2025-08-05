import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings
import os

if settings.ENVIRONMENT != "test":
    cred_path = os.path.join(os.path.dirname(__file__), "..", "firebase_service_account.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        try:
            firebase_admin.get_app()
        except ValueError:
            firebase_admin.initialize_app(cred)

security = HTTPBearer()

security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
