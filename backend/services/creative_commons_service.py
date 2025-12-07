import httpx
from typing import List
from config import get_settings
from schemas import ImageSource

class CreativeCommonsService:
    """Creative Commons Search - busca em Flickr, Wikimedia Commons, etc."""
    def __init__(self):
        self.settings = get_settings()
        self.base_url = "https://api.openverse.org/v1"
    
    async def search_images(self, query: str, page: int = 1, per_page: int = 20, license_type: str = None) -> List[ImageSource]:
        try:
            params = {
                'q': query,
                'page': page,
                'page_size': min(per_page, 500)
            }
            
            # Adicionar filtro de licença se especificado
            if license_type:
                params['license_type'] = license_type
            
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(
                    f"{self.base_url}/images",
                    params=params,
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
            
            images = []
            for result in data.get('results', []):
                # Mapear tipo de licença CC
                license_info = self._parse_license(result.get('license', ''))
                
                images.append(ImageSource(
                    title=result.get('title', 'Creative Commons Image'),
                    description=result.get('description'),
                    thumbnail_url=result.get('thumbnail', result.get('url', '')),
                    regular_url=result.get('url', ''),
                    raw_url=result.get('url', ''),
                    photographer=result.get('creator'),
                    photographer_url=result.get('creator_url'),
                    source=f"cc_{result.get('source', 'commons')}",
                    source_url=result.get('foreign_landing_url', ''),
                    download_url=result.get('url', ''),
                    license=license_info,
                    image_id=str(result.get('id', ''))
                ))
            return images
        except Exception as e:
            print(f"Erro ao buscar Creative Commons: {e}")
            return []
    
    def _parse_license(self, license_str: str) -> str:
        """Parse license string to friendly format"""
        license_map = {
            'cc0': 'CC0 (Public Domain)',
            'pdm': 'Public Domain',
            'by': 'CC BY',
            'by-sa': 'CC BY-SA',
            'by-nd': 'CC BY-ND',
            'by-nc': 'CC BY-NC',
            'by-nc-sa': 'CC BY-NC-SA',
            'by-nc-nd': 'CC BY-NC-ND'
        }
        
        license_lower = license_str.lower()
        for key, value in license_map.items():
            if key in license_lower:
                return value
        
        return 'Creative Commons'

creative_commons_service = CreativeCommonsService()
