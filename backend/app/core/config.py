from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AetherAlpha API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # External APIs
    OPENAI_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None
    
    # Feature Flags
    USE_MOCK_DATA: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
