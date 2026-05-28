"use client";

import Navbar from "@/components/navbar";
import DegreePlanner from "./DegreePlanner";

export default function Planner() {
  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 w-full max-w-7xl mt-16 sm:mt-20 md:mt-30 gap-3 sm:gap-4 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[70px] font-[800] text-secondary leading-tight">
          Degree Planner
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-[400] text-foreground max-w-4xl px-2">
          Take control of your academic journey. Use the degree planner to map out
          future semesters, organize required courses, and stay on track for
          graduation.
        </p>

        {/* Mobile tip banner */}
        <div className="lg:hidden bg-primary/10 border border-primary/30 rounded-xl p-3 max-w-md mx-auto text-center mt-1">
          <p className="text-xs sm:text-sm text-foreground font-semibold leading-relaxed">
            <span className="text-base mr-1">💡</span>
            Tap a course in the catalogue, then tap an empty slot to assign it.
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
