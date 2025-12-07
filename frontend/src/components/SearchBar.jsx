import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative" 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '0.75rem',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)'
        }}
      >
        <input
          data-testid="search-input"
          type="text"
          placeholder="Buscar imagens..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="w-full h-14 text-base px-6 py-4 pr-16 bg-transparent focus:outline-none"
          style={{
            color: '#FFFFFF',
            fontFamily: 'Manrope, sans-serif',
            border: 'none'
          }}
        />
        <button
          data-testid="search-button"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 transition-all duration-300"
          style={{
            backgroundColor: isLoading || !query.trim() ? '#2A2A2A' : '#FFFFFF',
            color: isLoading || !query.trim() ? '#666666' : '#000000',
            opacity: isLoading || !query.trim() ? 0.5 : 1,
            cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
            borderRadius: '0.375rem'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && query.trim()) {
              e.target.style.transform = 'translateY(-50%) scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;