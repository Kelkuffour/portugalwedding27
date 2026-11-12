import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // px (16 - 32)
  duration: number; // seconds (4.5 - 9)
  delay: number; // seconds (0 - 3)
  rotationStart: number; // deg
  rotationEnd: number; // deg
  swayAmount: number; // px (-60 to 60)
  type: 'white-rose' | 'cream-petal' | 'blush-petal' | 'leaf';
}

export const FallingFlowersEffect: React.FC<{ active: boolean }> = ({ active }) => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    // Generate ~32 unique drifting petals and small blossoms
    const generated: Petal[] = Array.from({ length: 32 }, (_, i) => {
      const types: Petal['type'][] = ['white-rose', 'cream-petal', 'blush-petal', 'leaf'];
      return {
        id: i,
        left: Math.random() * 96 + 2,
        size: Math.floor(Math.random() * 16) + 16,
        duration: Math.random() * 4 + 5.5,
        delay: Math.random() * 2.8,
        rotationStart: Math.random() * 360,
        rotationEnd: Math.random() * 720 - 360,
        swayAmount: (Math.random() - 0.5) * 90,
        type: types[Math.floor(Math.random() * types.length)],
      };
    });

    setPetals(generated);
    setVisible(true);

    // Fade out and cleanup after petals have drifted down
    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 11000);

    return () => window.clearTimeout(timeout);
  }, [active]);

  if (!visible || petals.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute -top-12 animate-falling-petal will-change-transform"
          style={
            {
              left: `${petal.left}%`,
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              '--sway-x': `${petal.swayAmount}px`,
              '--rot-start': `${petal.rotationStart}deg`,
              '--rot-end': `${petal.rotationEnd}deg`,
            } as React.CSSProperties
          }
        >
          {petal.type === 'white-rose' ? (
            /* Miniature white garden rose bloom */
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="w-full h-full drop-shadow-[0_2px_4px_rgba(92,77,62,0.18)]"
            >
              <circle cx="16" cy="16" r="14" fill="#FAF8F3" stroke="#E2DDD2" strokeWidth="0.8" />
              <path
                d="M10 16 C9 11, 15 9, 18 12 C22 10, 25 14, 23 18 C25 22, 21 25, 17 24 C13 25, 9 21, 10 16 Z"
                fill="#FFFFFF"
                stroke="#DDD6C8"
                strokeWidth="0.7"
              />
              <path
                d="M14 16 C14 13.5, 17.5 13, 18.5 15.5 C19.5 17, 17.5 19, 16 18"
                stroke="#C7BCAC"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>
          ) : petal.type === 'cream-petal' ? (
            /* Single soft ivory petal */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full drop-shadow-[0_2px_3px_rgba(92,77,62,0.14)]"
            >
              <path
                d="M12 2 C18 6, 22 14, 18 20 C14 24, 6 22, 4 16 C2 10, 6 4, 12 2 Z"
                fill="#F7F5EF"
                stroke="#E5E0D5"
                strokeWidth="0.6"
              />
            </svg>
          ) : petal.type === 'blush-petal' ? (
            /* Blush-tinted white rose petal */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full drop-shadow-[0_2px_3px_rgba(92,77,62,0.14)]"
            >
              <path
                d="M12 2 C19 7, 21 16, 17 21 C12 24, 5 21, 4 14 C3 8, 8 3, 12 2 Z"
                fill="#FAF4F0"
                stroke="#EAE0D6"
                strokeWidth="0.6"
              />
            </svg>
          ) : (
            /* Subtle olive botanical sprig / leaf */
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="w-full h-full opacity-85 drop-shadow-[0_2px_3px_rgba(92,77,62,0.12)]"
            >
              <path
                d="M3 17 C6 10, 14 6, 18 3 C15 10, 10 15, 3 17 Z"
                fill="#E8E5DC"
                stroke="#CDC5B5"
                strokeWidth="0.7"
              />
              <path d="M4 16 C9 12, 13 8, 17 4" stroke="#BCB3A1" strokeWidth="0.5" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};
