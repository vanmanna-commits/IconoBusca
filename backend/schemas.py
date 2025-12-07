from pydantic import BaseModel
from typing import Optional, List

class ImageSource(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail_url: str
    regular_url: str
    raw_url: Optional[str] = None
    photographer: Optional[str] = None
    photographer_url: Optional[str] = None
    source: str
    source_url: str
    download_url: str
    license: str
    image_id: str

class SearchResponse(BaseModel):
    query: str
    total_results: int
    images: List[ImageSource]
    search_time_ms: float