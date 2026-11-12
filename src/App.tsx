import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
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
import type { GuestbookWish, RsvpEntry } from '../server';

const DRESS_CODE_SWATCHES = [
  { name: 'Pure White', hex: '#FAF8F4' },
  { name: 'Warm Ivory', hex: '#EFECE6' },
  { name: 'Oatmeal Linen', hex: '#D8CFC1' },
  { name: 'Warm Cocoa', hex: '#8A705A' },
  { name: 'Espresso Brown', hex: '#3B2F26' },
];

const SCHEDULE_ITEMS = [
  {
    time: '2:45 PM',
    title: 'Guest Arrival',
    description: 'Welcome refreshments in the garden courtyard at Love Gardens Villa.',
  },
  {
    time: '3:00 PM',
    title: 'Guest Seating',
    description: 'At Three O’Clock in the Afternoon — Official commencement hour.',
  },
  {
    time: '3:30 PM',
    title: 'Bridal Shower & Honouring Ceremony',
    description: 'Tributes, blessings, and toasts honouring Elisabeth Anderson.',
  },
  {
    time: '4:30 PM',
    title: 'Afternoon Reception',
    description: 'Garden soirée, artisanal patisserie, and celebration in Miami.',
  },
  {
    time: '5:30 PM',
    title: 'Portraits & Gift Keepsakes',
    description: 'Group photographs in White & Brown attire and unsealing of gifts.',
  },
  {
    time: '6:30 PM',
    title: 'Farewell',
    description: 'Warm send-off and floral keepsakes for all honoured guests.',
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
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [wishes, setWishes] = useState<GuestbookWish[]>([]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (Array.isArray(data.rsvps)) setRsvps(data.rsvps);
          if (Array.isArray(data.wishes)) setWishes(data.wishes);
        }
      })
      .catch(() => {
        // Offline fallback
      });
  }, []);

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
      await navigator.clipboard.writeText('Love Gardens Villa, Pearlsville CA 1238 Miami');
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
              YOU ARE INVITED TO A
            </p>
            <p className="font-roman-caps text-sm tracking-[0.28em] text-[#3B2F26] letterpress-text">
              BRIDAL SHOWER
            </p>
            <p className="font-roman-caps text-xs tracking-[0.26em] text-[#3B2F26] letterpress-text">
              HONOURING
            </p>
          </div>

          <h1 className="font-script text-5xl sm:text-6xl text-[#3B2F26] my-5 letterpress-text">
            Elisabeth Anderson
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
                alt="Elisabeth Anderson & Her Groom"
                referrerPolicy="no-referrer"
                style={{ objectPosition: 'center 25%' }}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <p className="font-serif-editorial italic text-lg sm:text-xl text-[#4D3E32] leading-relaxed max-w-md mx-auto mt-6">
            “Join us for an unforgettable afternoon of warmth, white garden roses, and joyful celebration as we honour Elisabeth Anderson.”
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
              TOGETHER WITH OUR FAMILIES
            </p>
            <p className="font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] mb-1">
              YOU ARE INVITED TO A
            </p>
            <p className="font-roman-caps text-sm tracking-[0.26em] text-[#3B2F26] mb-1">
              BRIDAL SHOWER
            </p>
            <p className="font-roman-caps text-xs tracking-[0.24em] text-[#3B2F26] mb-6">
              HONOURING
            </p>

            {/* Bride & Groom / Honouree Lockup */}
            <div className="my-6">
              <h2 className="font-script text-5xl sm:text-6xl text-[#3B2F26] letterpress-text">
                Elisabeth Anderson
              </h2>
            </div>

            {/* Exact Date Lockup from Uploaded Card: JULY | 16 | 2026 */}
            <div className="inline-flex items-center justify-center gap-5 sm:gap-6 my-6 py-1">
              <span className="font-roman-caps text-sm sm:text-base tracking-[0.28em] text-[#3B2F26]">
                JULY
              </span>
              <span className="h-9 w-[1px] bg-[#3B2F26]/75" aria-hidden="true" />
              <span className="font-serif-editorial text-4xl sm:text-5xl text-[#3B2F26] tabular-nums leading-none">
                16
              </span>
              <span className="h-9 w-[1px] bg-[#3B2F26]/75" aria-hidden="true" />
              <span className="font-serif-editorial text-lg sm:text-xl tracking-[0.22em] text-[#3B2F26] tabular-nums">
                2026
              </span>
            </div>

            {/* Ceremony Time */}
            <div className="my-5 space-y-1">
              <p className="font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26]">
                AT THREE O’CLOCK IN THE
              </p>
              <p className="font-roman-caps text-xs tracking-[0.22em] text-[#3B2F26]">
                AFTERNOON
              </p>
            </div>

            {/* Ceremony Venue */}
            <div className="mt-6 space-y-1.5">
              <p className="font-roman-caps text-sm sm:text-base tracking-[0.2em] text-[#3B2F26] font-medium">
                LOVE GARDENS VILLA
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.18em] text-[#3B2F26]">
                PEARLSVILLE CA 1238 MIAMI
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
            CELEBRATION &amp; HOSPITALITY
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-4 letterpress-text">
            Afternoon Reception
          </h2>
          <p className="font-serif-editorial text-base sm:text-lg text-[#4D3E32] max-w-md mx-auto leading-relaxed mb-6">
            We warmly welcome you to celebrate with afternoon refreshments, botanical dining, and joyful toasts in the garden conservatory.
          </p>

          <div className="p-6 bg-[#F7F5F0] border border-[#D8CFC0] max-w-md mx-auto space-y-3">
            <div>
              <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#6E5D4F]">
                DATE &amp; TIME
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.2em] text-[#3B2F26] mt-0.5 tabular-nums">
                JULY 16, 2026 · THREE O’CLOCK IN THE AFTERNOON
              </p>
            </div>
            <div className="pt-3 border-t border-[#8A7666]/25">
              <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#6E5D4F]">
                RECEPTION VENUE
              </p>
              <p className="font-roman-caps text-xs sm:text-sm tracking-[0.2em] text-[#3B2F26] mt-0.5">
                LOVE GARDENS VILLA
              </p>
              <p className="font-roman-caps text-[11px] tracking-[0.18em] text-[#5C4B3E] mt-0.5">
                PEARLSVILLE CA 1238 MIAMI
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
        <RsvpSection
          rsvps={rsvps}
          onRsvpSubmitted={(entry) => setRsvps((prev) => [entry, ...prev])}
        />

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
            LOCATION &amp; MAP
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-3 letterpress-text">
            Venue &amp; Directions
          </h2>

          <div className="mb-5">
            <p className="font-roman-caps text-sm sm:text-base tracking-[0.2em] text-[#3B2F26] font-medium flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#3B2F26]" />
              <span>LOVE GARDENS VILLA</span>
            </p>
            <p className="font-roman-caps text-xs tracking-[0.18em] text-[#5C4B3E] mt-1">
              PEARLSVILLE CA 1238 MIAMI
            </p>
          </div>

          {/* Embedded Google Map Preview */}
          <div className="overflow-hidden border border-[#D8CFC0] bg-[#E5DFD3] h-64 sm:h-72 mb-5">
            <iframe
              title="Love Gardens Villa, Pearlsville CA 1238 Miami"
              src="https://www.google.com/maps?q=Love+Gardens+Villa+Miami+FL&output=embed"
              className="w-full h-full border-0 filter sepia-[0.18] contrast-[0.96]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Love+Gardens+Villa+Pearlsville+CA+1238+Miami"
              target="_blank"
              rel="noopener noreferrer"
              className="embossed-button w-full sm:w-auto px-6 py-3 rounded-xs border border-[#C8BFA8] font-roman-caps text-xs tracking-[0.2em] text-[#3B2F26] inline-flex items-center justify-center gap-2"
            >
              <Navigation className="w-3.5 h-3.5 text-[#3B2F26]" />
              <span>GET DIRECTIONS</span>
            </a>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="embossed-button w-full sm:w-auto px-5 py-3 rounded-xs border border-[#D5CDBD] font-roman-caps text-xs tracking-[0.18em] text-[#3B2F26] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3B2F26]" />
                  <span>ADDRESS COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#6E5D4F]" />
                  <span>COPY ADDRESS</span>
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
            ATTIRE PALETTE
          </p>
          <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] mb-4 letterpress-text">
            Dress Code
          </h2>

          <div className="space-y-1 mb-6">
            <p className="font-roman-caps text-xs sm:text-sm tracking-[0.22em] text-[#3B2F26]">
              DRESSCODE: PLEASE WEAR
            </p>
            <p className="font-roman-caps text-xs sm:text-sm tracking-[0.22em] text-[#3B2F26]">
              SOMETHING WHITE OR BROWN
            </p>
          </div>

          {/* ChungDoi Circular Swatch Palette */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-6">
            {DRESS_CODE_SWATCHES.map((swatch) => (
              <div key={swatch.name} className="flex flex-col items-center">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#3B2F26]/30 shadow-xs"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name}
                />
                <span className="mt-2 font-roman-caps text-[9px] tracking-[0.14em] text-[#6E5D4F]">
                  {swatch.name.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>

          <p className="font-serif-editorial text-base text-[#5C4B3E] max-w-sm mx-auto leading-relaxed">
            We kindly invite our guests to coordinate in soft whites, warm ivory, linen oatmeal, or rich espresso brown tones.
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
              PROGRAM OF EVENTS
            </p>
            <h2 className="font-script text-4xl sm:text-5xl text-[#3B2F26] letterpress-text">
              Order of the Day
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
        <GuestbookSection
          wishes={wishes}
          onWishAdded={(wish) => setWishes((prev) => [wish, ...prev])}
        />

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
              THANK YOU FOR CELEBRATING WITH US
            </p>

            <h2 className="font-script text-5xl sm:text-6xl text-[#3B2F26] my-5 letterpress-text">
              Elisabeth Anderson
            </h2>

            <div className="inline-flex items-center justify-center gap-4 my-3">
              <span className="font-roman-caps text-xs tracking-[0.26em] text-[#3B2F26]">JULY</span>
              <span className="h-6 w-[1px] bg-[#3B2F26]/70" aria-hidden="true" />
              <span className="font-serif-editorial text-3xl text-[#3B2F26] tabular-nums">16</span>
              <span className="h-6 w-[1px] bg-[#3B2F26]/70" aria-hidden="true" />
              <span className="font-serif-editorial text-base tracking-[0.2em] text-[#3B2F26] tabular-nums">
                2026
              </span>
            </div>

            <p className="font-roman-caps text-[10px] tracking-[0.22em] text-[#5C4B3E] mt-2">
              LOVE GARDENS VILLA · PEARLSVILLE CA 1238 MIAMI
            </p>

            <EmbossedFloralDivider className="my-6" />

            <p className="font-roman-caps text-[10px] tracking-[0.2em] text-[#6E5D4F] tabular-nums">
              RSVP BY 2 TH JULY AT 4122 222 222 · REGISTERED AT NAME
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
      </div>
    </>
  );
}
