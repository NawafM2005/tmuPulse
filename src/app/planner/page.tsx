"use client";

import Navbar from "@/components/navbar";
import DegreePlanner from "./DegreePlanner";

export default function Planner() {
  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 w-full max-w-7xl mt-16 sm:mt-20 md:mt-30 gap-4 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[70px] font-[800] text-secondary leading-tight">
          Degree Planner
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-[400] text-foreground max-w-4xl px-2">
          Take control of your academic journey. Use the degree planner to map out
          future semesters, organize required courses, and stay on track for
          graduation. Visualize your progress and plan what&apos;s next with clarity.
        </p>
        
        {/* Mobile tip banner */}
        <div className="md:hidden mb-4 bg-primary/10 border border-primary/30 rounded-xl p-3 max-w-md mx-auto text-center">
          <p className="text-xs text-foreground font-semibold">
            💡 Tip: Drag courses from the catalogue into semester slots. On mobile, scroll down past the semesters to see the course catalogue.
          </p>
        </div>

        {/* Degree Planner - shown on all screen sizes */}
        <div className="mt-2 sm:mt-5 bg-background w-full">
          <DegreePlanner />
        </div>
      </div>
    </main>
  );
}
