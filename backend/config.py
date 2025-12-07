from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    google_api_key: str = ""
    google_search_engine_id: str = ""
    unsplash_api_key: str = ""
    pexels_api_key: str = ""
    pixabay_api_key: str = ""
    mongodb_url: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DB_NAME", "image_search")
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()