'use client';

import tmuLogo from '../assets/tmu-monkey-logo.png';
import Link from 'next/link';
import { useEffect, useState } from "react";
import lightIcon from '../assets/light.png';
import { Moon, Menu, X } from 'lucide-react';


export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // On mount, check localStorage or prefers-color-scheme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <>
      <nav className="bg-black backdrop-blur-xl text-white px-4 md:px-8 lg:px-20 h-[64px] flex flex-row justify-between items-center fixed top-0 left-0 w-full text-[13px] md:text-[15px] border-b-4 border-secondary z-50">

        <Link href='/'>
            <div className="text-lg md:text-xl font-bold flex flex-row hover:cursor-pointer items-center">
              <img src={tmuLogo.src} alt="TMU Logo" className="h-8 w-8 md:h-15 md:w-15" />
              <p className="text-[#3375C2]">TMU</p>
              <p className="text-[#f5d60b]">.planner</p>
            </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex space-x-1 xl:space-x-3 font-bold text-[15px]">
            <li>
              <Link href="/catalogue" className="p-1 md:p-2 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-200">Catalogue</Link>
            </li>
            <li>
              <Link href="/planner" className="p-1 md:p-2 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-200">Degree Planner</Link>
            </li>
            <li>
              <Link href="/transcript" className="p-1 md:p-2 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-200">Transcript Analyser</Link>
            </li>
            <li>
              <Link href="" className="p-1 md:p-2 rounded-[10px] hover:bg-gray-500 hover:cursor-not-allowed transition-colors duration-200">Schedule Builder</Link>
            </li>
        </ul>

        <div className='flex flex-row gap-2 md:gap-4 items-center'>
            {/* Desktop buttons */}
            <div className="hidden xl:flex gap-2 md:gap-4">
              <Link href="/feedback" className="px-3 md:px-5 py-1 md:py-2 rounded-[5px] bg-yellow-400 text-black hover:opacity-80 transition-all duration-100 hover:scale-101 font-bold text-xs md:text-sm">Feedback</Link>
              <Link href="/login" className="px-3 md:px-5 py-1 md:py-2 rounded-[5px] bg-red-500 hover:bg-red-800 transition-all duration-100 hover:scale-101 font-bold text-xs md:text-[15px]">Login</Link>
            </div>

            {/* Theme toggle - always visible */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl text-xl md:text-2xl font-bold p-1 md:p-2 transition-all duration-200 hover:cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <img src={lightIcon.src} alt="Light Mode" width={18} height={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="text-white md:w-5 md:h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden rounded-xl text-xl font-bold p-1 transition-all duration-200 hover:cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
        </div>
      </nav>

      <div className={`fixed top-0 right-0 h-full w-full z-40 xl:hidden pointer-events-none`}>
        <div className="absolute top-0 left-0 h-full w-1/2 bg-transparent pointer-events-auto" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-1/2 min-w-[220px] max-w-[400px] bg-black/70 backdrop-blur-md border-l-2 border-secondary transform transition-transform duration-75 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}>
          <div className="pt-25 px-6 flex flex-col space-y-4 text-sm">
            <Link 
              href="/catalogue" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-100 text-white font-bold text-center"
            >
              Catalogue
            </Link>
            <Link 
              href="/planner" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-100 text-white font-bold text-center"
            >
              Degree Planner
            </Link>
            <Link 
              href="/schedule" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-100 text-white font-bold text-center"
            >
              Schedule Builder
            </Link>
            <Link 
              href="/transcript" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-[10px] hover:bg-[#f5d60b] hover:text-black transition-colors duration-100 text-white font-bold text-center"
            >
              Transcript Analyser
            </Link>
            
            <div className="border-t border-gray-600 pt-4 space-y-3">
              <Link 
                href="/feedback" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-[5px] bg-yellow-400 text-black hover:opacity-80 transition-all duration-75 font-bold text-center"
              >
                Feedback
              </Link>
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-[5px] bg-red-500 hover:bg-red-800 transition-all duration-75 font-bold text-center text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
