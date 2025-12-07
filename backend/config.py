from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache
import os

class Settings(BaseSettings):
    model_config = ConfigDict(extra="ignore", env_file=".env")
    
    # APIs Gratuitas
    google_api_key: str = ""
    google_search_engine_id: str = ""
    unsplash_api_key: str = ""
    pexels_api_key: str = ""
    pixabay_api_key: str = ""
    
    # APIs Pagas Internacionais
    shutterstock_client_id: str = ""
    shutterstock_client_secret: str = ""
    getty_images_api_key: str = ""
    istock_api_key: str = ""
    pulsar_imagens_api_key: str = ""
    
    # APIs Pagas Brasileiras
    fotoarena_api_key: str = ""
    usp_imagens_api_key: str = ""
    tyba_api_key: str = ""
    natureza_brasileira_api_key: str = ""
    fabio_colombini_api_key: str = ""
    
    # Freepik
    freepik_api_key: str = ""
    
    # Database
    mongo_url: str = "mongodb://localhost:27017"
    db_name: str = "image_search"
    cors_origins: str = "*"

@lru_cache()
def get_settings():
    return Settings()