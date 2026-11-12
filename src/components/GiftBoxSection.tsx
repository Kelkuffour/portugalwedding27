import React, { useState } from 'react';
import { Check, Copy, Gift, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmbossedFloralDivider, EmbossedRoseCorner } from './EmbossedRoseCorner';

export const GiftBoxSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // Ignore error
    }
  };

  return (
    <motion.section
      id="gift-box"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
    >
      <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
        WEDDING &amp; BRIDAL SHOWER REGISTRY
      </p>
      <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-3 letterpress-text">
        Gift Box
      </h2>
      <p className="text-sm text-[#5C4B3E] max-w-sm mx-auto leading-relaxed mb-6">
        Your presence at Love Gardens Villa is the greatest gift. Tap the gift box below to view the registry details from the invitation.
      </p>

      {/* ChungDoi Interactive Animated Gift Box Trigger */}
      <div className="py-4 flex flex-col items-center">
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Open Gift Box"
          className="group relative w-44 h-44 cotton-cardstock border border-[#D0C6B4] rounded-xs shadow-md flex flex-col items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B2F26]"
        >
          {/* Satin Cross Ribbons */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-[#E4DDD0] border-x border-[#CFC5B3]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 bg-[#E4DDD0] border-y border-[#CFC5B3]"
            aria-hidden="true"
          />

          {/* Center Embossed Medallion */}
          <div className="relative z-10 w-16 h-16 rounded-full cotton-cardstock border border-[#C8BFA8] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Gift className="w-7 h-7 text-[#3B2F26] stroke-[1.4]" />
          </div>
        </motion.button>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 font-roman-caps text-[11px] tracking-[0.22em] text-[#3B2F26] underline underline-offset-4 hover:text-[#6E5D4F] cursor-pointer"
        >
          TAP TO OPEN GIFT BOX
        </button>
      </div>

      {/* ChungDoi Gift Box Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1B1410]/80 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Gift and Registry Information"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md cotton-cardstock border border-[#D8CFC0] p-7 sm:p-10 text-center rounded-xs shadow-2xl overflow-hidden"
            >
              <EmbossedRoseCorner position="top-left" size="sm" />
              <EmbossedRoseCorner position="top-right" size="sm" />
              <EmbossedRoseCorner position="bottom-left" size="sm" />
              <EmbossedRoseCorner position="bottom-right" size="sm" />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Gift Box"
                className="absolute top-3.5 right-3.5 z-30 p-1.5 text-[#5C4B3E] hover:text-[#3B2F26] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-20">
                <p className="font-roman-caps text-[10px] tracking-[0.24em] text-[#6E5D4F] mb-1">
                  BRIDAL SHOWER REGISTRY
                </p>
                <h3 className="font-script text-4xl text-[#3B2F26] mb-3">
                  Elisabeth Anderson
                </h3>

                <EmbossedFloralDivider className="my-4" />

                <div className="p-5 bg-[#F7F5F0] border border-[#D8CFC0] text-left space-y-4 mb-5">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#8A7666]/25">
                    <div>
                      <p className="font-roman-caps text-[9px] tracking-[0.2em] text-[#6E5D4F]">
                        REGISTRY NOTATION (ON INVITATION)
                      </p>
                      <p className="font-roman-caps text-sm tracking-[0.18em] text-[#3B2F26] font-medium mt-0.5">
                        REGISTERED AT NAME
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('REGISTERED AT NAME', 'registry')}
                      className="embossed-button px-3 py-1.5 rounded-xs border border-[#D5CDBD] text-[10px] font-roman-caps tracking-[0.16em] text-[#3B2F26] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedField === 'registry' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-roman-caps text-[9px] tracking-[0.2em] text-[#6E5D4F]">
                        RSVP &amp; REGISTRY CONTACT
                      </p>
                      <p className="font-roman-caps text-sm tracking-[0.18em] text-[#3B2F26] tabular-nums mt-0.5">
                        4122 222 222
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('4122 222 222', 'phone')}
                      className="embossed-button px-3 py-1.5 rounded-xs border border-[#D5CDBD] text-[10px] font-roman-caps tracking-[0.16em] text-[#3B2F26] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="font-serif-editorial italic text-base text-[#5C4B3E] mb-5">
                  “Thank you for your love, generosity, and warm wishes as we celebrate Elisabeth Anderson.”
                </p>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="embossed-button px-6 py-2.5 rounded-xs border border-[#C8BFA8] font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26] cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
