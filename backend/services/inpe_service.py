import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class INPEService:
    """INPE DGI - Catálogo de imagens de satélite"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://www.dgi.inpe.br/catalogo"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20, order_by: str = 'relevant') -> List[ImageSource]:
        if not self.settings.inpe_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.inpe_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'search': query,
                'page': page,
                'limit': min(per_page, 100)
            }
            
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    f"{self.base_url}/api/images",
                    headers=headers,
                    params=params,
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('results', []):
                images.append(ImageSource(
                    title=item.get('title', 'Imagem INPE'),
                    description=item.get('description'),
                    thumbnail_url=item.get('thumbnail_url', ''),
                    regular_url=item.get('preview_url', ''),
                    raw_url=item.get('full_url', ''),
                    photographer='INPE',
                    photographer_url='https://www.inpe.br',
                    source='inpe',
                    source_url=item.get('url', self.base_url),
                    download_url=item.get('download_url', ''),
                    license='public',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar INPE: {e}")
            return []

inpe_service = INPEService()