import tmuLogo from '@/assets/tmu-monkey-logo.png';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" 
         style={{ backgroundColor: 'var(--background)' }}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0" 
           style={{ 
             background: `linear-gradient(135deg, 
               color-mix(in srgb, var(--primary) 5%, transparent) 0%, 
               transparent 50%, 
               color-mix(in srgb, var(--accent) 5%, transparent) 100%)`
           }}></div>
      
      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with modern styling */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse" 
               style={{ 
                 background: `linear-gradient(45deg, var(--primary), var(--accent))`
               }}></div>
          <div className="relative rounded-full p-6 shadow-2xl border" 
               style={{ 
                 backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)',
                 backdropFilter: 'blur(10px)',
                 borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)'
               }}>
            <img 
              src={tmuLogo.src} 
              alt="TMU Planner Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 animate-bounce" 
            />
          </div>
        </div>
        
        {/* Loading text with modern typography */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: 'var(--foreground)' }}>
            TMU Planner
          </h2>
          <p className="font-medium text-sm sm:text-base animate-pulse"
             style={{ color: 'var(--muted)' }}>
            Loading your academic journey...
          </p>
        </div>
        
        {/* Modern loading spinner */}
        <div className="mt-8 relative">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" 
               style={{ 
                 borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
                 borderTopColor: 'var(--primary)'
               }}></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin animate-reverse delay-150" 
               style={{ 
                 borderRightColor: 'var(--accent)'
               }}></div>
        </div>
      </div>
    </div>
  );
}
