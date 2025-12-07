import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class PexelsService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.pexels.com/v1"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20, order_by: str = 'relevant') -> List[ImageSource]:
        if not self.settings.pexels_api_key:
            return []
        
        try:
            headers = {'Authorization': self.settings.pexels_api_key}
            params = {
                'query': query,
                'page': page,
                'per_page': min(per_page, 80)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params,
                    headers=headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for photo in data.get('photos', []):
                images.append(ImageSource(
                    title=f"Foto por {photo['photographer']}",
                    description=None,
                    thumbnail_url=photo['src']['tiny'],
                    regular_url=photo['src']['medium'],
                    raw_url=photo['src']['original'],
                    photographer=photo.get('photographer'),
                    photographer_url=photo.get('photographer_url'),
                    source='pexels',
                    source_url=photo['url'],
                    download_url=photo['src']['original'],
                    license='free',
                    image_id=str(photo['id'])
                ))
            return images
        except Exception as e:
            print(f"Error searching Pexels: {e}")
            return []

pexels_service = PexelsService()