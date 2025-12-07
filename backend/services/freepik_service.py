import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class FreepikService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.freepik.com/v1"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.freepik_api_key:
            return []
        
        try:
            headers = {
                'x-freepik-api-key': self.settings.freepik_api_key,
                'Accept': 'application/json'
            }
            params = {
                'term': query,
                'page': page,
                'limit': min(per_page, 100)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/resources",
                    headers=headers,
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for resource in data.get('data', []):
                images.append(ImageSource(
                    title=resource.get('title', 'Imagem Freepik'),
                    description=resource.get('description'),
                    thumbnail_url=resource.get('thumbnail', {}).get('url', ''),
                    regular_url=resource.get('image', {}).get('url', ''),
                    raw_url=resource.get('image', {}).get('source', {}).get('url', ''),
                    photographer=resource.get('author', {}).get('name'),
                    photographer_url=resource.get('author', {}).get('url'),
                    source='freepik',
                    source_url=resource.get('url', ''),
                    download_url=resource.get('url', ''),
                    license='free' if resource.get('premium', False) == False else 'paid',
                    image_id=str(resource.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Freepik: {e}")
            return []

freepik_service = FreepikService()