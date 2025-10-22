import ThemeProvider from "./ThemeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TMU Pulse - Find TMU Courses, Professors & Lecture Times Instantly",
  description:
    "TMU Pulse lets students find courses, professors, and lecture times all in one compact platform. Browse the entire TMU course catalogue, check Rate My Professors reviews, and build your personalized schedule with the integrated Schedule Builder.",
  keywords: [
    "TMU Pulse",
    "Toronto Metropolitan University",
    "TMU course finder",
    "TMU professor reviews",
    "TMU class schedule",
    "Rate My Professors TMU",
    "TMU schedule builder",
    "TMU GPA calculator",
    "TMU degree planner"
  ],
  openGraph: {
    title: "TMU Pulse – Smarter Course & Schedule Planning for TMU Students",
    description:
      "TMU Pulse brings course discovery, professor reviews, and lecture scheduling into one streamlined dashboard. Search the full TMU course catalogue, view Rate My Professors ratings, check open sections, and build conflict-free schedules directly in the app.",
    url: "https://tmupulse.ca",
    siteName: "TMU Pulse",
    images: [
      {
        url: "https://tmupulse.ca/preview.png",
        width: 1200,
        height: 630,
        alt: "TMU Pulse",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TMU Pulse - All Your TMU Courses and Schedule in One Place",
    description:
      "Search TMU courses, compare professors, view lecture times, and build your full schedule in one clean, easy-to-use platform.",
    images: ["https://tmupulse.ca/preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}
