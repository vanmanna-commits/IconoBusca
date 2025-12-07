import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class USPImagensService:
    """Banco de Imagens da USP"""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://imagens.usp.br"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.usp_imagens_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.usp_imagens_api_key}',
                'Accept': 'application/json'
            }
            params = {
                'busca': query,
                'pagina': page,
                'quantidade': min(per_page, 50)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/buscar",
                    headers=headers,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('imagens', []):
                images.append(ImageSource(
                    title=item.get('titulo', 'Imagem USP'),
                    description=item.get('descricao'),
                    thumbnail_url=item.get('miniatura', ''),
                    regular_url=item.get('preview', ''),
                    raw_url=item.get('original', ''),
                    photographer=item.get('fotografo'),
                    photographer_url=None,
                    source='usp_imagens',
                    source_url=item.get('url', self.base_url),
                    download_url='',
                    license='academic',
                    image_id=str(item.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar USP Imagens: {e}")
            return []

usp_service = USPImagensService()