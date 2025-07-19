import tmuLogo from '../assets/tmu-monkey-logo.png';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black/30 backdrop-blur-xl text-white px-20 py-2 flex flex-row justify-between items-center gap-30 fixed top-0 left-0 w-full text-[15px] border-b-2 border-secondary z-50">
        
        <Link href='/'>
            <div className="text-xl font-bold flex flex-row hover:cursor-pointer items-center">
              <img src={tmuLogo.src} alt="TMU Logo" className="h-15 w-15" />

              <p className="text-accent">TMU</p>
              <p className="text-secondary">.planner</p>
            </div>
        </Link>

        <ul className="flex space-x-3 font-bold text-[15px]">
            <li>
              <Link href="/catalogue" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Catalogue</Link>
            </li>
            <li>
              <Link href="/planner" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Degree Planner</Link>
            </li>
            <li>
              <Link href="/schedule" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Schedule Builder</Link>
            </li>
            <li>
              <Link href="transcript" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Transcript Parser</Link>
            </li>
        </ul>

        <ul>
            <li>
            <Link href="/login" className="px-5 py-2 rounded-[5px] bg-red-500 hover:bg-red-800 transition-colors duration-100 font-bold text-[15px]">Login</Link>
            </li>
        </ul>
    </nav>
  );
}
