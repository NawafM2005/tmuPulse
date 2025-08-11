'use client';

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Github, Linkedin, Mail, Heart, Code, Coffee } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 mt-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[900] text-foreground mb-6">
            About the <span className="text-accent">Creators</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-[600] text-foreground max-w-4xl mx-auto">
            Meet the passionate students who built this platform to help fellow students 
            navigate their academic journey with ease and style.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-card-bg rounded-2xl shadow-lg p-6 sm:p-8 mb-12 border-2 border-foreground">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 text-2xl sm:text-3xl">
              <span role="img" aria-label="rocket">🚀</span>
              <h2 className="font-[800] text-foreground">Our Story</h2>
              <span role="img" aria-label="books">📚</span>
            </div>
          </div>
          <p className="text-sm sm:text-base font-[600] text-foreground text-center max-w-3xl mx-auto leading-relaxed">
            As computer science students, we noticed that TMU students were struggling with outdated and 
            confusing interfaces for course planning and academic management. We wanted to give TMU students 
            a better, more clean and modern UI to search and manage their courses at TMU. What started as 
            a simple course planner evolved into a comprehensive academic toolkit that provides an intuitive 
            and enjoyable experience for navigating university life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card-bg rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-foreground hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-6">
              <Image
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-[900]"
                src="https://media.licdn.com/dms/image/v2/D4D03AQEZayxZqLHNrw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1715755598733?e=1757548800&v=beta&t=mYuOMR6y0rPh44liOh6Dk8UlUPLvBgN8rO7MuJF3S7Q"
                alt="Profile photo of Nawaf Mahmood"
                width={128}
                height={128}
                sizes="(min-width: 640px) 8rem, 6rem"
              />
              <h3 className="text-xl sm:text-2xl font-[900] text-foreground mb-2">Nawaf Mahmood</h3>
              <p className="text-sm sm:text-base font-[600] text-accent mb-4">Full-Stack Developer</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">B.S. Computer Science @ TMU — CGPA 4.0 (Expected June 2027)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">Node.js, Express, PostgreSQL, Web Scraping, REST APIs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">React, TypeScript, Next.js, Firebase, SwiftUI (iOS)</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm font-[600] text-muted mb-6 leading-relaxed">
              Engineered TMU Courses API — a public REST API serving structured data for 1,500+ courses across 100+ programs,
              powered by automated web scrapers and published as an NPM package. Mentored 120+ students as a STEM Robotics &
              Coding Coach, designing curriculum and improving average assessment scores by 30%. Passionate about clean APIs,
              scalable systems, and polished user experiences.
            </p>
            
            <div className="flex justify-center gap-4">
              <a href="https://github.com/NawafM2005" target="_blank" className="p-2 sm:p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors hover:cursor-pointer">
                <Github className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </a>
              <a href="https://www.linkedin.com/in/nawaf-m-08a9792a6/" target="_blank" className="p-2 sm:p-3 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors hover:cursor-pointer">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </a>
              <a href="mailto:nawaf.mahmood2005@gmail.com" target="_blank" className="p-2 sm:p-3 bg-foreground/10 hover:bg-foreground/20 rounded-full transition-colors hover:cursor-pointer">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </a>
            </div>
          </div>

          <div className="bg-card-bg rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-foreground hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-6">
              <Image
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-[900]"
                src="https://media.licdn.com/dms/image/v2/D5603AQFzyWqci0rZZg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1727276436094?e=1757548800&v=beta&t=I4jfg9DTw-asPOoqTD_DcTsMOSOMBeW4c90diP36INM"
                alt="Profile photo of Samuel Okwusiuno"
                width={128}
                height={128}
                sizes="(min-width: 640px) 8rem, 6rem"
              />
              <h3 className="text-xl sm:text-2xl font-[900] text-foreground mb-2">Samuel Okwusiuno</h3>
              <p className="text-sm sm:text-base font-[600] text-accent mb-4">Backend Developer & Data Engineer</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">Computer Science @ University of Guelph</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">Python, Database Design, API Development</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span className="text-sm sm:text-base font-[600] text-foreground">Data Analysis & System Architecture</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm font-[600] text-muted mb-6 leading-relaxed">
              Expert in backend systems and data processing. Specializes in building robust APIs and 
              efficient data pipelines that power seamless user experiences and reliable performance.
            </p>
            
            <div className="flex justify-center gap-4">
              <a href="https://github.com/samokw" target="_blank" className="p-2 sm:p-3 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors hover:cursor-pointer">
                <Github className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </a>
              <a href="https://www.linkedin.com/in/chibuzor-okwusiuno-24041b271/" target="_blank" className="p-2 sm:p-3 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors hover:cursor-pointer">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-card-bg rounded-2xl shadow-lg p-6 sm:p-8 mb-12 border-2 border-foreground">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h2 className="text-xl sm:text-2xl font-[800] text-foreground">Built With Modern Tech</h2>
              <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-7xl mx-auto">
            {[
              { name: "Next.js", color: "bg-primary/10 text-primary" },
              { name: "TypeScript", color: "bg-accent/10 text-accent" },
              { name: "Tailwind CSS", color: "bg-success/10 text-success" },
              { name: "Supabase", color: "bg-warning/10 text-warning" },
              { name: "React", color: "bg-primary/10 text-primary" },
              { name: "Python", color: "bg-accent/10 text-accent" }
            ].map((tech) => (
              <div
                key={tech.name}
                className={`${tech.color} px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-center font-[700] text-xs sm:text-sm hover:scale-105 transition-transform`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        {/* Fun Internship Section */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-[#f5d60b]/10 rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-primary text-center">
          <div className="mb-6">
            <div className="text-4xl sm:text-6xl mb-4">
              <span role="img" aria-label="pray">🙏</span>
              <span role="img" aria-label="briefcase">💼</span>
              <span role="img" aria-label="rocket">🚀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-[900] text-foreground mb-4">
              Help Us Land Internships!
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-[600] text-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
              We&apos;re two passionate Computer Science students actively seeking internship opportunities! 
              If you know of any openings or would like to connect, we&apos;d love to hear from you.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-card-bg rounded-xl p-4 sm:p-6 border-2 border-success">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-success mx-auto mb-3" />
              <h3 className="font-[800] text-foreground mb-2">What We&apos;re Looking For</h3>
              <p className="text-xs sm:text-sm font-[600] text-muted">
                Software Development, Web Development, Data Analysis, 
                UI/UX Design, or any tech-related opportunities!
              </p>
            </div>
            
            <div className="bg-card-bg rounded-xl p-4 sm:p-6 border-2 border-warning">
              <Code className="h-8 w-8 sm:h-10 sm:w-10 text-warning mx-auto mb-3" />
              <h3 className="font-[800] text-foreground mb-2">What We Bring</h3>
              <p className="text-xs sm:text-sm font-[600] text-muted">
                Fresh perspectives, strong technical skills, passion for learning, 
                and proven ability to build real-world applications!
              </p>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm font-[600] text-muted mt-6">
            <span role="img" aria-label="sparkles">✨</span> 
            Thank you for considering us! Every opportunity helps us grow as developers and contributors to the tech community.
            <span role="img" aria-label="sparkles">✨</span>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
