'use client';

import tmuLogo from '../assets/tmu-monkey-logo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import lightIcon from '../assets/light.png';
import { Moon, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseUser } from '@supabase/supabase-js';


export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [mobileMenuOpen]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  // Check auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <nav className="backdrop-blur-sm bg-background/80 text-foreground px-4 md:px-8 lg:px-20 h-[64px] flex flex-row justify-between items-center fixed top-0 left-0 w-full text-[12px] md:text-[15px] border-b-2 border-secondary shadow-lg shadow-black/5 z-50">

        <Link href='/'>
            <div className="text-base md:text-xl font-bold flex flex-row hover:cursor-pointer items-center group transition-all duration-300">
              <Image src={tmuLogo} alt="TMU Logo" width={32} height={32} className="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:rotate-12" />
              <p className="text-[#3375C2] transition-colors duration-300 group-hover:text-[#4285d4]">TMU</p>
              <p className="text-[#d1b608] transition-colors duration-300">pulse</p>
            </div>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden xl:flex space-x-1 xl:space-x-3 font-bold text-sm items-center">
            <li>
              <Link href="/catalogue" className="p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#f5d60b] hover:to-[#ffeb3b] hover:text-black transition-all duration-300 hover:shadow-md relative overflow-hidden group">
                <span className="relative z-10">Catalogue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5d60b]/0 to-[#ffeb3b]/0 group-hover:from-[#f5d60b]/20 group-hover:to-[#ffeb3b]/20 transition-all duration-300 rounded-xl"></div>
              </Link>
            </li>
            <li>
              <Link href="/planner" className="p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#f5d60b] hover:to-[#ffeb3b] hover:text-black transition-all duration-300 hover:shadow-md relative overflow-hidden group">
                <span className="relative z-10">Degree Planner</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5d60b]/0 to-[#ffeb3b]/0 group-hover:from-[#f5d60b]/20 group-hover:to-[#ffeb3b]/20 transition-all duration-300 rounded-xl"></div>
              </Link>
            </li>
            <li>
              <Link href="/schedule" className="p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-500 hover:text-black transition-all duration-300 hover:shadow-md relative overflow-hidden group">
                <span className="relative z-10">Schedule Builder</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-400/20 group-hover:to-yellow-500/20 transition-all duration-300 rounded-xl"></div>
              </Link>
            </li>
            <li>
              <Link href="/gpa-calculator" className="p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#f5d60b] hover:to-[#ffeb3b] hover:text-black transition-all duration-300 hover:shadow-md relative overflow-hidden group">
                <span className="relative z-10">GPA Calculator</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5d60b]/0 to-[#ffeb3b]/0 group-hover:from-[#f5d60b]/20 group-hover:to-[#ffeb3b]/20 transition-all duration-300 rounded-xl"></div>
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 md:p-2 rounded-xl hover:bg-gradient-to-r hover:from-[#f5d60b] hover:to-[#ffeb3b] hover:text-black transition-all duration-300 hover:shadow-md flex items-center gap-1 font-bold text-[15px] hover:cursor-pointer relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-1">
                    More <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"/>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f5d60b]/0 to-[#ffeb3b]/0 group-hover:from-[#f5d60b]/20 group-hover:to-[#ffeb3b]/20 transition-all duration-300 rounded-xl"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-accent/30 border-2 shadow-xl shadow-black/10 rounded-xl flex flex-col items-center">
                  <DropdownMenuItem 
                      className="p-2 rounded-xl hover:cursor-pointer hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 focus:bg-blue-500/20 focus:text-blue-600 dark:focus:text-blue-400 transition-all duration-300 w-full"
                  >
                    <Link href="/about" className="w-full text-center">
                      <span className="relative z-10">About Us</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                      className="p-2 rounded-xl hover:cursor-pointer hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 focus:bg-purple-500/20 focus:text-purple-600 dark:focus:text-purple-400 transition-all duration-300 w-full"
                  >
                    <Link href="/releases" className="w-full text-center">
                      <span className="relative z-10">Release Notes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="p-2 rounded-xl hover:cursor-pointer hover:bg-yellow-500/20 hover:text-yellow-600 dark:hover:text-yellow-400 focus:bg-yellow-500/20 focus:text-yellow-600 dark:focus:text-yellow-400 transition-all duration-300 w-full"
                  >
                    <Link href="/transcript" className="w-full text-center">
                      <span className="relative z-10">Transcript Analyser</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
        </ul>

        <div className='flex flex-row gap-2 md:gap-4 items-center'>
            {/* Desktop buttons */}
            <div className="hidden xl:flex gap-2 md:gap-4">
              <Link href="/feedback" className="px-3 md:px-5 py-1 md:py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 hover:shadow-lg font-bold text-xs md:text-sm relative overflow-hidden group">
                <span className="relative z-10">Feedback</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 hover:shadow-lg relative overflow-hidden group hover:cursor-pointer">
                      <User size={18} className="relative z-10" />
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-accent/30 border-2 shadow-xl shadow-black/10 rounded-xl min-w-[180px]">
                      <DropdownMenuItem 
                        asChild
                        className="flex items-center gap-2 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 focus:bg-blue-500/20 focus:text-blue-600 dark:focus:text-blue-400"
                      >
                        <Link href="/dashboard">
                          <User size={16} />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 focus:bg-red-500/20 focus:text-red-600 dark:focus:text-red-400 transition-all duration-200 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" className="px-3 md:px-5 py-1 md:py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg font-bold text-xs md:text-[15px] text-white relative overflow-hidden group">
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                )
              )}
            </div>

            {/* Theme toggle - always visible */}
            <button
              onClick={toggleDarkMode}
              className="rounded-xl text-xl md:text-2xl font-bold p-2 md:p-3 transition-all duration-300 hover:cursor-pointer hover:bg-foreground/10 active:scale-95 group"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 
                <Image src={lightIcon} alt="Light Mode" width={18} height={18} className="md:w-5 md:h-5 transition-transform duration-300 group-hover:rotate-12 drop-shadow-md" /> : 
                <Moon size={18} className="text-foreground md:w-5 md:h-5 transition-transform duration-300 group-hover:rotate-12 drop-shadow-md" />
              }
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden rounded-xl font-bold p-2 transition-all duration-300 hover:cursor-pointer hover:bg-foreground/10 active:scale-95 touch-target flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ?
                <X size={24} className="text-foreground transition-transform duration-300 rotate-90" /> :
                <Menu size={24} className="text-foreground transition-transform duration-300" />
              }
            </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 xl:hidden bg-black/50 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[85%] min-w-[260px] max-w-[360px] bg-black/95 backdrop-blur-xl border-l border-secondary/30 shadow-2xl transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto overscroll-y-contain flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 sticky top-0 bg-black/95 backdrop-blur-xl z-10">
            <span className="text-white font-bold text-base">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="touch-target rounded-xl hover:bg-white/10 transition-colors active:scale-95 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={22} className="text-white" />
            </button>
          </div>

          <div className="px-4 py-4 flex flex-col gap-1.5 text-base">
            {[
              { href: '/catalogue', label: 'Catalogue' },
              { href: '/planner', label: 'Degree Planner' },
              { href: '/schedule', label: 'Schedule Builder' },
              { href: '/gpa-calculator', label: 'GPA Calculator' },
              { href: '/transcript', label: 'Transcript Analyser' },
              { href: '/about', label: 'About Us' },
              { href: '/releases', label: 'Release Notes' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isActive(href)
                    ? 'bg-gradient-to-r from-[#f5d60b] to-[#ffeb3b] text-black shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="border-t border-white/15 pt-3 mt-3 flex flex-col gap-2">
              <Link
                href="/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 font-bold active:scale-[0.98]"
              >
                Send Feedback
              </Link>

              {!loading && (
                user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-bold text-white active:scale-[0.98]"
                    >
                      <User size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 font-bold text-white hover:cursor-pointer active:scale-[0.98]"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 font-bold text-white active:scale-[0.98]"
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
