import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class ShutterstockService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.shutterstock.com/v2"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.shutterstock_api_key:
            return []
        
        try:
            headers = {
                'Authorization': f'Bearer {self.settings.shutterstock_api_key}',
                'User-Agent': 'LuminaSearchAPI/1.0'
            }
            params = {
                'query': query,
                'per_page': min(per_page, 100),
                'page': page,
                'view': 'minimal'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/images/search",
                    headers=headers,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for item in data.get('data', []):
                images.append(ImageSource(
                    title=item.get('description', 'Imagem Shutterstock'),
                    description=item.get('description'),
                    thumbnail_url=item['assets']['thumbnail']['url'],
                    regular_url=item['assets']['preview']['url'],
                    raw_url=item['assets']['preview']['url'],
                    photographer=item.get('contributor', {}).get('name'),
                    photographer_url=None,
                    source='shutterstock',
                    source_url=f"https://www.shutterstock.com/image-photo/{item['id']}",
                    download_url='',
                    license='paid',
                    image_id=str(item['id'])
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Shutterstock: {e}")
            return []

shutterstock_service = ShutterstockService()