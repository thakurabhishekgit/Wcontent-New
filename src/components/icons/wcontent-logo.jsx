
import React from 'react';

const WcontentLogo = ({ className = "h-6 w-6", ...props }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(180, 70%, 50%)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Stylized W */}
    <path
      d="M10 20 L30 80 L50 40 L70 80 L90 20"
      stroke="url(#logoGradient)"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Simple content element (pencil tip like) */}
    <path
        d="M75 15 L90 30 L80 40 Z"
        fill="hsl(var(--primary) / 0.7)"
    />
  </svg>
);

export default WcontentLogo;
