import tmuLogo from '@/assets/tmu-monkey-logo.png';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with modern styling */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-6 border border-primary/20 shadow-2xl">
            <Image 
              src={tmuLogo} 
              alt="TMU Planner Logo" 
              width={80}
              height={80}
              className="h-16 w-16 sm:h-20 sm:w-20 animate-bounce" 
            />
          </div>
        </div>
        
        {/* Loading text with modern typography */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            TMU Planner
          </h2>
          <p className="text-muted font-medium text-sm sm:text-base animate-pulse">
            Loading your academic journey...
          </p>
        </div>
        
        {/* Modern loading spinner */}
        <div className="mt-8 relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-accent rounded-full animate-spin animate-reverse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
