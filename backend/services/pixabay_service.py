import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class PixabayService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://pixabay.com/api"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.pixabay_api_key:
            return []
        
        try:
            params = {
                'key': self.settings.pixabay_api_key,
                'q': query,
                'page': page,
                'per_page': min(per_page, 200),
                'image_type': 'photo',
                'order': 'popular'
            }
            
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(self.base_url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
            
            images = []
            for hit in data.get('hits', []):
                images.append(ImageSource(
                    title=f"Foto por {hit['user']}",
                    description=hit.get('tags'),
                    thumbnail_url=hit['previewURL'],
                    regular_url=hit['webformatURL'],
                    raw_url=hit['largeImageURL'],
                    photographer=hit.get('user'),
                    photographer_url=f"https://pixabay.com/users/{hit.get('user')}-{hit.get('user_id')}/",
                    source='pixabay',
                    source_url=f"https://pixabay.com/photos/{hit['id']}/",
                    download_url=hit['largeImageURL'],
                    license='free',
                    image_id=str(hit['id'])
                ))
            return images
        except Exception as e:
            print(f"Error searching Pixabay: {e}")
            return []

pixabay_service = PixabayService()