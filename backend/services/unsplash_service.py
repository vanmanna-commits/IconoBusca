import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class UnsplashService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.unsplash.com"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.unsplash_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Client-ID {self.settings.unsplash_api_key}',
                'Accept-Version': 'v1'
            }
            params = {
                'query': query,
                'page': page,
                'per_page': min(per_page, 20),
                'order_by': 'relevant'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/search/photos",
                    params=params,
                    headers=headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for photo in data.get('results', []):
                images.append(ImageSource(
                    title=photo.get('description') or photo.get('alt_description') or 'Untitled',
                    description=photo.get('alt_description'),
                    thumbnail_url=photo['urls']['thumb'],
                    regular_url=photo['urls']['regular'],
                    raw_url=photo['urls']['raw'],
                    photographer=photo['user']['name'],
                    photographer_url=photo['user']['links']['html'],
                    source='unsplash',
                    source_url=photo['links']['html'],
                    download_url=photo['links']['download_location'],
                    license='free',
                    image_id=photo['id']
                ))
            return images
        except Exception as e:
            print(f"Error searching Unsplash: {e}")
            return []

unsplash_service = UnsplashService()