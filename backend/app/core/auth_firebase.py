import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings
import os
import json

security = HTTPBearer()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    # Solo evitar inicialización en test si no hay credenciales
    if settings.ENVIRONMENT == "test" and not settings.FIREBASE_SERVICE_ACCOUNT_KEY:
        print("Skipping Firebase initialization in test mode without credentials")
        return
        
    try:
        # Check if Firebase is already initialized
        firebase_admin.get_app()
        return
    except ValueError:
        # Firebase not initialized, proceed with initialization
        pass
    
    cred = None
    
    # Option 1: Use environment variable (for Railway/production)
    if settings.FIREBASE_SERVICE_ACCOUNT_KEY:
        try:
            service_account_info = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_KEY)
            cred = credentials.Certificate(service_account_info)
        except json.JSONDecodeError:
            print("Error: Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY")
    
    # Option 2: Use local file (for development)
    if not cred and settings.FIREBASE_SERVICE_ACCOUNT_PATH:
        cred_path = os.path.join(
            os.path.dirname(__file__), "..", "..", 
            settings.FIREBASE_SERVICE_ACCOUNT_PATH
        )
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            print(f"Warning: Firebase service account file not found at {cred_path}")
    
    if cred:
        try:
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully")
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
    else:
        print("Warning: No Firebase credentials found")

# Initialize Firebase when module is imported
initialize_firebase()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    token = credentials.credentials
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
