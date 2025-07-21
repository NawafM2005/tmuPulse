"use client";
import tmuLogo from '@/assets/tmu-monkey-logo.png';
import { use } from 'react';

export default function Error() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground">
      <img src={tmuLogo.src} alt="Logo" className="h-45 w-45 animate-bounce" />
      <span className="text-3xl font-bold text-secondary animate-pulse">
        Something went wrong... Please try again later.
      </span>
    </div>
  );
}
