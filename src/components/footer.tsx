import logo from '@/assets/tmu-monkey-logo.png';
import Link from 'next/link';

export default function Footer() {
  return (
    <main className="bg-black/30 backdrop-blur-xl text-white py-3 flex flex-col justify-between items-center gap-2 bottom-0 left-0 w-full text-[15px] border-t-2 border-secondary z-50">
        <img src={logo.src} alt="TMU Logo" className="h-10 w-10"/>
        <ul className="flex space-x-3 text-[15px]">
            <li>
              <Link href="/catalogue" className="p-2 rounded-[10px] hover:underline">Catalogue</Link>
            </li>
            <li>
              <Link href="/planner" className="p-2 rounded-[10px] hover:underline">Degree Planner</Link>
            </li>
            <li>
              <Link href="/schedule" className="p-2 rounded-[10px] hover:underline">Schedule Builder</Link>
            </li>
            <li>
              <Link href="transcript" className="p-2 rounded-[10px] hover:underline">Transcript Parser</Link>
            </li>
        </ul>
        <p>© 2025 TMU Planner. All rights reserved. This planner is independently developed and is not officially affiliated with Toronto Metropolitan University.</p>
    </main>
  );
}