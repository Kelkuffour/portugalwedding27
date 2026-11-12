import React from 'react';

interface EmbossedRoseCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmbossedRoseCorner: React.FC<EmbossedRoseCornerProps> = ({
  position,
  className = '',
  size = 'lg',
}) => {
  const rotationClass = {
    'top-left': 'rotate-0 top-1.5 left-1.5',
    'top-right': 'scale-x-[-1] top-1.5 right-1.5',
    'bottom-left': 'scale-y-[-1] bottom-1.5 left-1.5',
    'bottom-right': 'scale-[-1] bottom-1.5 right-1.5',
  }[position];

  const dimensions = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52',
  }[size];

  return (
    <div
      className={`pointer-events-none select-none absolute z-10 ${rotationClass} ${dimensions} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full blind-emboss-svg animate-rose-glow"
      >
        {/* Subtle Corner Stem & Botanical Ribbons with subtle breathe */}
        <g className="animate-floral-breathe">
          <path
            d="M10 10 C45 12, 95 14, 165 20 M10 10 C12 45, 14 95, 20 165"
            stroke="#E5E0D5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Horizontal Leaf Sprig Along Top Edge with gentle breeze sway */}
        <g fill="#F4F1EA" stroke="#DFD9CD" strokeWidth="1" className="animate-leaf-h">
          {/* Outer Leaf 1 */}
          <path d="M92 16 C108 4, 128 5, 142 15 C126 24, 106 23, 92 16 Z" />
          <path d="M96 15.5 C112 14, 125 14, 138 15" stroke="#E2DCD0" strokeWidth="0.9" fill="none" />

          {/* Outer Leaf 2 */}
          <path d="M128 19 C144 8, 164 9, 178 18 C162 26, 142 25, 128 19 Z" />
          <path d="M132 18.5 C148 17, 160 17, 173 18" stroke="#E2DCD0" strokeWidth="0.9" fill="none" />

          {/* Tip Leaf */}
          <path d="M164 21 C178 13, 194 14, 206 21 C192 28, 176 27, 164 21 Z" />

          {/* Inner Lower Leaves on Top Branch */}
          <path d="M88 26 C104 36, 122 36, 136 27 C122 18, 102 19, 88 26 Z" />
          <path d="M125 28 C140 37, 156 36, 168 28 C154 20, 138 21, 125 28 Z" />
          <path d="M68 38 C82 48, 98 46, 110 35 C96 26, 80 28, 68 38 Z" />
        </g>

        {/* Vertical Leaf Sprig Along Left Edge with gentle breeze sway */}
        <g fill="#F4F1EA" stroke="#DFD9CD" strokeWidth="1" className="animate-leaf-v">
          {/* Outer Leaf 1 */}
          <path d="M16 92 C4 108, 5 128, 15 142 C24 126, 23 106, 16 92 Z" />
          <path d="M15.5 96 C14 112, 14 125, 15 138" stroke="#E2DCD0" strokeWidth="0.9" fill="none" />

          {/* Outer Leaf 2 */}
          <path d="M19 128 C8 144, 9 164, 18 178 C26 162, 25 142, 19 128 Z" />
          <path d="M18.5 132 C17 148, 17 160, 18 173" stroke="#E2DCD0" strokeWidth="0.9" fill="none" />

          {/* Tip Leaf */}
          <path d="M21 164 C13 178, 14 194, 21 206 C28 192, 27 176, 21 164 Z" />

          {/* Inner Right Leaves on Vertical Branch */}
          <path d="M26 88 C36 104, 36 122, 27 136 C18 122, 19 102, 26 88 Z" />
          <path d="M28 125 C37 140, 36 156, 28 168 C20 154, 21 138, 28 125 Z" />
          <path d="M38 68 C48 82, 46 98, 35 110 C26 96, 28 80, 38 68 Z" />
        </g>

        {/* Diagonal Corner Framing Leaves Behind Rose */}
        <g fill="#F3F0E8" stroke="#DDD6C9" strokeWidth="1.1" className="animate-floral-breathe">
          <path d="M8 8 C28 6, 48 12, 62 26 C46 38, 24 32, 8 8 Z" />
          <path d="M8 8 C6 28, 12 48, 26 62 C38 46, 32 24, 8 8 Z" />
          <path d="M58 58 C76 52, 94 58, 102 74 C86 84, 68 76, 58 58 Z" />
          <path d="M58 58 C52 76, 58 94, 74 102 C84 86, 76 68, 58 58 Z" />
        </g>

        {/* Sculpted Blind-Embossed English Rose in Corner Center - Living Blooming Pulse */}
        <g className="animate-rose-center">
          {/* Outer Rose Guard Petals */}
          <path
            d="M28 42 C22 26, 42 16, 58 24 C74 18, 88 34, 80 50 C88 66, 74 84, 56 78 C42 86, 22 74, 28 56 Z"
            fill="#F5F2EB"
            stroke="#DED7CA"
            strokeWidth="1.2"
          />
          {/* Second Tier Lush Cupped Petals */}
          <path
            d="M34 45 C30 32, 46 24, 58 30 C70 26, 80 38, 74 52 C80 64, 68 76, 54 72 C42 78, 28 66, 34 52 Z"
            fill="#F7F5EF"
            stroke="#DFD8CB"
            strokeWidth="1.2"
          />
          {/* Individual Sculpted Petal Folds */}
          <path
            d="M36 44 C38 32, 52 28, 62 35 C54 40, 44 42, 36 44 Z"
            fill="#FAF8F3"
            stroke="#DFD8CB"
            strokeWidth="1"
          />
          <path
            d="M62 34 C72 36, 78 48, 70 58 C66 48, 64 40, 62 34 Z"
            fill="#FAF8F3"
            stroke="#DFD8CB"
            strokeWidth="1"
          />
          <path
            d="M70 58 C66 68, 52 74, 42 66 C52 64, 62 62, 70 58 Z"
            fill="#FAF8F3"
            stroke="#DFD8CB"
            strokeWidth="1"
          />
          <path
            d="M42 66 C32 60, 30 48, 38 40 C40 50, 40 58, 42 66 Z"
            fill="#FAF8F3"
            stroke="#DFD8CB"
            strokeWidth="1"
          />
          {/* Inner Whorl Petals */}
          <path
            d="M43 48 C42 39, 53 35, 60 41 C67 45, 65 56, 58 60 C50 65, 41 58, 43 48 Z"
            fill="#F9F7F2"
            stroke="#DBD4C6"
            strokeWidth="1.1"
          />
          {/* Tight Rose Heart Swirl */}
          <path
            d="M48 50 C48 44, 55 43, 58 47 C61 51, 57 57, 52 56 C47 55, 46 49, 51 47 C54 46, 56 49, 54 52"
            fill="none"
            stroke="#D5CDBD"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

interface EmbossedCardFrameProps {
  children: React.ReactNode;
  className?: string;
  cornerSize?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const EmbossedCardFrame: React.FC<EmbossedCardFrameProps> = ({
  children,
  className = '',
  cornerSize = 'lg',
  id,
}) => {
  return (
    <div
      id={id}
      className={`relative cotton-cardstock overflow-hidden border border-[#E2DDD2] ${className}`}
    >
      <EmbossedRoseCorner position="top-left" size={cornerSize} />
      <EmbossedRoseCorner position="top-right" size={cornerSize} />
      <EmbossedRoseCorner position="bottom-left" size={cornerSize} />
      <EmbossedRoseCorner position="bottom-right" size={cornerSize} />
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export const EmbossedFloralDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 my-6 select-none ${className}`} aria-hidden="true">
    <span className="h-[1px] w-16 sm:w-24 bg-[#8A7666]/35" />
    <svg
      viewBox="0 0 64 28"
      className="w-14 h-6 blind-emboss-svg animate-floral-breathe"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 14 C14 7, 22 8, 28 14 C22 20, 14 21, 6 14 Z" fill="#F5F2EB" stroke="#DCD5C7" strokeWidth="1" className="animate-leaf-h" />
      <path d="M58 14 C50 7, 42 8, 36 14 C42 20, 50 21, 58 14 Z" fill="#F5F2EB" stroke="#DCD5C7" strokeWidth="1" className="animate-leaf-v" />
      <g className="animate-rose-center">
        <circle cx="32" cy="14" r="6.5" fill="#F8F6F1" stroke="#DAD2C4" strokeWidth="1.1" />
        <path d="M29.5 14 C29.5 12, 32.5 11.5, 34 13.5 C35 15, 33 17, 31 16" stroke="#CFC6B6" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
    <span className="h-[1px] w-16 sm:w-24 bg-[#8A7666]/35" />
  </div>
);
