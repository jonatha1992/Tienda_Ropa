import os
import base64
import json
from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator
from dotenv import load_dotenv

"""Configuración centralizada multi-entorno (nueva convención dev / test / pro).

Prioridad de carga (descendente):
1. Variables del sistema (CI / Hosting / Railway)
2. Archivo específico: .env.<env>  ( .env.dev | .env.test | .env.pro )
3. Fallback: .env

Archivos sugeridos (solo locales, nunca subir secretos reales):
 - backend/.env.dev
 - backend/.env.test
 - backend/.env.pro   (NO commitear; en producción usar variables del hosting)
 - backend/.env.example (plantilla)
"""

# Determinar entorno temprano (valores soportados: dev, test, pro)
RAW_ENV = os.getenv("ENVIRONMENT", "dev").lower()
ENV_FILE_MAP = {
    "dev": ".env.dev",
    "test": ".env.test",
    "pro": ".env.pro",
}

candidate = ENV_FILE_MAP.get(RAW_ENV)
if candidate and os.path.isfile(candidate):
    load_dotenv(candidate)
else:
    # Fallback a .env genérico si existe
    if os.path.isfile(".env"):
        load_dotenv(".env")


class Settings(BaseSettings):
    # Core / Environment
    ENVIRONMENT: str = RAW_ENV  # dev | test | pro
    SECRET_KEY: str = "change-me"  # validación reforzada más abajo
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Formato recomendado: postgresql+psycopg2://user:password@host:port/db_name
    DATABASE_URL: str = "app.db"  # Placeholder; sobrescribir por entorno

    # Firebase opción 1/2 (mantener campos aunque usemos sólo individuales para evitar AttributeError en helpers)
    FIREBASE_SERVICE_ACCOUNT_JSON_B64: Optional[str] = None
    FIREBASE_SERVICE_ACCOUNT_KEY: Optional[str] = None

    # Firebase opción 3: variables individuales
    FIREBASE_TYPE: str = "service_account"
    FIREBASE_PROJECT_ID: str = "m-vintage"
    FIREBASE_PRIVATE_KEY_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: str = (
        "firebase-adminsdk-fbsvc@m-vintage.iam.gserviceaccount.com"
    )
    FIREBASE_CLIENT_ID: int = 115177179653983835424
    FIREBASE_AUTH_URI: str = "https://accounts.google.com/o/oauth2/auth"
    FIREBASE_TOKEN_URI: str = "https://oauth2.googleapis.com/token"

    # Server
    PORT: int = 8000

    # CORS / Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    # Alternativa: lista separada por comas, tiene prioridad si se define
    CORS_ORIGINS: Optional[str] = None

    # MercadoPago Configuration
    MERCADOPAGO_ACCESS_TOKEN: str = ""
    MERCADOPAGO_PUBLIC_KEY: str = ""
    MERCADOPAGO_WEBHOOK_SECRET: str = ""
    MERCADOPAGO_SUCCESS_URL: str = "http://localhost:5173/payment/success"
    MERCADOPAGO_FAILURE_URL: str = "http://localhost:5173/payment/failure"
    MERCADOPAGO_PENDING_URL: str = "http://localhost:5173/payment/pending"

    class Config:
        # (doc) Configuración de pydantic BaseSettings.
        # Permite que BaseSettings también intente leer el archivo específico
        env_file = ENV_FILE_MAP.get(RAW_ENV, ".env.dev")
        env_file_encoding = "utf-8"
        case_sensitive = False

    # ----------------- Validaciones -----------------
    @validator("SECRET_KEY")
    def validate_secret_key(cls, v, values):  # type: ignore[override]
        env = values.get("ENVIRONMENT", "dev")
        if env in ("pro",):
            if not v or v in ("your_secret", "change-me"):
                raise ValueError("SECRET_KEY debe configurarse para entornos pro")
            if len(v) < 32:
                raise ValueError("SECRET_KEY debe tener al menos 32 caracteres")
        return v

    @validator("DATABASE_URL")
    def validate_database_url(cls, v, values):  # type: ignore[override]
        env = values.get("ENVIRONMENT", "dev")
        if env in ("test", "pro"):
            if v.startswith("sqlite:"):
                raise ValueError(
                    "En entornos test/pro la base de datos debe ser PostgreSQL (no sqlite)"
                )
        return v

    # ----------------- Helpers -----------------
    @property
    def allowed_origins(self) -> List[str]:
        """Devuelve lista de orígenes permitidos para CORS.
        Prioridad: CORS_ORIGINS (lista separada por comas) > FRONTEND_URL (+ PRODUCTION_FRONTEND_URL en prod).
        """
        if self.CORS_ORIGINS:
            items = [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]
            return items or [self.FRONTEND_URL]
        origins = [self.FRONTEND_URL]
        if self.ENVIRONMENT == "pro" and self.PRODUCTION_FRONTEND_URL:
            origins.append(self.PRODUCTION_FRONTEND_URL)
        return origins

    @property
    def firebase_credentials(self) -> Optional[dict]:
        """Construye dict de credenciales Firebase para firebase_admin.credentials.Certificate.
        Intenta en orden: base64, JSON plano, variables individuales.
        """
        # Base64
        if self.FIREBASE_SERVICE_ACCOUNT_JSON_B64:
            try:
                raw = base64.b64decode(self.FIREBASE_SERVICE_ACCOUNT_JSON_B64)
                return json.loads(raw)
            except Exception as exc:  # pragma: no cover - logging eventual
                raise RuntimeError(
                    "FIREBASE_SERVICE_ACCOUNT_JSON_B64 inválido"
                ) from exc

        # JSON plano
        if self.FIREBASE_SERVICE_ACCOUNT_KEY:
            try:
                return json.loads(self.FIREBASE_SERVICE_ACCOUNT_KEY)
            except json.JSONDecodeError:
                raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_KEY no es JSON válido")

        # Variables individuales
        if (
            self.FIREBASE_PROJECT_ID
            and self.FIREBASE_PRIVATE_KEY
            and self.FIREBASE_CLIENT_EMAIL
        ):
            return {
                "type": self.FIREBASE_TYPE,
                "project_id": self.FIREBASE_PROJECT_ID,
                "private_key_id": self.FIREBASE_PRIVATE_KEY_ID,
                "private_key": self.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                "client_email": self.FIREBASE_CLIENT_EMAIL,
                "client_id": self.FIREBASE_CLIENT_ID,
                "auth_uri": self.FIREBASE_AUTH_URI,
                "token_uri": self.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{(self.FIREBASE_CLIENT_EMAIL or '').replace('@', '%40')}",
                "universe_domain": "googleapis.com",
            }
        return None

    @property
    def is_pro(self) -> bool:
        return self.ENVIRONMENT == "pro"

    @property
    def is_test(self) -> bool:
        return self.ENVIRONMENT == "test"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
