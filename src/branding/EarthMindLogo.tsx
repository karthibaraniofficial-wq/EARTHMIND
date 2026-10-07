import React from 'react';
import { EarthMindSymbol } from './EarthMindSymbol';
import { BRAND_TOKENS, BrandSize } from './brand';

export interface EarthMindLogoProps {
  variant?: 'full' | 'symbol' | 'wordmark' | 'stacked';
  theme?: 'auto' | 'dark' | 'light' | 'white' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean | 'pulse' | 'orbit';
  showTagline?: boolean;
  taglineText?: string;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const EarthMindLogo: React.FC<EarthMindLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  animated = false,
  showTagline = false,
  taglineText = BRAND_TOKENS.tagline,
  badgeText,
  className = '',
  onClick,
  ariaLabel = 'EARTHMIND - Planetary Environmental Intelligence',
}) => {
  // Map size to symbol dimensions
  const symbolSizeMap: Record<string, BrandSize> = {
    sm: 'sm', // 24px
    md: 'md', // 32px
    lg: 'lg', // 48px
    xl: 'xl', // 64px
  };

  const textScaleMap: Record<string, { title: string; subtitle: string; badge: string }> = {
    sm: { title: 'text-sm sm:text-base', subtitle: 'text-[9px]', badge: 'text-[8.5px] px-1.5 py-0.5' },
    md: { title: 'text-base sm:text-lg', subtitle: 'text-[10px]', badge: 'text-[9.5px] px-2 py-0.5' },
    lg: { title: 'text-xl sm:text-2xl', subtitle: 'text-xs', badge: 'text-[10px] px-2.5 py-1' },
    xl: { title: 'text-3xl sm:text-4xl', subtitle: 'text-sm', badge: 'text-xs px-3 py-1' },
  };

  const currentScale = textScaleMap[size] || textScaleMap.md;
  const symbolSize = symbolSizeMap[size] || 'md';

  // Map theme to symbol variant
  const symbolVariant =
    theme === 'white'
      ? 'white'
      : theme === 'light' || theme === 'dark'
      ? 'dark'
      : theme === 'monochrome'
      ? 'monochrome'
      : 'primary';

  // Text color based on theme
  const textColorEarth =
    theme === 'white'
      ? 'text-white'
      : theme === 'light'
      ? 'text-slate-900'
      : 'text-white';

  const textColorMind =
    theme === 'white'
      ? 'text-white'
      : theme === 'light'
      ? 'text-teal-600'
      : 'text-earth-aqua';

  const textColorTagline =
    theme === 'white'
      ? 'text-white/75'
      : theme === 'light'
      ? 'text-slate-500'
      : 'text-slate-400';

  // If symbol-only variant
  if (variant === 'symbol') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role={onClick ? 'button' : 'img'}
        aria-label={ariaLabel}
      >
        <EarthMindSymbol
          size={symbolSize}
          variant={symbolVariant}
          animated={animated}
        />
      </div>
    );
  }

  // If wordmark-only variant
  if (variant === 'wordmark') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role={onClick ? 'button' : 'banner'}
        aria-label={ariaLabel}
      >
        <span className={`font-extrabold tracking-tight font-sans ${currentScale.title}`}>
          <span className={textColorEarth}>EARTH</span>
          <span className={textColorMind}>MIND</span>
        </span>
        {showTagline && (
          <span className={`font-mono font-medium tracking-wider uppercase ${textColorTagline} ${currentScale.subtitle}`}>
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // If stacked variant (symbol above, wordmark below)
  if (variant === 'stacked') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center text-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role={onClick ? 'button' : 'banner'}
        aria-label={ariaLabel}
      >
        <div className="p-1 rounded-2xl bg-gradient-to-br from-earth-deep/50 to-earth-ocean/50 backdrop-blur-md shadow-lg">
          <EarthMindSymbol
            size={size === 'xl' ? '2xl' : 'xl'}
            variant={symbolVariant}
            animated={animated}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight font-sans ${currentScale.title}`}>
              <span className={textColorEarth}>EARTH</span>
              <span className={textColorMind}>MIND</span>
            </span>
            {badgeText && (
              <span className={`rounded-full font-mono font-bold bg-earth-aqua/15 text-earth-aqua border border-earth-aqua/30 ${currentScale.badge}`}>
                {badgeText}
              </span>
            )}
          </div>
          {showTagline && (
            <span className={`font-mono font-semibold tracking-widest uppercase mt-0.5 ${textColorTagline} ${currentScale.subtitle}`}>
              {taglineText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: Full Horizontal Layout (Symbol + Wordmark)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 flex-shrink-0 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      role={onClick ? 'button' : 'banner'}
      aria-label={ariaLabel}
    >
      {/* Symbol Container with subtle liquid glass rim */}
      <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-earth-deep/40 via-earth-ocean/40 to-earth-aqua/20 shadow-[0_0_15px_rgba(24,200,200,0.25)] group-hover:shadow-[0_0_22px_rgba(24,200,200,0.45)] transition-all">
        <EarthMindSymbol
          size={symbolSize}
          variant={symbolVariant}
          animated={animated}
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 leading-none">
          <span className={`font-extrabold tracking-tight font-sans ${currentScale.title}`}>
            <span className={textColorEarth}>EARTH</span>
            <span className={textColorMind}>MIND</span>
          </span>

          {badgeText && (
            <span className={`hidden sm:inline-flex rounded-full font-mono font-bold bg-earth-aqua/15 text-earth-aqua border border-earth-aqua/30 ${currentScale.badge}`}>
              {badgeText}
            </span>
          )}
        </div>

        {showTagline && (
          <span className={`font-mono font-semibold tracking-wider uppercase mt-1 hidden sm:block ${textColorTagline} ${currentScale.subtitle}`}>
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
