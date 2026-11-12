import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { EmbossedFloralDivider } from './EmbossedRoseCorner';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  src: string;
  objectPosition: string;
  scale: string;
}

const GALLERY_PLATES: GalleryItem[] = [
  {
    id: 'plate-01',
    title: 'Elisabeth & Beloved',
    caption: 'Elisabeth Anderson & Her Groom — Celebrating love and devotion.',
    src: '/assets/aistudio/These_Are_the_Wedding_Trends_to_Follow_and_Avoid_8b245327.jpg',
    objectPosition: 'center 20%',
    scale: 'scale-100',
  },
  {
    id: 'plate-02',
    title: 'A Radiant Embrace',
    caption: 'Elisabeth & Her Beloved — Golden hour embrace in white wedding elegance.',
    src: '/assets/aistudio/607000856072846393_bede6525.jpg',
    objectPosition: 'center 22%',
    scale: 'scale-100',
  },
  {
    id: 'plate-03',
    title: 'The Bride & Garden Elegance',
    caption: 'Elisabeth Anderson — Bridal portrait with white roses in the garden estate.',
    src: '/assets/aistudio/557883472618731566_4477061d.jpg',
    objectPosition: 'center 25%',
    scale: 'scale-100',
  },
  {
    id: 'plate-04',
    title: 'The Promise & Ring',
    caption: 'A cherished promise — Hand in hand, adorned with the bridal ring.',
    src: '/assets/aistudio/Beautiful_Couple___Photography___asedaimage__60fc62f8.jpg',
    objectPosition: 'center 30%',
    scale: 'scale-100',
  },
];

export const PhotoGallerySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  const total = GALLERY_PLATES.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
  };

  const currentItem = GALLERY_PLATES[activeIndex];

  // Calculate 3D transformation values relative to active center index
  const get3DStyles = (index: number) => {
    let offset = index - activeIndex;

    // Wrap-around offset logic for seamless circular carousel
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);

    if (offset === 0) {
      return {
        transform: 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    } else if (offset === 1) {
      return {
        transform: 'translateX(58%) translateZ(-150px) rotateY(-40deg) scale(0.88)',
        opacity: 0.72,
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    } else if (offset === -1) {
      return {
        transform: 'translateX(-58%) translateZ(-150px) rotateY(40deg) scale(0.88)',
        opacity: 0.72,
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    } else if (offset > 1) {
      return {
        transform: 'translateX(110%) translateZ(-300px) rotateY(-65deg) scale(0.74)',
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    } else {
      return {
        transform: 'translateX(-110%) translateZ(-300px) rotateY(65deg) scale(0.74)',
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: 'auto' as const,
      };
    }
  };

  return (
    <motion.section
      id="gallery"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 px-4 sm:px-8 border-b border-[#8A7666]/25 overflow-hidden"
    >
      {/* Heading: Uppercase, Bold, and Right-Aligned on Desktop as requested */}
      <div className="mb-6 sm:mb-8 text-center md:text-right">
        <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] uppercase font-bold mb-1">
          PHOTO GALLERY
        </p>
        <h2 className="font-roman-caps text-xl sm:text-2xl text-[#3B2F26] uppercase font-bold tracking-[0.2em]">
          MOMENTS &amp; KEEPSAKES
        </h2>
        <div className="flex md:justify-end justify-center">
          <EmbossedFloralDivider className="my-3 w-48" />
        </div>
      </div>

      {/* 3D Photo Carousel Container with perspective: 1000px */}
      <div
        className="relative w-full h-[380px] sm:h-[450px] md:h-[520px] flex items-center justify-center my-4 select-none"
        style={{ perspective: '1000px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Absolute Left Navigation Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-[#FAF8F4]/90 hover:bg-[#FAF8F4] border border-[#D5CDBD] shadow-lg flex items-center justify-center text-[#3B2F26] transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B2F26]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Absolute Right Navigation Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-[#FAF8F4]/90 hover:bg-[#FAF8F4] border border-[#D5CDBD] shadow-lg flex items-center justify-center text-[#3B2F26] transition-all hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B2F26]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 3D Stack of Cards */}
        {GALLERY_PLATES.map((item, index) => {
          const isCenter = index === activeIndex;
          const styles3D = get3DStyles(index);

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  setLightboxOpen(true);
                } else {
                  setActiveIndex(index);
                }
              }}
              style={{
                ...styles3D,
                transformStyle: 'preserve-3d',
                transitionDuration: '1100ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`absolute w-[240px] sm:w-[280px] md:w-[320px] aspect-[4/5] rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all ${
                isCenter ? 'ring-2 ring-white/30 shadow-2xl' : 'hover:opacity-90'
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                style={{ objectPosition: item.objectPosition }}
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Subtle scrim & title on center item */}
              {isCenter && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-[#FAF8F4] text-center">
                  <p className="font-roman-caps text-xs tracking-[0.2em] uppercase font-medium">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Text Indicator at Bottom (e.g. '1 / 4') */}
      <div className="text-center mt-6">
        <p className="font-roman-caps text-xs sm:text-sm tracking-[0.28em] text-[#3B2F26] tabular-nums font-semibold">
          {activeIndex + 1} / {total}
        </p>
        <p className="font-serif-editorial italic text-sm text-[#6E5D4F] mt-1">
          {currentItem.caption}
        </p>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#1B1410]/95 flex flex-col justify-between p-4 sm:p-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen Photo Lightbox"
        >
          {/* Top Counter & Close */}
          <div className="flex items-center justify-between text-[#FAF8F4] max-w-4xl w-full mx-auto">
            <span className="font-roman-caps text-xs sm:text-sm tracking-[0.24em] tabular-nums">
              {activeIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
              className="p-2 text-[#FAF8F4] hover:opacity-75 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Image & Left/Right Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-3xl w-full mx-auto overflow-hidden">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 z-20 w-10 h-10 rounded-full bg-[#2A2019]/80 border border-[#FAF8F4]/25 flex items-center justify-center text-[#FAF8F4] hover:bg-[#3B2F26] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center justify-center max-h-[70vh] w-full">
              <div className="relative overflow-hidden border border-[#FAF8F4]/20 max-h-[60vh] aspect-[3/4] bg-[#241B15] rounded-xl shadow-2xl">
                <img
                  src={currentItem.src}
                  alt={currentItem.title}
                  referrerPolicy="no-referrer"
                  style={{ objectPosition: currentItem.objectPosition }}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-center font-serif-editorial text-base text-[#E6DFD3] px-4">
                {currentItem.caption}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 z-20 w-10 h-10 rounded-full bg-[#2A2019]/80 border border-[#FAF8F4]/25 flex items-center justify-center text-[#FAF8F4] hover:bg-[#3B2F26] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2.5 py-2">
            {GALLERY_PLATES.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Photo ${idx + 1}`}
                className={`w-14 h-14 overflow-hidden rounded-md border transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'border-[#FAF8F4] opacity-100 scale-105'
                    : 'border-transparent opacity-45 hover:opacity-80'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  style={{ objectPosition: item.objectPosition }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};
