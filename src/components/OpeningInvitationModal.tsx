import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface OpeningInvitationModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const OpeningInvitationModal: React.FC<OpeningInvitationModalProps> = ({
  isOpen,
  onEnter,
}) => {
  const [opening, setOpening] = useState(false);

  const handleOpenClick = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      setOpening(false);
      onEnter();
    }, 750);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          style={{
            background: 'radial-gradient(circle at center, #5A7E46 0%, #3D5A2E 60%, #2A401E 100%)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding Invitation Envelope Cover"
        >
          {/* Subtle Floating Flower Petals in Green Backdrop (as in ChungDoi reference) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Soft pink blossom accents scattered across the green backdrop */}
            <span className="absolute top-[12%] left-[18%] text-pink-300/30 text-2xl select-none">🌸</span>
            <span className="absolute top-[28%] right-[15%] text-pink-300/25 text-xl select-none">🌸</span>
            <span className="absolute top-[48%] left-[10%] text-pink-300/20 text-3xl select-none">🌸</span>
            <span className="absolute bottom-[22%] right-[12%] text-pink-300/35 text-2xl select-none">🌸</span>
            <span className="absolute bottom-[10%] left-[24%] text-pink-300/25 text-xl select-none">🌸</span>
            <span className="absolute top-[10%] right-[32%] text-pink-300/20 text-lg select-none">🌸</span>
          </div>

          {/* Centered White Card with Watercolor Villa / Floral Illustration (ChungDoi Template Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={
              opening
                ? { opacity: 0, scale: 1.05, y: -24 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[440px] sm:max-w-[470px] bg-white rounded-2xl shadow-2xl overflow-hidden text-center border border-white/40"
          >
            {/* Delicate Watercolor Villa / Garden Courtyard Background Art matching the Santo Estêvão & ChungDoi aesthetic */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-multiply bg-bottom bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700' preserveAspectRatio='xMidYMax slice'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='1'/%3E%3Cstop offset='35%25' stop-color='%23ffffff' stop-opacity='0.6'/%3E%3Cstop offset='100%25' stop-color='%23f6e8da' stop-opacity='0.15'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' stroke='%23C5A880' stroke-width='1.2' opacity='0.35'%3E%3Cpath d='M300 120 L300 350 M250 200 C250 160 350 160 350 200 L350 350 L250 350 Z M270 170 C270 140 330 140 330 170 M300 90 L300 120'/%3E%3Cpath d='M300 90 L295 105 L305 105 Z' fill='%23C5A880'/%3E%3Cpath d='M180 320 L180 480 M420 320 L420 480 M150 400 L450 400' stroke-width='0.9'/%3E%3Cpath d='M220 540 C220 500 380 500 380 540 C380 570 220 570 220 540 Z' fill='%23E8DFD3'/%3E%3Ccircle cx='300' cy='520' r='18' fill='%23DFD3C3'/%3E%3C/g%3E%3Cg opacity='0.4'%3E%3Ccircle cx='140' cy='280' r='38' fill='%23F7C8D0'/%3E%3Ccircle cx='170' cy='310' r='48' fill='%23EAB8C5'/%3E%3Ccircle cx='120' cy='340' r='52' fill='%23F4CAD3'/%3E%3Ccircle cx='180' cy='380' r='42' fill='%23C8DFB8'/%3E%3Ccircle cx='460' cy='300' r='44' fill='%23F6CCD4'/%3E%3Ccircle cx='440' cy='360' r='50' fill='%23D4E7C5'/%3E%3Ccircle cx='480' cy='420' r='45' fill='%23F2BAC6'/%3E%3C/g%3E%3Crect width='600' height='700' fill='url(%23grad)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Inner Content Layer */}
            <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 flex flex-col items-center">
              {/* Circular Forest Green Wax Seal with White Heart (identical to ChungDoi) */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#3B5A2D] shadow-md flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>

              {/* Names in Roman Serif Capitals with Forest Green Styling */}
              <div className="mb-4">
                <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#344E29] tracking-wider uppercase font-normal leading-tight">
                  Kety
                </h1>
                <div className="font-script text-2xl sm:text-3xl text-[#5C7E4F] my-0.5 lowercase italic">
                  &amp;
                </div>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#344E29] tracking-wider uppercase font-normal leading-tight">
                  Her Beloved
                </h2>
              </div>

              {/* Ornamental Divider with Leaf Symbol */}
              <div className="flex items-center justify-center gap-3 w-40 my-2">
                <span className="h-[1px] flex-1 bg-[#4A6B3A]/40" />
                <span className="text-[#3E5C2F] text-xs font-serif">❦</span>
                <span className="h-[1px] flex-1 bg-[#4A6B3A]/40" />
              </div>

              {/* Date Wording */}
              <p className="font-serif-editorial text-base sm:text-lg text-[#3E3832] font-normal mt-3 mb-1">
                24 de julho de 2027
              </p>

              {/* Cordially Invites */}
              <p className="font-serif-editorial text-sm sm:text-base text-[#5C534B] font-normal mb-3">
                Cordially Invites
              </p>

              {/* Pill Badge Container: Casamento (or Event Title) */}
              <div className="my-2 px-5 py-1.5 rounded-lg border border-[#A7BFA0] bg-[#EAF2E7]/80 text-[#2F4A25] font-serif-editorial text-sm sm:text-base tracking-wide shadow-xs">
                Casamento
              </div>

              {/* To celebrate with our family */}
              <p className="font-serif-editorial text-sm text-[#5C534B] mt-2 mb-8">
                to celebrate with our family
              </p>

              {/* Green Pill Button: "Open" (exact ChungDoi style) */}
              <button
                type="button"
                onClick={handleOpenClick}
                className="px-9 py-2.5 rounded-full bg-[#3B5A2D] hover:bg-[#324D26] active:scale-95 text-white font-serif-editorial text-base tracking-wide shadow-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B5A2D]"
              >
                Open
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
