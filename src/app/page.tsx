import Navbar from "@/components/navbar";
import logo from '@/assets/tmu-monkey-logo.png';
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import Link from 'next/link';
import degree from '@/assets/degree.png';
import schedule from '@/assets/schedule.png';
import transcriptmain from '@/assets/transcript-main.png';
import transcript from '@/assets/transcript.png';
import courses from '@/assets/courses.png';
import lineChart from '@/assets/line-chart.png';
import pieChart from '@/assets/pie-chart.png';
import progress from '@/assets/progress.png';
import catalogue from '@/assets/catalogue.png';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background text-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-30 text-center">
        <div className="text-foreground flex flex-col gap-4 p-10 items-center justify-center p-3">
          <h1 className="text-7xl font-[900]">Welcome to Your <span className="text-accent">T</span><span className="text-[#f5d60b]">M</span><span className="text-primary">U</span> Dashboard</h1>
          <div className="flex flex-col gap-8 mt-10 p-3">
            {/* Mobile: Single column with all images overlapping */}
            <div className="relative flex flex-col items-center justify-center w-full max-w-7xl md:hidden">
              <div className="flex flex-col items-center justify-center relative">
                {/* Line Chart */}
                <img 
                  src={lineChart.src} 
                  alt="Line Chart Screenshot" 
                  className="screenshot w-64 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform -rotate-2 hover:rotate-0 transition-transform duration-300 z-10"
                />
                
                {/* Pie Chart - overlapping */}
                <img 
                  src={pieChart.src} 
                  alt="Pie Chart Screenshot" 
                  className="screenshot w-64 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-20 -mt-12"
                />
                
                {/* Progress - center, highest z-index */}
                <img 
                  src={progress.src} 
                  alt="Progress Screenshot" 
                  className="screenshot w-72 h-auto rounded-lg shadow-xl border-4 border-gray-300 transform hover:scale-105 transition-transform duration-300 z-30 -mt-16"
                />
                
                {/* Transcript - overlapping */}
                <img 
                  src={transcriptmain.src} 
                  alt="Transcript Screenshot" 
                  className="screenshot w-64 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-20 -mt-12"
                />
                
                {/* Catalogue - bottom */}
                <img 
                  src={catalogue.src} 
                  alt="Catalogue Screenshot" 
                  className="screenshot w-64 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform rotate-1 hover:rotate-0 transition-transform duration-300 z-10 -mt-12"
                />
              </div>
            </div>

            {/* Desktop: 3 top, 2 bottom layout */}
            <div className="hidden md:flex flex-col gap-2">
              <div className="relative flex items-center justify-center w-full max-w-7xl">
                {/* Top row - 3 images */}
                <div className="flex items-center justify-center relative">
                  {/* Line Chart - left */}
                  <img 
                    src={lineChart.src} 
                    alt="Line Chart Screenshot" 
                    className="screenshot max-w-96 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform -rotate-2 hover:rotate-0 transition-transform duration-300 z-10"
                  />
                  
                  {/* Progress - center, highest z-index */}
                  <img 
                    src={progress.src} 
                    alt="Progress Screenshot" 
                    className="screenshot max-w-[28rem] h-auto rounded-lg shadow-xl border-4 border-gray-300 transform hover:scale-105 transition-transform duration-300 z-30 -ml-20"
                  />
                  
                  {/* Pie Chart - right */}
                  <img 
                    src={pieChart.src} 
                    alt="Pie Chart Screenshot" 
                    className="screenshot max-w-96 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-10 -ml-20"
                  />
                </div>
              </div>
              
              <div className="relative flex items-center justify-center w-full max-w-7xl -mt-8">
                {/* Bottom row - 2 images */}
                <div className="flex items-center justify-center relative">
                  {/* Transcript - left */}
                  <img 
                    src={transcriptmain.src} 
                    alt="Transcript Screenshot" 
                    className="max-w-96 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-20"
                  />
                  
                  {/* Catalogue - right */}
                  <img 
                    src={catalogue.src} 
                    alt="Catalogue Screenshot" 
                    className="max-w-96 h-auto rounded-lg shadow-lg border-4 border-gray-300 transform rotate-1 hover:rotate-0 transition-transform duration-300 z-20 -ml-24"
                  />
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-5xl font-[800] mt-20">Shape Your Semester</h3>
          <h3 className="text-3xl font-[800] text-red-400">Your Way</h3>
          <p className="max-w-5xl font-[600]">Stay ahead with smart course tracking, personalized schedules, and instant academic updates.
              All your university essentials—organized, accessible, and tailored for TMU students.
          </p>
          <button className="bg-primary text-[#f5d60b] text-[9px] font-[900] rounded-[10px] p-1"
          style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >Toronto Metropolitan University</button>
          <div className="flex flex-row gap-10 mt-4">
            <Link href="/catalogue">
              <button className=" text-black font-[800] text-[15px] bg-[#f5d60b] px-10 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-200 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Browse Courses</button>
            </Link>

            <Link href="/planner">
              <button className="bg-primary text-white font-[800] text-[15px] bg-accent px-10 py-2 rounded hover:cursor-pointer
               hover:opacity-90 transition-all duration-100 hover:scale-101 shadow-[0_2px_5px_0_rgba(255,225,225,0.5)]">Degree Planner</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-15 p-3">
        <h1 className="text-5xl font-[800] text-foreground">Unlock Your Academic Toolbox</h1>
        <h3 className="text-1xl font-[700] text-foreground mt-5">All the Tools You Need to Conquer TMU, All in One Place</h3>

        <div className="flex flex-col gap-8 justify-center mt-10 mb-20">
          {/* Top row - 3 tools */}
          <div className="flex flex-wrap gap-8 justify-center">
            <Link href="/catalogue" className="group bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-80 min-h-[200px] flex flex-col items-center justify-center text-center hover:cursor-pointer hover:border-primary hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="font-[800] text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">Course Catalogue</h2>
              <p className="text-sm text-muted font-[600] leading-relaxed">
                Browse all TMU courses, prerequisites, and detailed descriptions in one organized place.
              </p>
            </Link>
            
            <Link href="/planner" className="group bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-80 min-h-[200px] flex flex-col items-center justify-center text-center hover:cursor-pointer hover:border-accent hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all duration-300">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-[800] text-xl mb-3 text-foreground group-hover:text-accent transition-colors duration-300">Degree Planner</h2>
              <p className="text-sm text-muted font-[600] leading-relaxed">
                Map out your degree requirements and track your academic progress per semester.
              </p>
            </Link>
            
            <div className="group bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-80 min-h-[200px] flex flex-col items-center justify-center text-center opacity-60 cursor-not-allowed relative">
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-[800] text-xl mb-3 text-foreground">Schedule Builder</h2>
              <p className="text-sm text-muted font-[600] leading-relaxed">
                Create your ideal timetable by mixing and matching courses to avoid conflicts and optimize your week.
              </p>
              <span className="absolute top-4 right-4 text-xs bg-warning text-background px-2 py-1 rounded-full font-[700]">Coming Soon</span>
            </div>
          </div>
          
          {/* Bottom row - 2 tools */}
          <div className="flex flex-wrap gap-8 justify-center">
            <Link href="/transcript" className="group bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-80 min-h-[200px] flex flex-col items-center justify-center text-center hover:cursor-pointer hover:border-success hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-success/20 transition-all duration-300">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-[800] text-xl mb-3 text-foreground group-hover:text-success transition-colors duration-300">Transcript Parser</h2>
              <p className="text-sm text-muted font-[600] leading-relaxed">
                Upload your transcript to instantly get detailed stats about your courses—track completions, view GPA trends, and power up your degree planning all in one place!
              </p>
            </Link>
            
            <Link href="/gpa-calculator" className="group bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-80 min-h-[200px] flex flex-col items-center justify-center text-center hover:cursor-pointer hover:border-[#f5d60b] hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-[#f5d60b]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#f5d60b]/20 transition-all duration-300">
                <svg className="w-8 h-8 text-[#f5d60b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-[800] text-xl mb-3 text-foreground group-hover:text-[#f5d60b] transition-colors duration-300">GPA Calculator</h2>
              <p className="text-sm text-muted font-[600] leading-relaxed">
                Calculate your cumulative GPA using TMU's official 4.33 scale with detailed grade conversions.
              </p>
            </Link>
          </div>
        </div>
      </div>


      <h1 className="text-3xl font-[800] text-foreground p-3">Trusted by Students Across TMU...</h1>

      <div className="flex flex-row flex-wrap gap-4 mb-10 mt-2 p-5">
        <div className="bg-white rounded-2xl p-6 shadow flex-1 max-w-[700px] border-2 border-foreground text-black text-left">
          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://media.licdn.com/dms/image/v2/D5635AQH9J59jI99__Q/profile-framedphoto-shrink_400_400/B56ZWIqYWKGQAg-/0/1741754566475?e=1755025200&v=beta&t=bbSNDQuPh_pRqXy7RNBqNiX823JHypxMTv0t3HK8xuw"
              className="w-10 h-10 rounded-full object-cover border"
              alt="Omar Hassan"
            />
            <div>
              <span className="block font-[800]">Sonal Perera</span>
              <span className="block text-sm text-gray-500 font-[600]">Business Technology Management, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
          <p className="italic text-gray-700 mt-5 font-[600]">
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
              <span className="block font-[800]">Sahibjeet Sidhu</span>
              <span className="block text-sm text-gray-500 font-[600]">Computer Science, TMU</span>
            </div>
            <span className="ml-auto text-yellow-500 text-lg">★★★★★</span>
          </div>
          <p className="italic text-gray-700 mt-5 font-[600]">
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
