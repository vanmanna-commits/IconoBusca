import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class GoogleSearchService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://www.googleapis.com/customsearch/v1"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 10) -> List[ImageSource]:
        if not self.settings.google_api_key or not self.settings.google_search_engine_id:
            return []
        
        try:
            start_index = (page - 1) * per_page + 1
            params = {
                'q': query,
                'cx': self.settings.google_search_engine_id,
                'key': self.settings.google_api_key,
                'searchType': 'image',
                'start': start_index,
                'num': min(per_page, 10)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.base_url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
            
            images = []
            if 'items' in data:
                for item in data['items']:
                    images.append(ImageSource(
                        title=item.get('title', ''),
                        description=item.get('snippet', ''),
                        thumbnail_url=item.get('image', {}).get('thumbnailLink', ''),
                        regular_url=item.get('link', ''),
                        raw_url=None,
                        photographer=None,
                        photographer_url=None,
                        source='google',
                        source_url=item.get('image', {}).get('contextLink', ''),
                        download_url=item.get('link', ''),
                        license='various',
                        image_id=item.get('cacheId', item.get('link', '').split('/')[-1])
                    ))
            return images
        except Exception as e:
            print(f"Error searching Google Images: {e}")
            return []

google_service = GoogleSearchService()