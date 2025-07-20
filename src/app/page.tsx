import Navbar from "@/components/navbar";
import homeBanner from '@/assets/home-banner-transparent.png';
import logo from '@/assets/tmu-monkey-logo.png';
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import Link from 'next/link';
import degree from '@/assets/degree.png';
import schedule from '@/assets/schedule.png';
import transcript from '@/assets/transcript.png';
import courses from '@/assets/courses.png';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-foreground">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-30">
        <div className="text-white flex flex-col gap-4 p-10 items-center justify-center">
          <h1 className="text-[70px] font-[800]">Welcome to Your <span className="text-accent">T</span><span className="text-secondary">M</span><span className="text-primary">U</span> Dashboard</h1>
          <h3 className="text-[30px] font-[600]">Shape Your Semester,</h3>
          <h3 className="text-[30px] font-[600] text-red-400">Your Way</h3>
          <p className="w-[1000px]">Stay ahead with smart course tracking, personalized schedules, and instant academic updates.
              All your university essentials—organized, accessible, and tailored for TMU students.
          </p>
          <button className="bg-primary w-[170px] text-secondary text-[9px] font-bold rounded-[10px] p-1"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >Toronto Metropolitan University</button>
          <div className="flex flex-row gap-10 mt-4">
            <Link href="/catalogue">
              <button className="bg-primary text-black font-bold text-[15px] bg-secondary px-2 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-200 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Browse Courses</button>
            </Link>

            <Link href="/schedule">
              <button className="bg-primary text-white font-bold text-[15px] bg-accent px-2 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-100 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Build Schedule</button>
            </Link>
          </div>
        </div>

        <div className="flex flex-row gap-10 mt-10">
          <img src={homeBanner.src} alt="Home Banner" className="h-80 w-220" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-30">
        <h1 className="text-[55px] font-[600] text-white">Unlock Your Academic Toolbox</h1>
        <h3 className="text-[15px] text-white mt-5">All the Tools You Need to Conquer TMU, All in One Place</h3>

        <div className="flex flex-wrap gap-8 justify-center mt-10 mb-20">
          <Link href="/catalogue" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer 
          hover:opacity-90 transition-all duration-100 hover:bg-black hover:scale-105 hover:border-1 border-white" 
          style={{
                  backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.87)), url(${courses.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <h2 className="font-bold text-lg mb-2">Course Catalogue</h2>
            <p className="text-sm text-center">
              Browse all TMU courses, prerequisites, and detailed descriptions in one organized place.
            </p>
          </Link>
          <Link href="/planner" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-200 hover:bg-black hover:scale-105 hover:border-1 border-white"
           style={{
                  backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.87)), url(${degree.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <h2 className="font-bold text-lg mb-2">Degree Planner</h2>
            <p className="text-sm text-center">
              Map out your degree requirements and track your academic progress per semester.
            </p>
          </Link>
          <Link href="/schedule" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-300 hover:bg-black hover:scale-105 hover:border-1 border-white"
           style={{
                  backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.87)), url(${schedule.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <h2 className="font-bold text-lg mb-2">Schedule Builder</h2>
            <p className="text-sm text-center">
              Create your ideal timetable by mixing and matching courses to avoid conflicts and optimize your week.
            </p>
          </Link>
          <Link href="/transcript" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-300 hover:bg-black hover:scale-105 hover:border-1 border-white"
           style={{
                  backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.95), rgba(18, 18, 18, 0.87)), url(${transcript.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <h2 className="font-bold text-lg mb-2">Transcript Parser</h2>
            <p className="text-sm text-center">
              Upload your transcript to automatically extract completed courses and update your planner.
            </p>
          </Link>
        </div>
      </div>


      <h1 className="text-[55px] font-[600] text-white">Trusted by Students Across TMU...</h1>

      <div className="flex flex-row gap-4 mb-10 mt-5">
        <div className="bg-white rounded-2xl p-6 shadow flex-1 max-w-[700px]">
          <div className="flex items-center gap-2 mt-4">
            <img
              src={logo.src}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Anna Liu"
            />
            <div>
              <span className="block font-semibold">Anna Liu</span>
              <span className="block text-sm text-gray-500">Business Technology Management, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
           <p className="italic text-gray-700 mt-5">
            "This platform helped me streamline my group projects and manage my schedule more effectively. The interface is intuitive and makes collaboration so much easier."
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex-1 max-w-[700px]">

          <div className="flex items-center gap-2 mt-4">
            <img
              src={logo.src}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Omar Hassan"
            />
            <div>
              <span className="block font-semibold">Omar Hassan</span>
              <span className="block text-sm text-gray-500">Economics, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
          <p className="italic text-gray-700 mt-5">
            "As a TMU student balancing academics and extracurriculars, this app has made it easy to keep everything organized. Highly recommend to anyone looking to boost their productivity."
          </p>
        </div>
      </div>

        <div>
          <FAQ/>
        </div>

      <Footer/>
    </main>
  );
}
