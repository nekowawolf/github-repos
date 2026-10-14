'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';
import { FallbackImage, type FallbackImageProps } from './FallbackImage';

interface ZoomableImageProps extends FallbackImageProps {
  imageClassName?: string;
  images?: string[];
  currentIndex?: number;
}

export default function ZoomableImage({ src, alt, className = '', imageClassName = '', images, currentIndex = 0, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    if (images && images.length > 1) {
      setDirection(-1);
      setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    }
  }, [images]);

  const handleNext = useCallback(() => {
    if (images && images.length > 1) {
      setDirection(1);
      setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }
  }, [images]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000 || offset.x < -50) handleNext();
    else if (swipe > 10000 || offset.x > 50) handlePrev();
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        if (event.key === 'ArrowLeft') handlePrev();
        else handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  const openImage = () => {
    setActiveIndex(currentIndex);
    setDirection(0);
    setIsOpen(true);
  };
  const currentSrc = images && images.length > 0 ? images[activeIndex] : src;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open image: ${alt || 'Image'}`}
        aria-haspopup="dialog"
        className={`cursor-pointer group relative ${className}`}
        onClick={openImage}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openImage();
          }
        }}
      >
        <FallbackImage src={src} alt={alt} className={imageClassName} {...props} draggable={false} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none">
          <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg>
          </div>
        </div>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div role="dialog" aria-modal="true" aria-label="Image gallery" className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag={images && images.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <FallbackImage
                  src={currentSrc}
                  alt={activeIndex === currentIndex ? alt : `Gallery image ${activeIndex + 1}`}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl select-none"
                  onClick={event => event.stopPropagation()}
                  draggable={false}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>

            {images && images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[101] pointer-events-auto p-2 bg-black/20 rounded-full backdrop-blur-sm">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeIndex === index}
                    className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-white"
                    onClick={event => {
                      event.stopPropagation();
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                  >
                    <FaCircle aria-hidden="true" className={`w-2 h-2 transition-all duration-300 ${activeIndex === index ? 'text-white scale-125' : 'text-white/30 hover:text-white/60'}`} />
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              aria-label="Close image gallery"
              autoFocus
              className="absolute top-4 right-4 md:top-6 md:right-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full p-3 backdrop-blur-md transition-all cursor-pointer pointer-events-auto z-[101]"
              onClick={event => { event.stopPropagation(); setIsOpen(false); }}
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
        </div>, document.body
      )}
    </>
  );
}