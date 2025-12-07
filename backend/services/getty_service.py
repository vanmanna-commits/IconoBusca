import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class GettyImagesService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.gettyimages.com/v3"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.getty_images_api_key:
            return []
        
        try:
            headers = {
                'Api-Key': self.settings.getty_images_api_key,
                'Accept': 'application/json'
            }
            params = {
                'phrase': query,
                'page': page,
                'page_size': min(per_page, 100),
                'fields': 'id,title,caption,thumb,preview'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/search/images",
                    headers=headers,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('images', []):
                thumb_url = item.get('display_sizes', [{}])[0].get('uri', '') if item.get('display_sizes') else ''
                images.append(ImageSource(
                    title=item.get('title', 'Imagem Getty Images'),
                    description=item.get('caption'),
                    thumbnail_url=thumb_url,
                    regular_url=thumb_url,
                    raw_url=thumb_url,
                    photographer=None,
                    photographer_url=None,
                    source='getty_images',
                    source_url=f"https://www.gettyimages.com/detail/{item['id']}",
                    download_url='',
                    license='paid',
                    image_id=str(item['id'])
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Getty Images: {e}")
            return []

getty_service = GettyImagesService()