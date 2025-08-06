import logo from '@/assets/tmu-monkey-logo.png';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black backdrop-blur-xl text-white py-3 flex flex-col items-center gap-2 w-full text-[15px] sm:text-[14px] xs:text-[12px] border-t-4 border-red-400 z-50">
      <img src={logo.src} alt="TMU Logo" className="h-10 w-10 xs:h-8 xs:w-8" />
      <ul className="flex flex-row flex-wrap gap-3 text-[15px] p-2 justify-center items-center">
        <li>
          <Link href="/catalogue" className="p-2 rounded-[10px] hover:underline xs:p-1 xs:text-[11px]">Catalogue</Link>
        </li>
        <li>
          <Link href="/planner" className="p-2 rounded-[10px] hover:underline xs:p-1 xs:text-[11px]">Degree Planner</Link>
        </li>
        <li>
          <Link href="/transcript" className="p-2 rounded-[10px] hover:underline xs:p-1 xs:text-[11px]">Transcript Analyser</Link>
        </li>
        <li>
          <Link href="/gpa-calculator" className="p-2 rounded-[10px] hover:underline xs:p-1 xs:text-[11px]">GPA Calculator</Link>
        </li>
        <li>
          <span className="p-2 rounded-[10px] text-gray-500 xs:p-1 xs:text-[11px] cursor-not-allowed">Schedule Builder</span>
        </li>
      </ul>
      <p className="text-center text-[15px] sm:text-[13px] xs:text-[11px] px-2">© 2025 TMU Planner. All rights reserved. This planner is independently developed and is not officially affiliated with Toronto Metropolitan University.</p>
    </footer>
  );
}
