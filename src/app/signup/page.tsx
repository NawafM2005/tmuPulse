import Navbar from "@/components/navbar";
import { SignupForm } from "@/components/signup-form";

export default function Signup() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Navbar/>
      <SignupForm/>
    </main>
  );
}