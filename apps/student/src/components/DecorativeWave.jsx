import React from 'react';

/**
 * DecorativeWave Component
 * Generates an elegant, multi-layered flowing orange ribbon / wave graphic
 * inspired directly by the PostFlow SaaS visual style reference.
 */
export function DecorativeWave({ className = '', style = {} }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '58%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.88,
        ...style,
      }}
      className={className}
    >
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.15) translateY(-5%)',
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients matching exact brand colors */}
          <linearGradient id="waveGrad1" x1="100" y1="50" x2="700" y2="550" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE5CE" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#FA9B2A" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#FE6904" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FA9B2A" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="waveGrad2" x1="0" y1="200" x2="800" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FE6904" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#FA9B2A" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#FFE5CE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waveGrad3" x1="300" y1="100" x2="600" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE5CE" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FA9B2A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FE6904" stopOpacity="0.85" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="30" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Warm Glow */}
        <circle cx="550" cy="300" r="180" fill="#FFE5CE" opacity="0.45" filter="url(#softGlow)" />
        <circle cx="650" cy="220" r="120" fill="#FA9B2A" opacity="0.25" filter="url(#softGlow)" />

        {/* Sweeping Ribbon Layers */}
        <path
          d="M200 450 C380 430 450 280 580 230 C690 190 750 220 850 210 L850 480 C740 470 660 520 520 540 C380 560 250 510 200 450 Z"
          fill="url(#waveGrad1)"
        />
        <path
          d="M260 410 C420 390 490 240 620 190 C730 150 780 180 880 170 L880 340 C760 350 680 390 560 430 C440 470 320 440 260 410 Z"
          fill="url(#waveGrad3)"
          opacity="0.85"
        />
        <path
          d="M150 480 C320 460 400 320 540 260 C660 210 740 260 850 250 C760 360 620 420 480 470 C340 520 220 510 150 480 Z"
          fill="url(#waveGrad2)"
        />

        {/* Delicate Flow Lines */}
        <path
          d="M180 440 C350 410 440 260 590 210 C700 170 770 200 860 190"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          fill="none"
        />
        <path
          d="M220 460 C380 430 460 290 600 240 C710 200 770 220 870 215"
          stroke="#FA9B2A"
          strokeWidth="1.2"
          strokeOpacity="0.75"
          fill="none"
        />
        <path
          d="M250 480 C410 450 480 320 620 270 C730 230 790 250 880 240"
          stroke="#FE6904"
          strokeWidth="1"
          strokeOpacity="0.5"
          fill="none"
        />
      </svg>
    </div>
  );
}
