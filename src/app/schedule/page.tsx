import Navbar from "@/components/navbar";
import logo from '@/assets/tmu-monkey-logo.png';
import Image from 'next/image';

export default function Schedule() {

  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      <Navbar/>
      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-20 gap-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[800] text-secondary animate-pulse">Schedule Builder</h1>
        <p className="text-sm sm:text-base md:text-lg text-secondary max-w-4xl mx-auto">
          Plan your semester schedule with our interactive schedule builder
        </p>
        <p className="text-[20px] font-[400] text-foreground animate-pulse">
          Coming s00n...
        </p>
        <Image src={logo} alt="TMU Logo" width={80} height={80} className="h-20 w-20 animate-bounce"/>
      </div>
    </main>
  );
}