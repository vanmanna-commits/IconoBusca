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
  const [selectedSources, setSelectedSources] = useState(['google', 'unsplash', 'pexels', 'pixabay']);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [sortBy, setSortBy] = useState('relevant');
  const [hasMore, setHasMore] = useState(true);

  const performSearch = useCallback(async (query, page = 1, sources = selectedSources, orderBy = sortBy, append = false) => {
    if (!query.trim()) {
      setError('Por favor, insira uma consulta de busca');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sourcesString = sources.join(',');
      const response = await axios.get(`${BACKEND_URL}/api/search`, {
        params: {
          query,
          page,
          per_page: 20,
          sources: sourcesString,
          order_by: orderBy
        },
        timeout: 30000
      });

      setImages(response.data.images);
      setTotalResults(response.data.total_results);
      setSearchTime(response.data.search_time_ms);
      setSearchQuery(query);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.detail || 'Falha ao buscar imagens');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSources, sortBy]);

  return {
    images,
    loading,
    error,
    searchQuery,
    currentPage,
    selectedSources,
    totalResults,
    searchTime,
    sortBy,
    performSearch,
    setSelectedSources,
    setCurrentPage,
    setSortBy
  };
};