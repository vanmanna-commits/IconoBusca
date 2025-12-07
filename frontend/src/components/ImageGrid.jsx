import React, { useState } from 'react';
import ImageModal from './ImageModal';
import { FiDownload } from 'react-icons/fi';
import { FaGoogle, FaImages } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';

const SOURCE_ICONS = {
  google: <FaGoogle className="w-4 h-4" />,
  unsplash: <FaImages className="w-4 h-4" />,
  pexels: <FaImages className="w-4 h-4" />,
  pixabay: <FaImages className="w-4 h-4" />
};

const breakpointColumns = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
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
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded-lg mb-6 animate-pulse"
            style={{ 
              backgroundColor: '#18181b',
              height: `${200 + Math.random() * 100}px`
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
      <div data-testid="initial-state" className="text-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaImages className="w-24 h-24 mx-auto mb-6" style={{ color: '#52525b' }} />
          <p className="text-xl" style={{ fontFamily: 'Inter, sans-serif', color: '#a1a1aa' }}>
            Digite algo na busca para começar
          </p>
        </motion.div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div data-testid="no-results" className="text-center py-24">
        <p className="text-xl" style={{ fontFamily: 'Inter, sans-serif', color: '#a1a1aa' }}>
          Nenhuma imagem encontrada. Tente outra busca.
        </p>
      </div>
    );
  }

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-6 -ml-6"
        columnClassName="pl-6 bg-clip-padding"
      >
        {images.map((image, index) => (
          <motion.div
            key={`${image.source}-${image.image_id}`}
            data-testid="image-card"
            className="group overflow-hidden rounded-lg mb-6"
            style={{ backgroundColor: '#18181b' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <div 
              className="relative cursor-zoom-in overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.thumbnail_url}
                alt={image.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                style={{ display: 'block' }}
              />
              <div 
                className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%)'
                }}
              >
                <button
                  data-testid="download-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image);
                  }}
                  className="p-2 rounded-full transition-colors self-end"
                  style={{
                    backgroundColor: 'rgba(250, 250, 250, 0.9)',
                    color: '#09090b'
                  }}
                  aria-label="Download image"
                >
                  <FiDownload className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-3" style={{ backgroundColor: '#18181b' }}>
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: '#27272a',
                    color: '#a1a1aa'
                  }}
                >
                  {SOURCE_ICONS[image.source]}
                  {image.source}
                </div>
              </div>
              
              <h3 
                className="text-sm font-medium mb-1 line-clamp-2"
                style={{ 
                  color: '#fafafa',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: '2.5rem'
                }}
              >
                {image.title}
              </h3>
              
              {image.photographer && (
                <p 
                  className="text-xs line-clamp-1"
                  style={{ 
                    color: '#71717a',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  © {image.photographer}
                </p>
              )}
              
              {image.description && (
                <p 
                  className="text-xs mt-2 line-clamp-2"
                  style={{ 
                    color: '#52525b',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {image.description}
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