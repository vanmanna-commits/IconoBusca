import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class PulsarImagensService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://www.pulsarimagens.com.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.pulsar_imagens_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.pulsar_imagens_api_key}',
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
            for item in data.get('results', []):
                images.append(ImageSource(
                    title=item.get('title', 'Imagem Pulsar'),
                    description=item.get('description'),
                    thumbnail_url=item.get('thumbnail_url', ''),
                    regular_url=item.get('preview_url', ''),
                    raw_url=item.get('high_res_url', ''),
                    photographer=item.get('photographer'),
                    photographer_url=None,
                    source='pulsar_imagens',
                    source_url=item.get('image_url', self.base_url),
                    download_url='',
                    license='paid',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Pulsar Imagens: {e}")
            return []

pulsar_service = PulsarImagensService()