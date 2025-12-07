import React, { useState } from 'react';
import ImageModal from './ImageModal';
import LicenseBadge from './LicenseBadge';
import { FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';

const breakpointColumns = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 1
};

export const ImageGrid = ({ images, isLoading, searchQuery }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownload = async (image) => {
    try {
      const response = await fetch(image.regular_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${image.title || 'image'}-${image.image_id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  };

  if (isLoading) {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-6 -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded-lg mb-6 animate-pulse"
            style={{ 
              backgroundColor: '#1C1C1C',
              height: `${250 + Math.random() * 150}px`,
              border: '1px solid #2A2A2A'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </Masonry>
    );
  }

  if (!searchQuery) {
    return (
      <div data-testid="initial-state" className="text-center py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p 
            className="text-xl font-light" 
            style={{ fontFamily: 'Manrope, sans-serif', color: '#A1A1AA' }}
          >
            Digite algo para começar sua busca
          </p>
        </motion.div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div data-testid="no-results" className="text-center py-32">
        <p 
          className="text-xl font-light" 
          style={{ fontFamily: 'Manrope, sans-serif', color: '#A1A1AA' }}
        >
          Nenhuma imagem encontrada
        </p>
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-8 -ml-8"
        columnClassName="pl-8 bg-clip-padding"
      >
        {images.map((image, index) => (
          <motion.div
            key={`${image.source}-${image.image_id}`}
            data-testid="image-card"
            className="group overflow-hidden mb-8"
            style={{ backgroundColor: '#F4F4F5' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
          >
            <div 
              className="relative cursor-pointer overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.thumbnail_url}
                alt={image.title}
                className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                loading="lazy"
                style={{ display: 'block' }}
              />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              >
                <button
                  data-testid="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image);
                  }}
                  className="p-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  aria-label="Download image"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs tracking-widest uppercase font-semibold"
                  style={{ color: '#A1A1AA' }}
                >
                  {image.source}
                </span>
                <LicenseBadge license={image.license} size="xs" />
              </div>
              
              <h3 
                className="text-sm font-medium mb-2 line-clamp-2"
                style={{ 
                  color: '#1A1A1A',
                  fontFamily: 'Manrope, sans-serif',
                  minHeight: '2.5rem'
                }}
              >
                {image.title}
              </h3>
              
              {image.photographer && (
                <p 
                  className="text-xs font-light"
                  style={{ color: '#71717A' }}
                >
                  por {image.photographer}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </Masonry>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={() => handleDownload(selectedImage)}
        />
      )}
    </>
  );
};

export default ImageGrid;