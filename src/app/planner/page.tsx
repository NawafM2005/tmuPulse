import Navbar from "@/components/navbar";
import DegreePlanner from "./DegreePlanner";

export default function Planner() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] mt-[72px] bg-black"> {/* Changed to min-h and added bg-black */}
        <DegreePlanner />
      </div>
    </div>
  );
}