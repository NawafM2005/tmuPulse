"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function Feedback() {
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("feedback").insert([
      {
        name: name || "Anonymous",
        feedback: problem,
      },
    ]);

    if (error) {
      console.error("🚨 Error submitting feedback:", error);
      toast.error("Uh-oh! Something went wrongski. Try again?");
    } else {
      console.log("✅ Feedback submitted successfully!");
      toast.success("Thanks for your feedback!!!");
      setName("");
      setProblem("");
    }
    setSubmitting(false);
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-background">
      <Navbar/>
      <Toaster />
      <div className="flex flex-col items-center justify-center px-4 py-6 sm:p-8 w-full max-w-6xl gap-4 sm:gap-6 text-center mt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[800] text-secondary">Feedback</h1>
        <p className="text-sm sm:text-base md:text-lg text-secondary max-w-4xl mx-auto px-2">
          Help us improve TMU Pulse by sharing your feedback and suggestions
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-card-bg p-4 sm:p-6 rounded-xl border-2 border-foreground text-left space-y-4"
        >
          <div>
            <label className="block font-semibold mb-2 text-foreground text-sm">
              Name (optional):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous"
              className="w-full h-12 px-3 rounded-lg bg-foreground/10 border border-white/30 placeholder-text/50 text-base"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-foreground text-sm">
              Describe the problem / Suggest improvements:
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Tell us what's on your mind..."
              className="w-full p-3 rounded-lg bg-foreground/10 border border-white/30 placeholder-text/50 min-h-[160px] sm:min-h-[140px] resize-y text-base leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-secondary text-background font-bold py-3 px-4 rounded-lg hover:opacity-80 transition hover:cursor-pointer active:scale-[0.99] disabled:opacity-60 text-base"
          >
            {submitting ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </main>
  );
}
