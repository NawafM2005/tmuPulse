"use client";

import Navbar from "@/components/navbar";
import DegreePlanner from "./DegreePlanner";

export default function Planner() {
  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      <Navbar />

            <div className="container mx-auto px-8 md:px-30 lg:px-42 py-8 mt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[800] text-secondary leading-tight">
          Degree Planner
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-secondary mt-4 mb-8">
          Take control of your academic journey. Use the degree planner to map out
          your courses by semester and visualize your path to graduation.
        </p>
        
        {/* Show message for small devices (mobile phones) */}
        <div className="md:hidden mt-6 bg-card-bg border-2 border-borders rounded-2xl shadow-lg p-6 text-center max-w-md">
          <div className="mb-4 text-6xl">📱</div>
          <h2 className="text-primary font-bold text-xl mb-3">
            Screen Too Small
          </h2>
          <p className="text-foreground text-sm leading-relaxed mb-4">
            The Degree Planner requires a larger screen for the best experience. 
            Please use a tablet, laptop, or desktop computer to access the planner.
          </p>
          <div className="text-xs text-muted">
            Minimum screen width: 768px (tablet size)
          </div>
        </div>

        {/* Show planner for tablets and larger devices */}
        <div className="hidden md:block mt-5 bg-background w-full">
          <DegreePlanner />
        </div>
      </div>
    </main>
  );
}
