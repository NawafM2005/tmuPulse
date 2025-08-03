import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/navbar";

export default function Login() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Navbar/>
      <LoginForm/>
    </main>
  );
}