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
    <main className="flex flex-col min-h-screen items-center justify-center bg-background text-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-30 text-center">
        <div className="text-foreground flex flex-col gap-4 p-10 items-center justify-center p-3">
          <h1 className="text-7xl font-[800]">Welcome to Your <span className="text-accent">T</span><span className="text-[#f5d60b]">M</span><span className="text-primary">U</span> Dashboard</h1>
          <h3 className="text-3xl font-[600]">Shape Your Semester,</h3>
          <h3 className="text-3xl font-[600] text-red-400">Your Way</h3>
          <p className="max-w-5xl">Stay ahead with smart course tracking, personalized schedules, and instant academic updates.
              All your university essentials—organized, accessible, and tailored for TMU students.
          </p>
          <button className="bg-primary text-[#f5d60b] text-[9px] font-bold rounded-[10px] p-1"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >Toronto Metropolitan University</button>
          <div className="flex flex-row gap-10 mt-4">
            <Link href="/catalogue">
              <button className=" text-black font-bold text-[15px] bg-[#f5d60b] px-2 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-200 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Browse Courses</button>
            </Link>

            <Link href="/planner">
              <button className="bg-primary text-white font-bold text-[15px] bg-accent px-2 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-100 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Degree Planner</button>
            </Link>
          </div>
        </div>

        <div className="flex flex-row gap-10 mt-10 p-3">
          <img src={homeBanner.src} alt="Home Banner" className="h-2xl w-220" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-30 p-3">
        <h1 className="text-5xl font-[600] text-foreground">Unlock Your Academic Toolbox</h1>
        <h3 className="text-1xl text-foreground mt-5">All the Tools You Need to Conquer TMU, All in One Place</h3>

        <div className="flex flex-wrap gap-8 justify-center mt-10 mb-20">
          <Link href="/catalogue" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer 
          hover:opacity-90 transition-all duration-100 hover:bg-black hover:scale-105 hover:border-5 border-foreground relative"
          style={{
                  backgroundImage: `linear-gradient(rgba(31, 129, 133, 0.2), rgba(255, 0, 0, 0.87)), url(${courses.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <h2 className="font-bold text-xl mb-3 relative z-20 text-white drop-shadow-2xl" style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 1), 1px 1px 3px rgba(0, 0, 0, 0.8)" }}>Course Catalogue</h2>
            <p className="text-sm text-center relative z-20 text-white drop-shadow-xl font-medium" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1), 1px 1px 2px rgba(0, 0, 0, 0.9)" }}>
              Browse all TMU courses, prerequisites, and detailed descriptions in one organized place.
            </p>
          </Link>
          <Link href="/planner" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-200 hover:bg-black hover:scale-105 hover:border-5 border-foreground relative"
           style={{
                  backgroundImage: `linear-gradient(rgba(31, 129, 133, 0.2), rgba(255, 0, 0, 0.87)), url(${degree.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <h2 className="font-bold text-xl mb-3 relative z-20 text-white drop-shadow-2xl" style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 1), 1px 1px 3px rgba(0, 0, 0, 0.8)" }}>Degree Planner</h2>
            <p className="text-sm text-center relative z-20 text-white drop-shadow-xl font-medium" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1), 1px 1px 2px rgba(0, 0, 0, 0.9)" }}>
              Map out your degree requirements and track your academic progress per semester.
            </p>
          </Link>
          <Link href="/schedule" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-300 hover:bg-black hover:scale-105 hover:border-5 border-foreground relative"
           style={{
                  backgroundImage: `linear-gradient(rgba(31, 129, 133, 0.2), rgba(255, 0, 0, 0.87)), url(${schedule.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <h2 className="font-bold text-xl mb-3 relative z-20 text-white drop-shadow-2xl" style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 1), 1px 1px 3px rgba(0, 0, 0, 0.8)" }}>Schedule Builder</h2>
            <p className="text-sm text-center relative z-20 text-white drop-shadow-xl font-medium" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1), 1px 1px 2px rgba(0, 0, 0, 0.9)" }}>
              Create your ideal timetable by mixing and matching courses to avoid conflicts and optimize your week.
            </p>
          </Link>
          <Link href="/transcript" className="bg-black/30 rounded-lg shadow-md p-8 w-80 h-100 flex flex-col items-center justify-center text-white hover:cursor-pointer
           hover:opacity-90 transition-all duration-300 hover:bg-black hover:scale-105 hover:border-5 border-foreground relative"
           style={{
                  backgroundImage: `linear-gradient(rgba(31, 129, 133, 0.2), rgba(255, 0, 0, 0.87)), url(${transcript.src})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}>
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <h2 className="font-bold text-xl mb-3 text-white drop-shadow-2xl relative z-20" style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 1), 1px 1px 3px rgba(0, 0, 0, 0.8)" }}>Transcript Parser</h2>
            <p className="text-sm text-center text-white drop-shadow-xl font-medium relative z-20" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 1), 1px 1px 2px rgba(0, 0, 0, 0.9)" }}>
              Upload your transcript to automatically extract completed courses and update your planner.
            </p>
          </Link>
        </div>
      </div>


      <h1 className="text-3xl font-[600] text-foreground p-3">Trusted by Students Across TMU...</h1>

      <div className="flex flex-row flex-wrap gap-4 mb-10 mt-2 p-5">
        <div className="bg-white rounded-2xl p-6 shadow flex-1 max-w-[700px] border-2 border-foreground text-black text-left">
          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://media.licdn.com/dms/image/v2/D5635AQH9J59jI99__Q/profile-framedphoto-shrink_400_400/B56ZWIqYWKGQAg-/0/1741754566475?e=1755025200&v=beta&t=bbSNDQuPh_pRqXy7RNBqNiX823JHypxMTv0t3HK8xuw"
              className="w-10 h-10 rounded-full object-cover border"
              alt="Omar Hassan"
            />
            <div>
              <span className="block font-semibold">Sonal Perera</span>
              <span className="block text-sm text-gray-500">Business Technology Management, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
          <p className="italic text-gray-700 mt-5">
            "As a TMU student juggling classes, clubs, and campus life, this app has seriously helped me stay on track. It's made organizing my schedule way less stressful, and I actually feel more on top of my work now. Definitely recommend for any students who want to stop feeling lost and start getting things done!"
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex-1 max-w-[700px] border-2 border-foreground text-black text-left">
          <div className="flex items-center gap-2 mt-4">
            <img
              src={"https://media.licdn.com/dms/image/v2/D4D03AQFgXpfr1cAwhg/profile-displayphoto-shrink_400_400/B4DZaIdTwIH4Ao-/0/1746046107001?e=1757548800&v=beta&t=OT7RBgfCrpeCre9wH5v9sQXauydG7ccxjWegB3ZbYLQ"}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Omar Hassan"
            />
            <div>
              <span className="block font-semibold">Sahibjeet Sidhu</span>
              <span className="block text-sm text-gray-500">Computer Science, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
          <p className="italic text-gray-700 mt-5">
            "As a TMU student, I've always found it challenging to track my academic progress across different semesters. The transcript parser completely changed that for me. It automatically extracts my course details and GPA from my transcript and organizes them in a clear, easy-to-understand dashboard. This has made degree planning and keeping track of my graduation requirements so much simpler. I highly recommend it to anyone who wants a smarter, stress-free way to manage their academic journey."
          </p>
        </div>
      </div>

        <div className="p-6">
          <FAQ/>
        </div>

      <Footer/>
    </main>
  );
}
