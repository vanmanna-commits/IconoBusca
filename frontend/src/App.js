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
    error,
    selectedSources,
    totalResults,
    searchTime,
    searchQuery,
    sortBy,
    performSearch,
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Hero Section */}
      <div className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <h1 
            data-testid="main-heading"
            className="text-5xl md:text-7xl font-medium tracking-tight leading-tight mb-6" 
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#1A1A1A'
            }}
          >
            Find the perfect image.
          </h1>
          <p 
            className="text-lg md:text-xl leading-relaxed font-light mb-12" 
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: '#71717A' 
            }}
          >
            Busque em Unsplash, Pexels, Pixabay e mais fontes simultaneamente
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
              <div 
                data-testid="search-results-info"
                className="mb-8 text-xs tracking-widest uppercase font-semibold" 
                style={{ 
                  fontFamily: 'Manrope, sans-serif',
                  color: '#A1A1AA' 
                }}
              >
                {totalResults} imagens · {searchTime.toFixed(0)}ms
              </div>
            )}
            <ImageGrid images={images} isLoading={loading} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;