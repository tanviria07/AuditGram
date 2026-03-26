import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="auditgram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="50%" stopColor="#D946EF" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d="M50 12 L82 24 V48 C82 70 50 88 50 88 C50 88 18 70 18 48 V24 L50 12 Z" fill="url(#auditgram-gradient)" />
      <path
        d="M35 58 L48 45 L58 52 L68 38"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="68" cy="38" r="5" fill="#FFFFFF" />
    </svg>
  );
}
