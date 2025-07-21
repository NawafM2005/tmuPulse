'use client';

import { useState } from "react";

const faqs = [
  {
    q: "Is TMU Planner free to use?",
    a: "Yes! TMU Planner is completely free for all TMU students.",
  },
  {
    q: "Is my data safe?",
    a: "We respect your privacy—your data is encrypted and never shared with third parties.",
  },
  {
    q: "How do I import my transcript?",
    a: "You can upload your official transcript file and TMU Planner will automatically parse your completed courses.",
  },
  {
    q: "Who built TMU Planner?",
    a: "TMU Planner was built by TMU students, for TMU students, to make planning university life simple and stress-free.",
  },
  {
    q: "Do I need to create an account?",
    a: "Nope! You can use TMU Planner without creating an account. Just start planning your courses right away. BUT, creating an account allows you to save your plans and access them from any device.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-8xl mx-auto mb-10 mt-10 bg-foreground rounded-2xl shadow-lg">
      <h2 className="text-[55px] font-[600] text-white text-center mb-10">Frequently Asked Questions</h2>
      {faqs.map((item, i) => (
        <div key={i} className="mb-3 bg-white rounded-xl shadow-sm max-w-3xl">
          <button
            className={`font-semibold w-full text-left flex items-center justify-between px-4 py-3 rounded-xl
              focus:outline-none transition-colors duration-150
              ${open === i ? "bg-yellow-100 text-accent" : "text-gray-800"}
            `}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
          >
            <span>{item.q}</span>
            <span className="ml-2 text-primary">
              {open === i ? "▲" : "▼"}
            </span>
          </button>
          <div
            id={`faq-panel-${i}`}
            className={`
              px-6
              transition-all duration-300 ease-in-out overflow-hidden text-gray-700 font-semibold
              ${open === i ? "max-h-40 opacity-100 py-2" : "max-h-0 opacity-0 py-0"}
            `}
            style={{}}
          >
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}
