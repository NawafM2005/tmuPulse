import logo from '@/assets/tmu-monkey-logo.png';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-xl text-foreground py-4 flex flex-col items-center gap-3 w-full text-[13px] sm:text-[12px] xs:text-[11px] border-t-2 border-secondary shadow-lg shadow-black/5 z-50">
      <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
        <img src={logo.src} alt="TMU Logo" className="h-8 w-8 xs:h-6 xs:w-6 transition-transform duration-300 group-hover:rotate-12 drop-shadow-md" />
      </div>
      <ul className="flex flex-row flex-wrap gap-4 text-[13px] p-1 justify-center items-center">
        <li>
          <Link href="/catalogue" className="relative p-1 xs:p-0.5 xs:text-[10px] transition-all duration-300 group">
            <span className="relative z-10">Catalogue</span>
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-borders transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
          </Link>
        </li>
        <li>
          <Link href="/planner" className="relative p-1 xs:p-0.5 xs:text-[10px] transition-all duration-300 group">
            <span className="relative z-10">Degree Planner</span>
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-borders transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
          </Link>
        </li>
        <li>
          <Link href="/transcript" className="relative p-1 xs:p-0.5 xs:text-[10px] transition-all duration-300 group">
            <span className="relative z-10">Transcript Analyser</span>
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-borders transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
          </Link>
        </li>
        <li>
          <Link href="/gpa-calculator" className="relative p-1 xs:p-0.5 xs:text-[10px] transition-all duration-300 group">
            <span className="relative z-10">GPA Calculator</span>
            <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-borders transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
          </Link>
        </li>
      </ul>
      <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
      <p className="text-center text-foreground text-[12px] sm:text-[11px] xs:text-[10px] px-3 max-w-3xl">
        © 2025 TMU Planner. All rights reserved. This planner is independently developed and is not officially affiliated with Toronto Metropolitan University.
      </p>
    </footer>
  );
}
