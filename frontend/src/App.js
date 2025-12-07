import { useState } from 'react';
import '@/App.css';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import SourceFilter from './components/SourceFilter';
import SortSelect from './components/SortSelect';
import { useImageSearch } from './hooks/useImageSearch';

function App() {
  const {
    images,
    loading,
    loadingMore,
    error,
    selectedSources,
    totalResults,
    searchTime,
    searchQuery,
    sortBy,
    hasMore,
    performSearch,
    loadMore,
    setSelectedSources,
    setSortBy
  } = useImageSearch();

  const handleSearch = async (query) => {
    await performSearch(query, 1, selectedSources, sortBy);
  };

  const handleSortChange = async (newSortBy) => {
    setSortBy(newSortBy);
    if (searchQuery) {
      await performSearch(searchQuery, 1, selectedSources, newSortBy);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#121212' }}>
      {/* Hero Section */}
      <div className="py-16 md:py-24" style={{ 
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)'
      }}>
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h1 
            data-testid="main-heading"
            className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4" 
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: '#FFFFFF'
            }}
          >
            Lumina Search
          </h1>
          <p 
            className="text-base leading-relaxed mb-12" 
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: '#A1A1A1' 
            }}
          >
            Busca profissional em múltiplas fontes simultaneamente
          </p>

          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
          <div 
            data-testid="error-message"
            className="p-4 rounded-lg" 
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <SourceFilter
              selectedSources={selectedSources}
              onChange={setSelectedSources}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {searchQuery && images.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <div 
                  data-testid="search-results-info"
                  className="text-xs tracking-widest uppercase font-semibold" 
                  style={{ 
                    fontFamily: 'Manrope, sans-serif',
                    color: '#A1A1AA' 
                  }}
                >
                  {totalResults} imagens · {searchTime.toFixed(0)}ms
                </div>
                <SortSelect value={sortBy} onChange={handleSortChange} />
              </div>
            )}
            <ImageGrid images={images} isLoading={loading} searchQuery={searchQuery} />
            
            {/* Load More Button */}
            {searchQuery && images.length > 0 && hasMore && !loading && (
              <div className="flex justify-center mt-12 mb-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-4 rounded-full font-medium transition-all duration-300"
                  style={{
                    backgroundColor: loadingMore ? '#E4E4E7' : '#1A1A1A',
                    color: '#FFFFFF',
                    fontFamily: 'Manrope, sans-serif',
                    opacity: loadingMore ? 0.6 : 1,
                    cursor: loadingMore ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {loadingMore ? 'Carregando...' : 'Carregar Mais Imagens'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;