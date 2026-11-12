import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface OpeningProps {
  onComplete: () => void;
  onStart: () => void;
  onReveal: () => void;
}

export function VideoInvitationOpening({ onComplete, onStart, onReveal }: OpeningProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealStarted = useRef(false);
  const playbackStarted = useRef(false);
  const [revealing, setRevealing] = useState(false);
  const reduceMotion = useReducedMotion();
  const callbacks = useRef({ onComplete });
  callbacks.current = { onComplete };

  useEffect(() => {
    if (!revealing) return;
    const video = videoRef.current;
    const remaining = video && Number.isFinite(video.duration) ? Math.max(0, video.duration - video.currentTime) * 1000 : 0;
    const timer = window.setTimeout(() => callbacks.current.onComplete(), Math.max(remaining, reduceMotion ? 150 : 1400));
    return () => window.clearTimeout(timer);
  }, [revealing, reduceMotion]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  const reveal = () => {
    if (revealStarted.current) return;
    revealStarted.current = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
    onReveal();
    setRevealing(true);
  };

  const playEnvelope = () => {
    const video = videoRef.current;
    if (!video || revealing) return;
    // The normalized opening sound plays through the shared music player.
    video.muted = true;
    if (!playbackStarted.current) {
      playbackStarted.current = true;
      onStart();
    }
    video.play().catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: revealing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.25, 0.1, 0.25, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label={revealing ? 'Revealing your invitation' : 'Open your invitation'}
      tabIndex={0}
      onClick={playEnvelope}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          playEnvelope();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#D5CDBD] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[#8A705A]"
    >
      <video
        ref={videoRef}
        src="/assets/envelope-opening.mp4"
        poster="/assets/envelope-opening-poster.jpg"
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (video && Number.isFinite(video.duration) && video.currentTime >= video.duration - 1.4) {
            reveal();
          }
        }}
        onEnded={reveal}
        onError={reveal}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </motion.div>
  );
}
