"use client";
import tmuLogo from '@/assets/tmu-monkey-logo.png';
import Image from 'next/image';

export default function Error() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground">
      <Image src={tmuLogo} alt="Logo" width={180} height={180} className="h-45 w-45 animate-bounce" />
      <span className="text-3xl font-bold text-secondary animate-pulse">
        Something went wrong... Please try again later.
      </span>
    </div>
  );
}
