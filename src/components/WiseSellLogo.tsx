import React from 'react';

interface WiseSellLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const WiseSellLogo: React.FC<WiseSellLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const fontSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon combining Orange, Blue, White on Obsidian Black */}
      <div
        className={`${iconDimensions} rounded-xl bg-black border border-slate-800 shadow-md flex items-center justify-center p-1.5 shrink-0 relative overflow-hidden`}
        title="WiseSell AI - Orange, Blue, White & Black Emblem"
      >
        {/* Ambient subtle backglow */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500/30 rounded-full blur-sm" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-600/30 rounded-full blur-sm" />

        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Upper Orange dynamic chevron/wing */}
          <path
            d="M6 14L16 6L24 14L16 22L6 14Z"
            fill="#F97316"
          />
          {/* Lower Royal Blue dynamic chevron/wing */}
          <path
            d="M16 26L24 18L34 26L24 34L16 26Z"
            fill="#2563EB"
          />
          {/* Interlocking crisp White central lightning / arrow core */}
          <path
            d="M19 11L28 19L21 21L23 29L14 21L21 19L19 11Z"
            fill="#FFFFFF"
          />
          {/* Sharp contrast geometric cut in deep black */}
          <circle cx="20" cy="20" r="1.5" fill="#000000" />
        </svg>
      </div>

      {/* Wordmark: Wise in White, Sell in Orange, AI in Royal Blue badge */}
      {showWordmark && (
        <div className="flex items-center tracking-tight leading-none">
          <span className={`${fontSize} font-extrabold text-white`}>Wise</span>
          <span className={`${fontSize} font-extrabold text-orange-500`}>Sell</span>
          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono text-white bg-blue-600 uppercase">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
