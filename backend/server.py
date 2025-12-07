from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import asyncio
from schemas import SearchResponse
from services.google_search import google_service
from services.unsplash_service import unsplash_service
from services.pexels_service import pexels_service
from services.pixabay_service import pixabay_service
from services.shutterstock_service import shutterstock_service
from services.getty_service import getty_service
from services.istock_service import istock_service
from services.pulsar_service import pulsar_service
from services.fotoarena_service import fotoarena_service
from services.usp_service import usp_service
from services.tyba_service import tyba_service
from services.natureza_brasileira_service import natureza_brasileira_service
from services.colombini_service import colombini_service
from services.freepik_service import freepik_service
from services.creative_commons_service import creative_commons_service

app = FastAPI(title="Lumina Search API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/sources")
async def get_available_sources():
    """Retorna lista de fontes disponíveis (gratuitas e pagas)"""
    from config import get_settings
    settings = get_settings()
    
    sources = {
        "free": [
            {"id": "google", "name": "Google Custom Search", "available": bool(settings.google_api_key and settings.google_search_engine_id)},
            {"id": "unsplash", "name": "Unsplash", "available": bool(settings.unsplash_api_key)},
            {"id": "pexels", "name": "Pexels", "available": bool(settings.pexels_api_key)},
            {"id": "pixabay", "name": "Pixabay", "available": bool(settings.pixabay_api_key)}
        ],
        "paid": [
            {"id": "shutterstock", "name": "Shutterstock", "available": bool(settings.shutterstock_client_id and settings.shutterstock_client_secret)},
            {"id": "getty_images", "name": "Getty Images", "available": bool(settings.getty_images_api_key)},
            {"id": "istock", "name": "iStock", "available": bool(settings.istock_api_key)},
            {"id": "pulsar_imagens", "name": "Pulsar Imagens", "available": bool(settings.pulsar_imagens_api_key)},
            {"id": "fotoarena", "name": "Foto Arena", "available": bool(settings.fotoarena_api_key)},
            {"id": "usp_imagens", "name": "USP Imagens", "available": bool(settings.usp_imagens_api_key)},
            {"id": "tyba", "name": "Tyba", "available": bool(settings.tyba_api_key)},
            {"id": "natureza_brasileira", "name": "Natureza Brasileira", "available": bool(settings.natureza_brasileira_api_key)},
            {"id": "fabio_colombini", "name": "Fabio Colombini", "available": bool(settings.fabio_colombini_api_key)},
            {"id": "freepik", "name": "Freepik", "available": bool(settings.freepik_api_key)},
            {"id": "creative_commons", "name": "Creative Commons", "available": True}
        ]
    }
    return sources

@app.get("/api/search", response_model=SearchResponse)
async def search_images(
    query: str = Query(..., min_length=1, max_length=100),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    sources: str = Query("google,unsplash,pexels,pixabay"),
    order_by: str = Query("relevant", regex="^(relevant|latest|oldest)$")
):
    if not query:
        raise HTTPException(status_code=400, detail="Query de busca é obrigatória")
    
    source_list = [s.strip() for s in sources.split(",")]
    valid_sources = ["google", "unsplash", "pexels", "pixabay", "shutterstock", "getty_images", "istock", "pulsar_imagens", "fotoarena", "usp_imagens", "tyba", "natureza_brasileira", "fabio_colombini", "freepik", "creative_commons"]
    source_list = [s for s in source_list if s in valid_sources]
    
    if not source_list:
        raise HTTPException(status_code=400, detail="Nenhuma fonte válida especificada")
    
    start_time = time.time()
    
    tasks = []
    # Fontes gratuitas
    if "google" in source_list:
        tasks.append(google_service.search_images(query, page, per_page))
    if "unsplash" in source_list:
        tasks.append(unsplash_service.search_images(query, page, per_page, order_by))
    if "pexels" in source_list:
        tasks.append(pexels_service.search_images(query, page, per_page, order_by))
    if "pixabay" in source_list:
        tasks.append(pixabay_service.search_images(query, page, per_page, order_by))
    
    # Fontes pagas internacionais
    if "shutterstock" in source_list:
        tasks.append(shutterstock_service.search_images(query, page, per_page))
    if "getty_images" in source_list:
        tasks.append(getty_service.search_images(query, page, per_page))
    if "istock" in source_list:
        tasks.append(istock_service.search_images(query, page, per_page))
    if "pulsar_imagens" in source_list:
        tasks.append(pulsar_service.search_images(query, page, per_page))
    
    # Fontes pagas brasileiras
    if "fotoarena" in source_list:
        tasks.append(fotoarena_service.search_images(query, page, per_page))
    if "usp_imagens" in source_list:
        tasks.append(usp_service.search_images(query, page, per_page))
    if "tyba" in source_list:
        tasks.append(tyba_service.search_images(query, page, per_page))
    if "natureza_brasileira" in source_list:
        tasks.append(natureza_brasileira_service.search_images(query, page, per_page))
    if "fabio_colombini" in source_list:
        tasks.append(colombini_service.search_images(query, page, per_page))
    
    # Freepik
    if "freepik" in source_list:
        tasks.append(freepik_service.search_images(query, page, per_page))
    
    # Creative Commons
    if "creative_commons" in source_list:
        tasks.append(creative_commons_service.search_images(query, page, per_page, order_by))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    all_images = []
    for result in results:
        if not isinstance(result, Exception):
            all_images.extend(result)
    
    search_time_ms = (time.time() - start_time) * 1000
    
    return SearchResponse(
        query=query,
        total_results=len(all_images),
        images=all_images,
        search_time_ms=search_time_ms
    )