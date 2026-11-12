import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloralTransitionOverlayProps {
  active: boolean;
  destinationLabel?: string;
}

export const FloralTransitionOverlay: React.FC<FloralTransitionOverlayProps> = ({
  active,
  destinationLabel,
}) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at center, rgba(239, 236, 230, 0.88) 0%, rgba(218, 211, 197, 0.94) 100%)',
            backdropFilter: 'blur(3px)',
          }}
          aria-hidden="true"
        >
          {/* Corner Blind-Embossed Floral Flourishes on Overlay */}
          <div className="absolute top-4 left-4 w-28 h-28 opacity-45 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path
                d="M10 10 C35 15, 60 15, 90 20 M10 10 C15 35, 15 60, 20 90"
                stroke="#8A7666"
                strokeWidth="1.5"
              />
              <circle cx="35" cy="35" r="14" fill="#FAF8F3" stroke="#8A7666" strokeWidth="1" />
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 w-28 h-28 opacity-45 rotate-180 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path
                d="M10 10 C35 15, 60 15, 90 20 M10 10 C15 35, 15 60, 20 90"
                stroke="#8A7666"
                strokeWidth="1.5"
              />
              <circle cx="35" cy="35" r="14" fill="#FAF8F3" stroke="#8A7666" strokeWidth="1" />
            </svg>
          </div>

          {/* Central Bloom Medallion with Rotating Petals */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 1.15, opacity: 0, rotate: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-3">
              {/* Radial Botanical Petals */}
              <svg
                viewBox="0 0 120 120"
                className="w-full h-full animate-spin text-[#8A7666]/70 drop-shadow-md"
                style={{ animationDuration: '24s' }}
                fill="none"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <g key={angle} transform={`rotate(${angle} 60 60)`}>
                    <path
                      d="M60 22 C68 35, 66 50, 60 60 C54 50, 52 35, 60 22 Z"
                      fill="#F6F4EF"
                      stroke="#8A7666"
                      strokeWidth="1.2"
                    />
                  </g>
                ))}
                <circle cx="60" cy="60" r="16" fill="#EDE8DF" stroke="#8A7666" strokeWidth="1.4" />
                <path
                  d="M55 59 C55 55, 61 54, 63 58 C65 61, 61 65, 57 63"
                  stroke="#5C4B3E"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Destination Name Indicator */}
            {destinationLabel && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] uppercase font-medium bg-[#FAF8F4]/80 px-4 py-1.5 rounded-full border border-[#8A7666]/30 shadow-xs"
              >
                {destinationLabel}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
