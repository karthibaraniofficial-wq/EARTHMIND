import React from 'react';
import { BRAND_TOKENS, BrandSize } from './brand';

export interface EarthMindSymbolProps {
  size?: BrandSize | number;
  variant?: 'primary' | 'white' | 'dark' | 'monochrome' | 'cyan' | 'emerald';
  animated?: boolean | 'pulse' | 'orbit';
  className?: string;
  isDecorative?: boolean;
  ariaLabel?: string;
}

export const EarthMindSymbol: React.FC<EarthMindSymbolProps> = ({
  size = 'md',
  variant = 'primary',
  animated = false,
  className = '',
  isDecorative = true,
  ariaLabel = 'EARTHMIND Planetary Intelligence Symbol',
}) => {
  const pixelSize = typeof size === 'number' ? size : BRAND_TOKENS.sizes[size] || 32;

  // Variant color definitions
  const isWhite = variant === 'white';
  const isDark = variant === 'dark';
  const isMonochrome = variant === 'monochrome';
  const isCyan = variant === 'cyan';
  const isEmerald = variant === 'emerald';

  const sphereStroke = isWhite
    ? '#FFFFFF'
    : isDark
    ? '#071A2B'
    : isMonochrome
    ? 'currentColor'
    : isCyan
    ? '#18C8C8'
    : isEmerald
    ? '#27C98A'
    : '#18C8C8';

  const equatorStroke = isWhite
    ? 'rgba(255,255,255,0.4)'
    : isDark
    ? 'rgba(7,26,43,0.35)'
    : isMonochrome
    ? 'currentColor'
    : 'rgba(24,200,200,0.35)';

  const centerNodeFill = isWhite
    ? '#FFFFFF'
    : isDark
    ? '#0E8686'
    : isMonochrome
    ? 'currentColor'
    : isEmerald
    ? '#27C98A'
    : '#27C98A';

  const eastNodeFill = isWhite ? '#FFFFFF' : isDark ? '#071A2B' : isMonochrome ? 'currentColor' : '#18C8C8';
  const westNodeFill = isWhite ? '#FFFFFF' : isDark ? '#071A2B' : isMonochrome ? 'currentColor' : '#9B7CFF';
  const polarNodeFill = isWhite ? '#FFFFFF' : isDark ? '#071A2B' : isMonochrome ? 'currentColor' : '#FFFFFF';

  // Animation classes
  const orbitAnimClass =
    animated === 'orbit' || animated === true
      ? 'animate-spin-slow origin-center'
      : '';
  const pulseAnimClass =
    animated === 'pulse'
      ? 'animate-pulse'
      : '';

  return (
    <svg
      viewBox="0 0 100 100"
      width={pixelSize}
      height={pixelSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 select-none ${pulseAnimClass} ${className}`}
      role={isDecorative ? 'presentation' : 'img'}
      aria-hidden={isDecorative}
      aria-label={!isDecorative ? ariaLabel : undefined}
    >
      <defs>
        <linearGradient id="em-sym-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E3354" />
          <stop offset="100%" stopColor="#071A2B" />
        </linearGradient>

        <linearGradient id="em-sym-orbit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#18C8C8" />
          <stop offset="50%" stopColor="#27C98A" />
          <stop offset="100%" stopColor="#9B7CFF" />
        </linearGradient>

        <linearGradient id="em-sym-bio-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#27C98A" />
          <stop offset="50%" stopColor="#18C8C8" />
          <stop offset="100%" stopColor="#0E8686" />
        </linearGradient>
      </defs>

      {/* 1. Outer Telemetry / Sensor Boundary Ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke={sphereStroke}
        strokeWidth="0.75"
        strokeOpacity={isWhite || isDark ? 0.25 : 0.2}
        strokeDasharray="3,3"
      />

      {/* 2. Back Arc of Orbital Ring (Depth behind the sphere) */}
      <path
        d="M 18,36 C 26,22 64,20 82,34"
        stroke={sphereStroke}
        strokeWidth="1.4"
        strokeOpacity={isWhite || isDark ? 0.35 : 0.3}
        strokeDasharray="3,3"
      />

      {/* 3. Core Planetary Sphere */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill={variant === 'primary' ? 'url(#em-sym-core-grad)' : 'none'}
        stroke={sphereStroke}
        strokeWidth={isDark ? 2.2 : 1.8}
      />

      {/* 4. Atmospheric Limb Horizon Arc */}
      <path
        d="M 23,38 A 32 32 0 0 1 77,38"
        stroke={isWhite ? '#FFFFFF' : isDark ? '#0E8686' : '#38BDF8'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity={0.65}
      />

      {/* 5. Equatorial Coordinate Line */}
      <path
        d="M 18,50 Q 50,59 82,50"
        stroke={equatorStroke}
        strokeWidth="1.2"
      />

      {/* 6. Living Biosphere Meridian Arc */}
      <path
        d="M 50,18 C 34,30 34,70 50,82"
        stroke={variant === 'primary' ? 'url(#em-sym-bio-grad)' : sphereStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* 7. Neural Geodesic Signal Lines (AI Intelligence Matrix) */}
      <line
        x1="50"
        y1="18"
        x2="50"
        y2="50"
        stroke={isWhite || isDark ? sphereStroke : '#FFFFFF'}
        strokeWidth="1"
        strokeOpacity={0.5}
        strokeDasharray="2,1.5"
      />
      <line
        x1="50"
        y1="50"
        x2="79"
        y2="40"
        stroke={sphereStroke}
        strokeWidth="1"
        strokeOpacity={0.6}
      />
      <line
        x1="50"
        y1="50"
        x2="27"
        y2="72"
        stroke={isWhite || isDark ? sphereStroke : '#9B7CFF'}
        strokeWidth="1"
        strokeOpacity={0.6}
      />

      {/* 8. Front Arc of Orbital Ring (Sweeping in front with depth) */}
      <g className={orbitAnimClass}>
        <path
          d="M 82,34 C 95,48 78,74 48,78 C 22,82 8,66 18,36"
          stroke={variant === 'primary' ? 'url(#em-sym-orbit-grad)' : sphereStroke}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </g>

      {/* 9. Neural Intelligence Vertex Nodes */}
      {/* Central Synthesis Node */}
      <circle
        cx="50"
        cy="50"
        r="3.4"
        fill={centerNodeFill}
        stroke={isWhite || isDark ? 'none' : '#FFFFFF'}
        strokeWidth="1"
      />
      {/* North Polar Observation Node */}
      <circle cx="50" cy="18" r="2.2" fill={polarNodeFill} />
      {/* East Orbital Apex Node */}
      <circle cx="79" cy="40" r="2.8" fill={eastNodeFill} />
      {/* South-West Terrestrial Station Node */}
      <circle cx="27" cy="72" r="2.8" fill={westNodeFill} />
    </svg>
  );
};
