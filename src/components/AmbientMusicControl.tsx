import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export interface AmbientMusicHandle {
  prepare: () => void;
  start: () => void;
}

export const AmbientMusicControl = forwardRef<AmbientMusicHandle>(function AmbientMusicControl(_, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const songUrl = useRef('/assets/wedding-song.mp3');
  const songStarted = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let cachedUrl: string | undefined;
    fetch('/assets/wedding-song.mp3', { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Song preload failed'); return response.blob(); })
      .then((blob) => {
        if (controller.signal.aborted) return;
        cachedUrl = URL.createObjectURL(blob);
        songUrl.current = cachedUrl;
      }).catch(() => {});
    return () => { controller.abort(); if (cachedUrl) URL.revokeObjectURL(cachedUrl); };
  }, []);

  const startSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || songStarted.current) return;
    songStarted.current = true;
    setError('');
    audio.src = songUrl.current;
    audio.loop = true;
    audio.volume = 0.45;
    audio.play().then(() => setIsPlaying(true)).catch(() => {
      setError('Tap the music control to play the song.');
    });
  }, []);

  useImperativeHandle(ref, () => ({
    prepare: () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = '/assets/envelope-opening-sound.mp3';
      audio.loop = false;
      audio.volume = 1;
      audio.play().catch(() => setError('Opening sound could not play. Please tap again.'));
    },
    start: startSong,
  }), [startSong]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setError('');
    try {
      audio.volume = 0.45;
      await audio.play();
    } catch {
      setError('Unable to play music. Please try again.');
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={startSong}
        onPlay={() => setIsPlaying((audioRef.current?.volume ?? 0) > 0)}
        onPause={() => setIsPlaying(false)}
        onError={() => { setIsPlaying(false); setError('Unable to load music. Please try again.'); }}
      />
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={isPlaying ? 'Pause wedding song by John Legend' : 'Play wedding song by John Legend'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="w-11 h-11 rounded-full cotton-cardstock border border-[#C8BFA8] shadow-lg flex items-center justify-center text-[#3B2F26] hover:scale-105 active:scale-95 transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-[#3B2F26]"
      >
        {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#7D6B5D]" />}
      </button>
      <span className="cotton-cardstock px-3 py-1.5 rounded-full border border-[#C8BFA8] shadow-sm flex items-center gap-1.5 text-[11px] font-roman-caps tracking-[0.14em] text-[#3B2F26]">
        <Music className="w-3 h-3 text-[#6E5D4F]" />
        John Legend
      </span>
      {error && <p role="status" className="absolute bottom-14 left-0 w-56 rounded bg-[#FAF8F4] p-3 text-xs text-[#3B2F26] shadow-lg">{error}</p>}
    </div>
  );
});
