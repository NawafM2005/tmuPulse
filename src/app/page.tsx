import Navbar from "@/components/navbar";
import tmuLogo from '@/assets/tmu-monkey-logo.png';

export default function Home() {
  return (
    <main className="flex flex-row min-h-screen items-center justify-center bg-foreground">
      <Navbar />

      <div className="flex flex-col items-center justify-center">
        <div className="text-white flex flex-col gap-4 p-10 items-center justify-center">
          <h1 className="text-[70px] font-[800]">Welcome to Your TMU Dashboard</h1>
          <h3 className="text-[30px] font-[600]">Shape Your Semester,</h3>
          <h3 className="text-[30px] font-[600] m">Your Way</h3>
          <p className="w-[1000px]">Stay ahead with smart course tracking, personalized schedules, and instant academic updates.
              All your university essentials—organized, accessible, and tailored for TMU students.
          </p>
          <button className="bg-primary w-[170px] text-secondary text-[9px] font-bold rounded-[10px] p-1"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >Toronto Metropolitan University</button>
          <div className="flex flex-row gap-4 mt-4">
              <button className="bg-primary text-white px-4 py-2 rounded">Browse Courses</button>
              <button className="bg-primary text-white px-4 py-2 rounded">Build Schedule</button>
          </div>
        </div>

        <div className="flex flex-row gap-10">
          <img src={tmuLogo.src} alt="TMU Logo" className="h-50 w-50" />
          <img src={tmuLogo.src} alt="TMU Logo" className="h-50 w-50" />
        </div>
       
       
      </div>
    </main>
  );
}
