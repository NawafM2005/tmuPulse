import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-white-200">
      <Navbar />
      <h1 className="text-5xl font-bold underline text-pink-600">
        Jungle loaded 🔥🐒
      </h1>
    </main>
  );
}
