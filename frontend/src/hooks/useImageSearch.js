import { useState, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useImageSearch = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSources, setSelectedSources] = useState(['google', 'unsplash', 'pexels', 'pixabay', 'creative_commons']);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [sortBy, setSortBy] = useState('relevant');
  const [hasMore, setHasMore] = useState(true);

  const performSearch = useCallback(async (query, page = 1, sources = selectedSources, orderBy = sortBy, append = false) => {
    if (!query.trim()) {
      setError('Por favor, insira uma consulta de busca');
      return;
    }

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const sourcesString = sources.join(',');
      const response = await axios.get(`${BACKEND_URL}/api/search`, {
        params: {
          query,
          page,
          per_page: 50,
          sources: sourcesString,
          order_by: orderBy
        },
        timeout: 30000
      });

      if (append) {
        setImages(prev => [...prev, ...response.data.images]);
      } else {
        setImages(response.data.images);
      }
      
      setTotalResults(response.data.total_results);
      setSearchTime(response.data.search_time_ms);
      setSearchQuery(query);
      setCurrentPage(page);
      // Considerar que há mais resultados se recebemos imagens
      setHasMore(response.data.images.length > 0);
    } catch (err) {
      setError(err.response?.data?.detail || 'Falha ao buscar imagens');
      if (!append) {
        setImages([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedSources, sortBy]);

  const loadMore = useCallback(async () => {
    if (!searchQuery || loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    await performSearch(searchQuery, nextPage, selectedSources, sortBy, true);
  }, [searchQuery, currentPage, selectedSources, sortBy, loadingMore, hasMore, performSearch]);

  return {
    images,
    loading,
    loadingMore,
    error,
    searchQuery,
    currentPage,
    selectedSources,
    totalResults,
    searchTime,
    sortBy,
    hasMore,
    performSearch,
    loadMore,
    setSelectedSources,
    setCurrentPage,
    setSortBy
  };
};