import React, { useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  List,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmbossedFloralDivider, EmbossedRoseCorner } from './components/EmbossedRoseCorner';
import { AmbientMusicControl, type AmbientMusicHandle } from './components/AmbientMusicControl';
import { FloralTransitionOverlay } from './components/FloralTransitionOverlay';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { CountdownAndCalendarSection } from './components/CountdownAndCalendarSection';
import { RsvpSection, GuestbookSection } from './components/RsvpAndGuestbookSections';
import { GiftBoxSection } from './components/GiftBoxSection';
import { VideoInvitationOpening } from './components/VideoInvitationOpening';

const SCHEDULE_ITEMS = [
  {
    time: '14:00',
    title: 'Casamento',
    description: 'Agostinho e Kety — 24 de julho de 2027.',
  },
];

const QUICK_NAV_SECTIONS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'ceremony', label: 'Ceremony Details' },
  { id: 'gallery', label: 'Photo Gallery' },
  { id: 'reception', label: 'Reception' },
  { id: 'countdown', label: 'Countdown & Calendar' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'directions', label: 'Venue & Map' },
  { id: 'dress-code', label: 'Dress Code' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'guestbook', label: 'Guestbook' },
  { id: 'gift-box', label: 'Gift Box' },
];

export default function App() {
  const musicRef = useRef<AmbientMusicHandle>(null);
  const landingVideoRef = useRef<HTMLVideoElement>(null);
  const [invitationOpened, setInvitationOpened] = useState(false);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [transitionTargetLabel, setTransitionTargetLabel] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const handleNavigateToSection = (targetId: string, label: string) => {
    setNavMenuOpen(false);
    setTransitionTargetLabel(label);
    setTransitioning(true);

    // Smoothly scroll to target during semi-transparent floral motif overlay
    window.setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);

    // Fade out overlay
    window.setTimeout(() => {
      setTransitioning(false);
    }, 650);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText('Rua das Nogueiras 7, Foros do Almada, 2130-523 Santo Estêvão');
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // Ignore error
    }
  };

  return (
    <>
      {!invitationOpened && (
        <VideoInvitationOpening
          onStart={() => musicRef.current?.prepare()}
          onReveal={() => {
            const video = landingVideoRef.current;
            if (video) {
              video.currentTime = 0;
              video.play().catch(() => {});
            }
          }}
          onComplete={() => {
            setInvitationOpened(true);
            musicRef.current?.start();
          }}
        />
      )}
      <div inert={!invitationOpened}>
      <section
        aria-label="Wedding invitation video"
        className="relative h-svh w-full bg-[#D5CDBD]"
      >
        <video
          src="/assets/landing-opening.mp4"
          ref={landingVideoRef}
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-contain"
        />
        {invitationOpened && (
          <motion.a
            href="#top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById('top')?.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
              });
            }}
            className="absolute bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 rounded-full border border-[#D5CDBD]/60 bg-[#FAF8F4]/85 px-5 py-3 text-[#3B2F26] backdrop-blur-sm shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2F26]"
          >
            <span className="font-roman-caps text-[10px] tracking-[0.18em] whitespace-nowrap">Deslize para descobrir</span>
            <ChevronDown aria-hidden="true" className="h-4 w-4 motion-safe:animate-bounce" />
          </motion.a>
        )}
      </section>
    <div
      id="top"
      className="relative min-h-screen bg-[#D5CDBD] text-[#3B2F26] py-0 sm:py-8 md:py-12 px-0 sm:px-4 flex flex-col items-center justify-start selection:bg-[#3B2F26] selection:text-[#FAF8F4]"
    >
      {/* Semi-Transparent Floral Motif Overlay on Section Navigation */}
      <FloralTransitionOverlay
        active={transitioning}
        destinationLabel={transitionTargetLabel}
      />

      {/* Floating Audio Play/Pause Disc (Bottom-Left — ChungDoi Signature) */}
      <AmbientMusicControl ref={musicRef} />

      {/* Floating Quick Navigation & Back-to-Top Control (Bottom-Right — ChungDoi Signature) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <AnimatePresence>
          {navMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label="Invitation Section Navigation"
              className="cotton-cardstock border border-[#C8BFA8] shadow-xl rounded-xs p-3 w-52 mb-1"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#8A7666]/25">
                <span className="font-roman-caps text-[10px] tracking-[0.22em] text-[#6E5D4F]">
                  SECTIONS
                </span>
                <button
                  type="button"
                  onClick={() => setNavMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="text-[#5C4B3E] hover:text-[#3B2F26] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <ul className="space-y-1">
                {QUICK_NAV_SECTIONS.map((sec) => (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => handleNavigateToSection(sec.id, sec.label)}
                      className="w-full text-left block px-2 py-1.5 font-roman-caps text-[10px] tracking-[0.18em] text-[#3B2F26] hover:bg-[#E5DFD3]/70 rounded-xs transition-colors cursor-pointer"
                    >
                      {sec.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigateToSection('top', 'Back to Top')}
            aria-label="Scroll back to top"
            title="Back to Top"
            className="w-10 h-10 rounded-full cotton-cardstock border border-[#C8BFA8] shadow-lg flex items-center justify-center text-[#3B2F26] hover:scale-105 transition-transform cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setNavMenuOpen((prev) => !prev)}
            aria-label="Toggle section menu"
            title="Sections"
            className="w-11 h-11 rounded-full cotton-cardstock border border-[#C8BFA8] shadow-lg flex items-center justify-center text-[#3B2F26] hover:scale-105 transition-transform cursor-pointer"
          >
            {navMenuOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Centered Invitation Container (Cleanly Bounded by Vertical Borders) */}
      <main
        className="relative w-full max-w-[560px] mx-auto cotton-cardstock border-0 sm:border border-[#DFD9CE] shadow-2xl overflow-hidden rounded-none sm:rounded-md"
      >
        {/* Subtle Inner Watermark Contained Strictly Within Invitation Card */}
        <div
          className="pointer-events-none absolute inset-0 z-0 card-couple-watermark"
          aria-hidden="true"
        />

        {/* Top Blind-Embossed English Rose Corners on the Invitation Scroll */}
        <EmbossedRoseCorner position="top-left" size="lg" />
        <EmbossedRoseCorner position="top-right" size="lg" />

        {/* ==============================================================
            Section 02: Welcome and Introduction
           ============================================================== */}
        <motion.section
          id="welcome"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pt-16 pb-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25 relative z-20"
        >
          <div className="space-y-1.5 mb-5">
            <p className="font-roman-caps text-xs tracking-[0.26em] text-[#3B2F26] letterpress-text">
              CONVIDAMOS VOCÊ PARA O
            </p>
            <p className="font-roman-caps text-sm tracking-[0.28em] text-[#3B2F26] letterpress-text">
              CASAMENTO
            </p>
            <p className="font-roman-caps text-xs tracking-[0.26em] text-[#3B2F26] letterpress-text">
              DE
            </p>
          </div>

          <h1 className="font-script text-5xl sm:text-6xl text-[#3B2F26] my-5 letterpress-text">
            Agostinho e Kety
          </h1>

          {/* Framed Hero Keepsake Plate from the Uploaded Invitation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="my-7 mx-auto max-w-sm p-2.5 bg-[#F7F5F0] border border-[#D8CFC0] shadow-xs"
          >
            <div className="overflow-hidden aspect-[4/5] border border-[#E2DDD2]">
              <motion.img
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                src="/assets/aistudio/_I_AM_ALL_THAT_MATTERS__MY__1bf32eac.jpg"
                alt="Agostinho e Kety"
                referrerPolicy="no-referrer"
                style={{ objectPosition: 'center 25%' }}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <p className="font-serif-editorial italic text-lg sm:text-xl text-[#4D3E32] leading-relaxed max-w-md mx-auto mt-6">
            Será uma alegria compartilhar esse momento com você.
          </p>

          <EmbossedFloralDivider className="mt-6 mb-2" />
        </motion.section>

        {/* ==============================================================
            Section 03: Ceremony Information
           ============================================================== */}
        <motion.section
          id="ceremony"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative py-14 px-6 sm:px-12 text-center border-b border-[#8A7666]/25 overflow-hidden"
        >
          <EmbossedRoseCorner position="top-left" size="sm" />
          <EmbossedRoseCorner position="top-right" size="sm" />
          <EmbossedRoseCorner position="bottom-left" size="sm" />
          <EmbossedRoseCorner position="bottom-right" size="sm" />

          <div className="relative z-20">
            <p className="font-roman-caps text-[11px] tracking-[0.24em] text-[#6E5D4F] mb-3">
              JUNTAMENTE COM AS NOSSAS FAMÍLIAS
            </p>
            <p className="font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] mb-1">
              CONVIDAMOS VOCÊ PARA O
            </p>
            <p className="font-roman-caps text-sm tracking-[0.26em] text-[#3B2F26] mb-1">
              CASAMENTO
            </p>
            <p className="font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] mb-6">
              DE
            </p>

            {/* Bride & Groom / Honouree Lockup */}
            <div className="my-6">
              <h2 className="font-script text-5xl sm:text-6xl text-[#3B2F26] letterpress-text">
                Agostinho e Kety
              </h2>
            </div>

            {/* Exact Date Lockup from Uploaded Card: JULHO | 24 | 2027 */}
            <div className="inline-flex items-center justify-center gap-5 sm:gap-6 my-6 py-1">
              <span className="font-roman-caps text-sm sm:text-base tracking-[0.28em] text-[#3B2F26]">
                JULHO
              </span>
              <span className="h-9 w-[1px] bg-[#3B2F26]/75" aria-hidden="true" />
              <span className="font-serif-editorial text-4xl sm:text-5xl text-[#3B2F26] tabular-nums leading-none">
                24
              </span>
              <span className="h-9 w-[1px] bg-[#3B2F26]/75" aria-hidden="true" />
              <span className="font-serif-editorial text-lg sm:text-xl tracking-[0.22em] text-[#3B2F26] tabular-nums">
                2027
              </span>
            </div>

            {/* Ceremony Time */}
            <div className="my-5 space-y-1">
              <p className="font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26]">
                ÀS 14 HORAS
              </p>
              <p className="font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26]">
                24 DE JULHO DE 2027
              </p>
            </div>

            {/* Ceremony Venue */}
            <div className="mt-6 space-y-1.5">
              <p className="font-roman-caps text-sm sm:text-base tracking-[0.2em] text-[#3B2F26] font-medium">
                RUA DAS NOGUEIRAS 7
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.18em] text-[#3B2F26]">
                FOROS DO ALMADA · 2130-523 SANTO ESTÊVÃO
              </p>
            </div>
          </div>
        </motion.section>

        {/* ==============================================================
            Section 04: Photo Gallery
           ============================================================== */}
        <PhotoGallerySection />

        {/* ==============================================================
            Section 05: Reception Information
           ============================================================== */}
        <motion.section
          id="reception"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
        >
          <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
            O NOSSO CASAMENTO
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-4 letterpress-text">
            Celebração
          </h2>
          <p className="font-serif-editorial text-base sm:text-lg text-[#4D3E32] max-w-md mx-auto leading-relaxed mb-6">
            Será uma alegria compartilhar esse momento com você.
          </p>

          <div className="p-6 bg-[#F7F5F0] border border-[#D8CFC0] max-w-md mx-auto space-y-3">
            <div>
              <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#6E5D4F]">
                DATA E HORA
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.2em] text-[#3B2F26] mt-0.5 tabular-nums">
                24 DE JULHO DE 2027 · 14 HORAS
              </p>
            </div>
            <div className="pt-3 border-t border-[#8A7666]/25">
              <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#6E5D4F]">
                LOCAL
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.2em] text-[#3B2F26] mt-0.5">
                RUA DAS NOGUEIRAS 7
              </p>
              <p className="font-roman-caps text-[11px] tracking-[0.18em] text-[#5C4B3E] mt-0.5">
                FOROS DO ALMADA · 2130-523 SANTO ESTÊVÃO
              </p>
            </div>
          </div>
        </motion.section>

        {/* ==============================================================
            Sections 06 & 07: Wedding Countdown & Calendar Integration
           ============================================================== */}
        <CountdownAndCalendarSection />

        {/* ==============================================================
            Section 08: RSVP
           ============================================================== */}
        <RsvpSection />

        {/* ==============================================================
            Section 09: Venue and Directions
           ============================================================== */}
        <motion.section
          id="directions"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
        >
          <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
            LOCALIZAÇÃO
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-3 letterpress-text">
            Localização
          </h2>

          <div className="mb-5">
            <p className="font-roman-caps text-sm sm:text-base tracking-[0.2em] text-[#3B2F26] font-medium flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#3B2F26]" />
              <span>RUA DAS NOGUEIRAS 7</span>
            </p>
            <p className="font-roman-caps text-xs tracking-[0.18em] text-[#5C4B3E] mt-1">
              FOROS DO ALMADA · 2130-523 SANTO ESTÊVÃO
            </p>
          </div>

          {/* Embedded Google Map Preview */}
          <div className="overflow-hidden border border-[#D8CFC0] bg-[#E5DFD3] h-64 sm:h-72 mb-5">
            <iframe
              title="Rua das Nogueiras 7, Foros do Almada, 2130-523 Santo Estêvão"
              src="https://www.google.com/maps?q=Rua+das+Nogueiras+7+Foros+do+Almada+2130-523+Santo+Estevao&output=embed"
              className="w-full h-full border-0 filter sepia-[0.18] contrast-[0.96]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Rua+das+Nogueiras+7+Foros+do+Almada+2130-523+Santo+Estevao"
              target="_blank"
              rel="noopener noreferrer"
              className="embossed-button w-full sm:w-auto px-6 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-xs tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2"
            >
              <Navigation className="w-3.5 h-3.5 text-[#3B2F26]" />
              <span>COMO CHEGAR</span>
            </a>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="embossed-button w-full sm:w-auto px-5 py-3 rounded-xs border border-[#D5CDBD] font-roman-caps text-xs tracking-[0.18em] text-[#3B2F26] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3B2F26]" />
                  <span>MORADA COPIADA</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#6E5D4F]" />
                  <span>COPIAR MORADA</span>
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* ==============================================================
            Section 10: Dress Code
           ============================================================== */}
        <motion.section
          id="dress-code"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 px-6 sm:px-12 text-center border-b border-[#8A7666]/25"
        >
          <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
            CÓDIGO DE VESTUÁRIO
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-4 letterpress-text">
            Dress Code
          </h2>

          <div className="space-y-1 mb-6">
            <p className="font-roman-caps text-xs sm:text-sm tracking-[0.22em] text-[#3B2F26]">
              DRESS CODE
            </p>
            <p className="font-roman-caps text-xs sm:text-sm tracking-[0.22em] text-[#3B2F26]">
              BLACK TIE / CASUAL CHIC
            </p>
          </div>

          <p className="font-serif-editorial text-base text-[#5C4B3E] max-w-sm mx-auto leading-relaxed">
            Black tie / Casual chic
          </p>
        </motion.section>

        {/* ==============================================================
            Section 11: Wedding Day Schedule
           ============================================================== */}
        <motion.section
          id="schedule"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="py-12 px-6 sm:px-12 border-b border-[#8A7666]/25"
        >
          <div className="text-center mb-8">
            <p className="font-roman-caps text-[11px] tracking-[0.26em] text-[#6E5D4F] mb-2">
              PROGRAMA
            </p>
            <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] letterpress-text">
              O grande dia
            </h2>
            <EmbossedFloralDivider className="my-4" />
          </div>

          {/* Vertical Timeline */}
          <div className="relative max-w-md mx-auto pl-6 sm:pl-0">
            <div
              className="absolute left-2 sm:left-[108px] top-2 bottom-2 w-[1px] bg-[#8A7666]/45"
              aria-hidden="true"
            />

            <div className="space-y-7">
              {SCHEDULE_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col sm:flex-row items-start gap-1 sm:gap-8"
                >
                  <div className="sm:w-24 sm:text-right shrink-0">
                    <span className="font-roman-caps text-xs tracking-[0.18em] text-[#3B2F26] tabular-nums font-medium">
                      {item.time}
                    </span>
                  </div>

                  {/* Diamond / Circle Node on Axis */}
                  <div
                    className="absolute -left-[19px] sm:left-[104px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#3B2F26] ring-4 ring-[#EFECE6]"
                    aria-hidden="true"
                  />

                  <div className="flex-1">
                    <h3 className="font-roman-caps text-xs tracking-[0.2em] text-[#3B2F26] font-medium mb-1">
                      {item.title.toUpperCase()}
                    </h3>
                    <p className="font-serif-editorial text-base text-[#5C4B3E] leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ==============================================================
            Section 12: Guestbook
           ============================================================== */}
        <GuestbookSection />

        {/* ==============================================================
            Section 13: Gift Box
           ============================================================== */}
        <GiftBoxSection />

        {/* ==============================================================
            Section 14: Closing Section
           ============================================================== */}
        <motion.footer
          id="closing"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative pt-14 pb-20 px-6 sm:px-12 text-center overflow-hidden"
        >
          <EmbossedRoseCorner position="bottom-left" size="lg" />
          <EmbossedRoseCorner position="bottom-right" size="lg" />

          <div className="relative z-20">
            <p className="font-roman-caps text-xs tracking-[0.26em] text-[#6E5D4F] mb-3">
              Que seja o início de uma linda história.
            </p>

            <h2 className="font-script text-5xl sm:text-6xl text-[#3B2F26] my-5 letterpress-text">
              Agostinho e Kety
            </h2>

            <div className="inline-flex items-center justify-center gap-4 my-3">
              <span className="font-roman-caps text-xs tracking-[0.26em] text-[#3B2F26]">JULHO</span>
              <span className="h-6 w-[1px] bg-[#3B2F26]/70" aria-hidden="true" />
              <span className="font-serif-editorial text-3xl text-[#3B2F26] tabular-nums">
                24
              </span>
              <span className="h-6 w-[1px] bg-[#3B2F26]/70" aria-hidden="true" />
              <span className="font-serif-editorial text-base tracking-[0.2em] text-[#3B2F26] tabular-nums">
                2027
              </span>
            </div>

            <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#5C4B3E] mt-2">
              RUA DAS NOGUEIRAS 7, FOROS DO ALMADA, 2130-523 SANTO ESTÊVÃO
            </p>

            <EmbossedFloralDivider className="my-6" />

            <p className="font-roman-caps text-[10px] tracking-[0.2em] text-[#6E5D4F] tabular-nums">
              CONFIRMAR PRESENÇA ATÉ O DIA 31 DE MARÇO.
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
      </div>
    </>
  );
}
