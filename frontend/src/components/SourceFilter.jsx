import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const FREE_SOURCES = [
  { id: 'google', label: 'Google Images' },
  { id: 'unsplash', label: 'Unsplash' },
  { id: 'pexels', label: 'Pexels' },
  { id: 'pixabay', label: 'Pixabay' },
  { id: 'creative_commons', label: 'Creative Commons' }
];

export const SourceFilter = ({ selectedSources, onChange }) => {
  const handleSourceToggle = (sourceId) => {
    const updated = selectedSources.includes(sourceId)
      ? selectedSources.filter(s => s !== sourceId)
      : [...selectedSources, sourceId];
    onChange(updated);
  };

  return (
    <motion.div 
      className="sticky top-8 p-6 rounded-lg"
      style={{
        backgroundColor: '#1C1C1C',
        border: '1px solid #2A2A2A'
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 
        className="text-xs tracking-widest uppercase font-medium mb-6"
        style={{ 
          fontFamily: 'JetBrains Mono, monospace',
          color: '#A1A1A1'
        }}
      >
        Fontes
      </h3>
      <div className="space-y-3">
        {FREE_SOURCES.map((source) => (
          <div key={source.id} className="flex items-center space-x-3">
            <Checkbox
              data-testid={`source-checkbox-${source.id}`}
              id={source.id}
              checked={selectedSources.includes(source.id)}
              onCheckedChange={() => handleSourceToggle(source.id)}
            />
            <Label 
              htmlFor={source.id} 
              className="cursor-pointer text-sm"
              style={{ 
                fontFamily: 'Manrope, sans-serif',
                color: '#FFFFFF'
              }}
            >
              {source.label}
            </Label>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SourceFilter;