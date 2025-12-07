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

@app.get("/api/search", response_model=SearchResponse)
async def search_images(
    query: str = Query(..., min_length=1, max_length=100),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    sources: str = Query("google,unsplash,pexels,pixabay")
):
    if not query:
        raise HTTPException(status_code=400, detail="Query de busca é obrigatória")
    
    source_list = [s.strip() for s in sources.split(",")]
    valid_sources = ["google", "unsplash", "pexels", "pixabay"]
    source_list = [s for s in source_list if s in valid_sources]
    
    if not source_list:
        raise HTTPException(status_code=400, detail="Nenhuma fonte válida especificada")
    
    start_time = time.time()
    
    tasks = []
    if "google" in source_list:
        tasks.append(google_service.search_images(query, page, per_page))
    if "unsplash" in source_list:
        tasks.append(unsplash_service.search_images(query, page, per_page))
    if "pexels" in source_list:
        tasks.append(pexels_service.search_images(query, page, per_page))
    if "pixabay" in source_list:
        tasks.append(pixabay_service.search_images(query, page, per_page))
    
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