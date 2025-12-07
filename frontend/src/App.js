import { useState } from 'react';
import '@/App.css';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import SourceFilter from './components/SourceFilter';
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
    performSearch,
    setSelectedSources
  } = useImageSearch();

  const handleSearch = async (query) => {
    await performSearch(query, 1, selectedSources);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#09090b' }}>
      <div className="container mx-auto px-8 md:px-12 py-12">
        <div className="text-center mb-12">
          <h1 
            data-testid="main-heading"
            className="text-5xl lg:text-6xl font-extrabold mb-4" 
            style={{ 
              fontFamily: 'Manrope, sans-serif',
              color: '#fafafa',
              letterSpacing: '-0.02em'
            }}
          >
            Lumina Search
          </h1>
          <p 
            className="text-lg" 
            style={{ 
              fontFamily: 'Inter, sans-serif',
              color: '#a1a1aa' 
            }}
          >
            Busque imagens em Google, Unsplash, Pexels e Pixabay simultaneamente
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {error && (
          <div 
            data-testid="error-message"
            className="mb-6 p-4 rounded-lg" 
            style={{ backgroundColor: '#27272a', color: '#fca5a5', border: '1px solid #3f3f46' }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <SourceFilter
              selectedSources={selectedSources}
              onChange={setSelectedSources}
            />
          </div>

          <div className="lg:col-span-4">
            {searchQuery && images.length > 0 && (
              <div 
                data-testid="search-results-info"
                className="mb-6" 
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.875rem',
                  color: '#a1a1aa' 
                }}
              >
                {totalResults} imagens encontradas em {searchTime.toFixed(0)}ms
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