import logo from '@/assets/tmu-monkey-logo.png';
import Link from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = [
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/planner', label: 'Degree Planner' },
  { href: '/schedule', label: 'Schedule Builder' },
  { href: '/transcript', label: 'Transcript Analyser' },
  { href: '/gpa-calculator', label: 'GPA Calculator' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-xl text-foreground py-6 sm:py-4 flex flex-col items-center gap-4 sm:gap-3 w-full text-sm border-t-2 border-secondary shadow-lg shadow-black/5 z-10 px-4">
      <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
        <Image src={logo} alt="TMU Logo" width={32} height={32} className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12 drop-shadow-md" />
      </div>

      <ul className="flex flex-row flex-wrap gap-x-5 gap-y-1 justify-center items-center max-w-md">
        {FOOTER_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="relative inline-flex items-center px-2 py-2 text-[13px] sm:text-xs font-medium transition-all duration-300 group"
            >
              <span className="relative z-10">{label}</span>
              <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-borders transition-all duration-300 group-hover:w-[calc(100%-1rem)] group-hover:left-2"></div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>

      <p className="text-center text-foreground text-[12px] sm:text-[11px] leading-relaxed max-w-3xl px-2">
        © 2025 TMU Pulse. All rights reserved. This planner is independently developed and is not officially affiliated with Toronto Metropolitan University.
      </p>
    </footer>
  );
}
