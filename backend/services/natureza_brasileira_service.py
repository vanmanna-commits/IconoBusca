import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class NaturezaBrasileiraService:
    """Natureza Brasileira - Banco de imagens de natureza"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://www.naturezabrasileira.com.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.natureza_brasileira_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.natureza_brasileira_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'busca': query,
                'pagina': page,
                'itens': min(per_page, 50)
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
            for item in data.get('fotos', []):
                images.append(ImageSource(
                    title=item.get('titulo', 'Natureza Brasileira'),
                    description=item.get('descricao'),
                    thumbnail_url=item.get('miniatura', ''),
                    regular_url=item.get('media', ''),
                    raw_url=item.get('alta', ''),
                    photographer=item.get('fotografo'),
                    photographer_url=None,
                    source='natureza_brasileira',
                    source_url=item.get('link', self.base_url),
                    download_url='',
                    license='paid',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Natureza Brasileira: {e}")
            return []

natureza_brasileira_service = NaturezaBrasileiraService()