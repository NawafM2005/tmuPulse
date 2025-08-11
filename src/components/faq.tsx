'use client';

import { useState } from "react";

const faqs = [
	{
		q: "What can I do with TMU Pulse?",
		a: "TMU Pulse helps you plan your degree, browse the course catalogue, track your academic progress with detailed analytics, calculate your GPA, and visualize your academic journey with interactive charts.",
	},
	{
		q: "How does the Degree Planner work?",
		a: "Choose your program and stream, then drag and drop courses from the catalogue into semester slots. The planner shows core courses, electives, and liberal requirements. You can mark courses as completed and save your plan.",
	},
	{
		q: "What are the Academic Analytics?",
		a: "View detailed breakdowns of your progress including course type distribution, GPA by category, completion percentages, and term-by-term GPA trends with interactive charts and visualizations.",
	},
	{
		q: "How do I import my transcript?",
		a: "Upload your official TMU transcript PDF and our system will automatically extract your completed courses, grades, and calculate your GPA.",
	},
	{
		q: "Do I need to create an account?",
		a: "You can browse courses and explore features without an account, but creating one lets you save your degree plans and access your analytics from any device.",
	},
	{
		q: "What's the difference between streams?",
		a: "Streams are specialization tracks within your program (like Aircraft, Avionics, etc.). Each stream has different course requirements. Select your stream in the degree planner to see the specific courses you need.",
	},
	{
		q: "How accurate is the course information?",
		a: "All course data is scraped directly from TMU's official sources and updated regularly. This includes prerequisites, descriptions, terms offered, and liberal education classifications.",
	},
	{
		q: "Is TMU Pulse free?",
		a: "Yes! TMU Pulse is completely free for all TMU students. Built by students, for students.",
	},
];

export default function FAQ() {
	const [open, setOpen] = useState<number | null>(null);

	return (
		<div className="max-w-8xl mx-auto mb-10 mt-10 rounded-2xl bg-foreground p-6 shadow-lg">
			<h2 className="mb-10 text-center text-4xl font-[600] text-background">
				Frequently Asked Questions
			</h2>
			{faqs.map((item, i) => (
				<div
					key={i}
					className="mb-3 max-w-3xl rounded-xl bg-white shadow-sm"
				>
					<button
						className={`flex w-full items-center justify-between rounded-xl px-4 py-3 font-semibold text-left transition-colors duration-150
              focus:outline-none hover:cursor-pointer
              ${open === i ? "bg-yellow-200 text-black" : "bg-background text-black"}
            `}
						onClick={() => setOpen(open === i ? null : i)}
						aria-expanded={open === i}
						aria-controls={`faq-panel-${i}`}
					>
						<span
							className={
								open === i ? "text-black" : "text-foreground"
							}
						>
							{item.q}
						</span>
						<span className="ml-2 text-primary">
							{open === i ? "▲" : "▼"}
						</span>
					</button>
					<div
						id={`faq-panel-${i}`}
						className={`
              overflow-hidden rounded-b-xl bg-background px-6
              transition-all duration-300 ease-in-out
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
