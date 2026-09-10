import React from 'react';

interface SportsFlyLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const SportsFlyLogo: React.FC<SportsFlyLogoProps> = ({
  className = 'w-9 h-9',
  size,
  showText = false,
}) => {
  const dimensionStyle = size
    ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }
    : undefined;

  return (
    <div className={`flex items-center gap-2.5 ${showText ? '' : 'shrink-0'}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 ${className}`}
        style={dimensionStyle}
      >
        <img
          src="/sportsfly-logo.svg"
          alt="SportsFly Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-slate-800 font-sans">
          SportsFly
        </span>
      )}
    </div>
  );
};
