import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class FabioColombiniService:
    """Fabio Colombini - Fotografia de natureza"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://www.fabiocolombini.com.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.fabio_colombini_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.fabio_colombini_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'q': query,
                'page': page,
                'per_page': min(per_page, 50)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/search",
                    headers=headers,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('photos', []):
                images.append(ImageSource(
                    title=item.get('title', 'Foto Fabio Colombini'),
                    description=item.get('description'),
                    thumbnail_url=item.get('thumbnail', ''),
                    regular_url=item.get('preview', ''),
                    raw_url=item.get('full', ''),
                    photographer='Fabio Colombini',
                    photographer_url=self.base_url,
                    source='fabio_colombini',
                    source_url=item.get('url', self.base_url),
                    download_url='',
                    license='paid',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Fabio Colombini: {e}")
            return []

colombini_service = FabioColombiniService()