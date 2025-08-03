"use client";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const syncTheme = () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    syncTheme();
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
    };
  }, []);
  return <>{children}</>;
}
