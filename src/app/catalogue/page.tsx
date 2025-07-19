import Navbar from "@/components/navbar";

export default function Catalogue() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-foreground">
      <Navbar/>

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-3xl mt-8 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary" >Course Catalogue</h1>
        <p className="text-[20px] font-[400] text-white">Browse all current courses at TMU. Search, filter, and discover classes by course code, department, or keyword.</p>
      </div>


    </main>
  );
}