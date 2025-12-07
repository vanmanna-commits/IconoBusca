import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FaGoogle, FaImages } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FREE_SOURCES = [
  { id: 'google', label: 'Google Custom Search', icon: <FaGoogle className="w-4 h-4" /> },
  { id: 'unsplash', label: 'Unsplash', icon: <FaImages className="w-4 h-4" /> },
  { id: 'pexels', label: 'Pexels', icon: <FaImages className="w-4 h-4" /> },
  { id: 'pixabay', label: 'Pixabay', icon: <FaImages className="w-4 h-4" /> }
];

const PAID_SOURCES = [
  { id: 'shutterstock', label: 'Shutterstock 💰', icon: <FaImages className="w-4 h-4" /> },
  { id: 'getty_images', label: 'Getty Images 💰', icon: <FaImages className="w-4 h-4" /> },
  { id: 'istock', label: 'iStock 💰', icon: <FaImages className="w-4 h-4" /> },
  { id: 'pulsar_imagens', label: 'Pulsar Imagens 💰', icon: <FaImages className="w-4 h-4" /> }
];

const PAID_SOURCES_BR = [
  { id: 'fotoarena', label: 'Foto Arena 🇧🇷', icon: <FaImages className="w-4 h-4" /> },
  { id: 'usp_imagens', label: 'USP Imagens 🇧🇷', icon: <FaImages className="w-4 h-4" /> },
  { id: 'tyba', label: 'Tyba 🇧🇷', icon: <FaImages className="w-4 h-4" /> },
  { id: 'natureza_brasileira', label: 'Natureza Brasileira 🇧🇷', icon: <FaImages className="w-4 h-4" /> },
  { id: 'fabio_colombini', label: 'Fabio Colombini 🇧🇷', icon: <FaImages className="w-4 h-4" /> }
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
      className="p-6 rounded-lg"
      style={{
        backgroundColor: '#18181b',
        border: '1px solid #27272a'
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 
        className="font-semibold text-sm mb-4"
        style={{ 
          fontFamily: 'Manrope, sans-serif',
          color: '#fafafa',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        Fontes Gratuitas
      </h3>
      <div className="space-y-3 mb-6">
        {FREE_SOURCES.map((source) => (
          <div key={source.id} className="flex items-center space-x-3">
            <Checkbox
              data-testid={`source-checkbox-${source.id}`}
              id={source.id}
              checked={selectedSources.includes(source.id)}
              onCheckedChange={() => handleSourceToggle(source.id)}
              style={{
                borderColor: '#3f3f46'
              }}
            />
            <Label 
              htmlFor={source.id} 
              className="cursor-pointer flex items-center gap-2"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#d4d4d8',
                fontSize: '0.875rem'
              }}
            >
              {source.icon}
              {source.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="border-t pt-4" style={{ borderColor: '#27272a' }}>
        <h3 
          className="font-semibold text-sm mb-4"
          style={{ 
            fontFamily: 'Manrope, sans-serif',
            color: '#fafafa',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          Fontes Pagas
        </h3>
        <div className="space-y-3">
          {PAID_SOURCES.map((source) => (
            <div key={source.id} className="flex items-center space-x-3">
              <Checkbox
                data-testid={`source-checkbox-${source.id}`}
                id={source.id}
                checked={selectedSources.includes(source.id)}
                onCheckedChange={() => handleSourceToggle(source.id)}
                style={{
                  borderColor: '#3f3f46'
                }}
              />
              <Label 
                htmlFor={source.id} 
                className="cursor-pointer flex items-center gap-2"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#d4d4d8',
                  fontSize: '0.875rem'
                }}
              >
                {source.icon}
                {source.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#71717a' }}>
          * Fontes pagas requerem API key e licença para download
        </p>
      </div>
    </motion.div>
  );
};

export default SourceFilter;