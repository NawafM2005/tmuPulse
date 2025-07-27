import Navbar from "@/components/navbar";
import logo from '@/assets/tmu-monkey-logo.png';

export default function Schedule() {

  return (
    <main className="min-h-screen bg-foreground pt-5 flex flex-col items-center">
      <Navbar/>
      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-30 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary animate-pulse">Schedule Builder</h1>
        <p className="text-[20px] font-[400] text-white animate-pulse">
          Coming s00n...
        </p>
        <img src={logo.src} alt="TMU Logo" className="h-20 w-20 animate-bounce"/>
      </div>
    </main>
  );
}