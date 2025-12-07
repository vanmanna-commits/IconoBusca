import httpx
from typing import List
from config import get_settings
from schemas import ImageSource
import base64

class ShutterstockService:
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.shutterstock.com/v2"
        self._access_token = None
    
    async def _get_access_token(self):
        """Obtém access token OAuth2 do Shutterstock"""
        if self._access_token:
            return self._access_token
            
        try:
            credentials = f"{self.settings.shutterstock_client_id}:{self.settings.shutterstock_client_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_credentials}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            data = {
                'grant_type': 'client_credentials',
                'realm': 'customer'
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://api.shutterstock.com/v2/oauth/access_token',
                    headers=headers,
                    data=data,
                    timeout=10.0
                )
                response.raise_for_status()
                token_data = response.json()
                self._access_token = token_data['access_token']
                return self._access_token
        except Exception as e:
            print(f"Erro ao obter token Shutterstock: {e}")
            return None
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20) -> List[ImageSource]:
        if not self.settings.shutterstock_client_id or not self.settings.shutterstock_client_secret:
            return []
        
        try:
            access_token = await self._get_access_token()
            if not access_token:
                return []
            
            headers = {
                'Authorization': f'Bearer {access_token}',
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