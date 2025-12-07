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
      transition={{ duration: 0.7 }}
    >
      <div className="relative">
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="w-full h-16 text-lg px-0 py-4 bg-transparent border-b-2 focus:outline-none transition-colors"
          style={{
            borderColor: '#E4E4E7',
            color: '#1A1A1A',
            fontFamily: 'Manrope, sans-serif'
          }}
          onFocus={(e) => e.target.style.borderColor = '#1A1A1A'}
          onBlur={(e) => e.target.style.borderColor = '#E4E4E7'}
        />
        <button
          data-testid="search-button"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-all duration-300"
          style={{
            backgroundColor: isLoading || !query.trim() ? '#E4E4E7' : '#1A1A1A',
            color: '#FFFFFF',
            opacity: isLoading || !query.trim() ? 0.5 : 1,
            cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer'
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