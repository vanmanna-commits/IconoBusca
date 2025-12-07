import React from 'react';
import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Mais Relevante' },
  { value: 'latest', label: 'Mais Recente' },
  { value: 'oldest', label: 'Mais Antiga' }
];

export const SortSelect = ({ value, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3"
    >
      <label 
        htmlFor="sort-select"
        className="text-sm font-medium"
        style={{ 
          fontFamily: 'Manrope, sans-serif',
          color: '#71717A'
        }}
      >
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
        style={{
          fontFamily: 'Manrope, sans-serif',
          backgroundColor: '#F4F4F5',
          color: '#1A1A1A',
          border: '1px solid #E4E4E7',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#1A1A1A';
          e.target.style.backgroundColor = '#FFFFFF';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E4E4E7';
          e.target.style.backgroundColor = '#F4F4F5';
        }}
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default SortSelect;
