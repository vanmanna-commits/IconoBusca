import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class AgenciaBrasilService:
    """Agência Brasil (EBC) - Fotos jornalísticas"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://agenciabrasil.ebc.com.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20, order_by: str = 'relevant') -> List[ImageSource]:
        if not self.settings.agencia_brasil_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.agencia_brasil_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'q': query,
                'page': page,
                'per_page': min(per_page, 50)
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
                    title=item.get('titulo', 'Foto Agência Brasil'),
                    description=item.get('descricao'),
                    thumbnail_url=item.get('thumbnail', ''),
                    regular_url=item.get('url_media', ''),
                    raw_url=item.get('url_original', ''),
                    photographer=item.get('fotografo'),
                    photographer_url=None,
                    source='agencia_brasil',
                    source_url=item.get('url', self.base_url),
                    download_url=item.get('url_download', ''),
                    license='public',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Agência Brasil: {e}")
            return []

agencia_brasil_service = AgenciaBrasilService()