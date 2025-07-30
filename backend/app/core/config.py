from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "your_secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()