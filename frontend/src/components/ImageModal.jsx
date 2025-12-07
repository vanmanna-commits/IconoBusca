import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LicenseBadge from './LicenseBadge';
import { FiDownload, FiExternalLink, FiX, FiCopy, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const ImageModal = ({ image, onClose, onDownload }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(image.regular_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {image && (
        <Dialog open={!!image} onOpenChange={onClose}>
          <DialogContent 
            data-testid="image-modal"
            className="max-w-5xl p-0 overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid #E4E4E7'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <button
                  data-testid="close-modal-button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#1A1A1A',
                    border: '1px solid #E4E4E7'
                  }}
                >
                  <FiX className="w-5 h-5" />
                </button>
                <img
                  src={image.regular_url}
                  alt={image.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ backgroundColor: '#F4F4F5' }}
                />
              </div>

              <div className="p-8" style={{ backgroundColor: '#FFFFFF' }}>
                <DialogHeader>
                  <DialogTitle 
                    className="text-3xl font-normal mb-4"
                    style={{ 
                      color: '#1A1A1A', 
                      fontFamily: 'Playfair Display, serif'
                    }}
                  >
                    {image.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <span 
                      className="px-3 py-1 rounded-full text-xs tracking-widest uppercase font-semibold"
                      style={{ 
                        backgroundColor: '#F4F4F5',
                        color: '#71717A'
                      }}
                    >
                      {image.source}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: image.license === 'paid' ? '#FEF3C7' : '#DCFCE7',
                        color: image.license === 'paid' ? '#92400E' : '#166534'
                      }}
                    >
                      {image.license === 'paid' ? 'Licença Paga' : 'Uso Gratuito'}
                    </span>
                  </div>

                  {image.description && (
                    <p className="text-sm font-light" style={{ color: '#71717A', fontFamily: 'Manrope, sans-serif' }}>
                      {image.description}
                    </p>
                  )}

                  {image.photographer && (
                    <p className="text-sm" style={{ fontFamily: 'Manrope, sans-serif', color: '#1A1A1A' }}>
                      <span style={{ fontWeight: 500 }}>Fotógrafo:</span> {image.photographer}
                    </p>
                  )}

                  <div className="flex gap-3 pt-4 flex-wrap">
                    <Button
                      data-testid="modal-download-button"
                      onClick={onDownload}
                      className="gap-2 rounded-full font-medium transition-all duration-300 px-8 py-6"
                      style={{
                        backgroundColor: '#1A1A1A',
                        color: '#FFFFFF',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </Button>

                    <Button
                      data-testid="copy-url-button"
                      onClick={copyToClipboard}
                      className="gap-2 rounded-full font-medium transition-colors px-6"
                      style={{
                        backgroundColor: '#F4F4F5',
                        color: '#1A1A1A',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                    >
                      <FiCopy className="w-4 h-4" />
                      {copied ? 'Copiado!' : 'Copiar URL'}
                    </Button>

                    <Button
                      data-testid="view-source-button"
                      onClick={() => window.open(image.source_url, '_blank')}
                      className="gap-2 rounded-full font-medium transition-colors px-6"
                      style={{
                        backgroundColor: '#F4F4F5',
                        color: '#1A1A1A',
                        fontFamily: 'Manrope, sans-serif'
                      }}
                    >
                      <FiExternalLink className="w-4 h-4" />
                      Ver Fonte
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;