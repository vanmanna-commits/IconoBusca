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
      className="w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="relative"
        style={{
          backgroundColor: 'rgba(24, 24, 27, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
          border: '1px solid #27272a'
        }}
      >
        <input
          data-testid="search-input"
          type="text"
          placeholder="Buscar imagens..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          className="w-full px-6 py-6 pr-24 text-xl rounded-2xl focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'transparent',
            color: '#fafafa',
            fontFamily: 'Inter, sans-serif',
            border: 'none',
            '::placeholder': { color: '#52525b' }
          }}
        />
        <button
          data-testid="search-button"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-3 rounded-full font-medium transition-all duration-200"
          style={{
            backgroundColor: '#fafafa',
            color: '#09090b',
            fontFamily: 'Inter, sans-serif',
            opacity: isLoading || !query.trim() ? 0.5 : 1,
            cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          <FiSearch className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;