"use client";

import Navbar from "@/components/navbar";
import DegreePlanner from "./DegreePlanner";

export default function Planner() {
  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-30 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary">Degree Planner</h1>
        <p className="text-[20px] font-[400] text-foreground">
          Take control of your academic journey. Use the degree planner to map out
          future semesters, organize required courses, and stay on track for
          graduation. Visualize your progress and plan what's next with clarity.
        </p>
        <div className="mt-5 bg-background">
          <DegreePlanner />
        </div>
      </div>
    </main>
  );
}
