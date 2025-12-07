import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class TybaService:
    """Tyba - Banco de imagens brasileiro"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://tyba.com.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.tyba_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.tyba_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'query': query,
                'page': page,
                'limit': min(per_page, 50)
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
            for item in data.get('images', []):
                images.append(ImageSource(
                    title=item.get('title', 'Imagem Tyba'),
                    description=item.get('description'),
                    thumbnail_url=item.get('thumb', ''),
                    regular_url=item.get('preview', ''),
                    raw_url=item.get('full', ''),
                    photographer=item.get('author'),
                    photographer_url=None,
                    source='tyba',
                    source_url=item.get('url', self.base_url),
                    download_url='',
                    license='paid',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Tyba: {e}")
            return []

tyba_service = TybaService()