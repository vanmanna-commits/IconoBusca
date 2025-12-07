import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class IBGEService:
    """IBGE Cidades - Fotos e dados das cidades brasileiras"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://cidades.ibge.gov.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20, order_by: str = 'relevant') -> List[ImageSource]:
        if not self.settings.ibge_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.ibge_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'cidade': query,
                'pagina': page,
                'quantidade': min(per_page, 50)
            }
            
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    f"{self.base_url}/api/fotos",
                    headers=headers,
                    params=params,
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('fotos', []):
                images.append(ImageSource(
                    title=item.get('titulo', 'Foto IBGE'),
                    description=item.get('descricao'),
                    thumbnail_url=item.get('miniatura', ''),
                    regular_url=item.get('media', ''),
                    raw_url=item.get('alta', ''),
                    photographer='IBGE',
                    photographer_url='https://www.ibge.gov.br',
                    source='ibge',
                    source_url=item.get('url', self.base_url),
                    download_url=item.get('download', ''),
                    license='public',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar IBGE: {e}")
            return []

ibge_service = IBGEService()