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
    <div className={`inline-flex items-center gap-2.5 ${showText ? '' : 'shrink-0'}`}>
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
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
        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
          SportsFly
        </span>
      )}
    </div>
  );
};

export const SportsFlyIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
    <img
      src="/sportsfly-logo.svg"
      alt="SportsFly"
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
  </span>
);

