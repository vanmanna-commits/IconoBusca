import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FiDownload, FiExternalLink, FiX, FiCopy } from 'react-icons/fi';
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
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              backdropFilter: 'blur(24px)'
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
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    color: '#fafafa'
                  }}
                >
                  <FiX className="w-5 h-5" />
                </button>
                <img
                  src={image.regular_url}
                  alt={image.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ backgroundColor: '#18181b' }}
                />
              </div>

              <div className="p-6" style={{ backgroundColor: '#09090b' }}>
                <DialogHeader>
                  <DialogTitle 
                    className="text-2xl font-bold mb-4"
                    style={{ color: '#fafafa', fontFamily: 'Manrope, sans-serif' }}
                  >
                    {image.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <span 
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: '#18181b',
                        color: '#fafafa',
                        border: '1px solid #27272a'
                      }}
                    >
                      {image.source}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: '#18181b',
                        color: '#a1a1aa',
                        border: '1px solid #27272a'
                      }}
                    >
                      {image.license}
                    </span>
                  </div>

                  {image.description && (
                    <p className="text-sm" style={{ color: '#a1a1aa', fontFamily: 'Inter, sans-serif' }}>
                      {image.description}
                    </p>
                  )}

                  {image.photographer && (
                    <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: '#d4d4d8' }}>
                      <span style={{ fontWeight: 600 }}>Fotógrafo:</span> {image.photographer}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4 flex-wrap">
                    <Button
                      data-testid="modal-download-button"
                      onClick={onDownload}
                      className="gap-2 rounded-full font-medium transition-transform active:scale-95"
                      style={{
                        backgroundColor: '#fafafa',
                        color: '#09090b',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </Button>

                    <Button
                      data-testid="copy-url-button"
                      onClick={copyToClipboard}
                      className="gap-2 rounded-full font-medium transition-colors"
                      style={{
                        backgroundColor: '#27272a',
                        color: '#fafafa',
                        border: '1px solid #3f3f46',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <FiCopy className="w-4 h-4" />
                      {copied ? 'Copiado!' : 'Copiar URL'}
                    </Button>

                    <Button
                      data-testid="view-source-button"
                      onClick={() => window.open(image.source_url, '_blank')}
                      className="gap-2 rounded-full font-medium transition-colors"
                      style={{
                        backgroundColor: '#27272a',
                        color: '#fafafa',
                        border: '1px solid #3f3f46',
                        fontFamily: 'Inter, sans-serif'
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