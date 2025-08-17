import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Hash, User as UserIcon, CheckCircle2, XCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ProfPopUp from "@/components/prof-popup"

import type { Course } from "@/types/course";

type popup_types = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  course?: Course;
};

export type Professor = {
  rmf_id: string;
  legacy_id: number;
  first_name: string;
  last_name: string;
  department: string;
  avg_rating: string;
  num_ratings: number;
  would_take_again_percent: string;
  avg_difficulty: string;
};

type RawSection = {
  room?: string;
  status?: "Open" | "Closed" | string;
  section?: string;               // e.g. "011-LEC UGRD Reg"
  days_times?: string;            // e.g. "Mo 12:00PM - 3:00PM"
  instructor?: string;            // e.g. "Chan, Anthony"
  class_number?: string;          // e.g. "7550"
  meeting_dates?: string;         // e.g. "09/02/2025 - 12/01/2025"
};

type ParsedSection = RawSection & {
  day?: string;                   // Mo, Tu, We, Th, Fr, Sa, Su
  start?: string;                 // 12:00PM
  end?: string;                   // 3:00PM
  startMins?: number;             // minutes since 00:00 for sorting
  dayIndex?: number;              // 0..6
};

const DAY_ORDER: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };

function parseTimeToMinutes(t?: string): number {
  if (!t) return 24 * 60;
  // formats like "8:00AM" or "3:00PM"
  const m = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!m) return 24 * 60;
  const [_, hh, mm, ap] = m;
  let H = parseInt(hh, 10) % 12;
  if (ap.toUpperCase() === "PM") H += 12;
  return H * 60 + parseInt(mm, 10);
}

function splitDaysTimes(s?: string): { day?: string; start?: string; end?: string } {
  // "Mo 12:00PM - 3:00PM"
  if (!s) return {};
  const m = s.match(/^([A-Za-z]{2})\s+(\d{1,2}:\d{2}[AP]M)\s*-\s*(\d{1,2}:\d{2}[AP]M)$/);
  if (!m) return {};
  const [, day, start, end] = m;
  return { day, start, end };
}

function normalizeSections(sections: unknown): RawSection[] {
  try {
    if (Array.isArray(sections)) return sections as RawSection[];
    if (typeof sections === "string") return JSON.parse(sections) as RawSection[];
    return [];
  } catch {
    return [];
  }
}

function dedupeSections(list: RawSection[]): RawSection[] {
  const seen = new Set<string>();
  const out: RawSection[] = [];
  for (const s of list) {
    const key = JSON.stringify([
      s.room, s.status, s.section, s.days_times, s.instructor, s.class_number, s.meeting_dates
    ]);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(s);
    }
  }
  return out;
}

function enhanceSections(raw: RawSection[]): ParsedSection[] {
  return raw.map((r) => {
    const { day, start, end } = splitDaysTimes(r.days_times);
    return {
      ...r,
      day,
      start,
      end,
      startMins: parseTimeToMinutes(start),
      dayIndex: day ? DAY_ORDER[day] ?? 99 : 99,
    };
  }).sort((a, b) => {
    if ((a.dayIndex ?? 99) !== (b.dayIndex ?? 99)) return (a.dayIndex ?? 99) - (b.dayIndex ?? 99);
    return (a.startMins ?? 24 * 60) - (b.startMins ?? 24 * 60);
  });
}

function formatTermCommas(term?: string | string[]): string {
  if (Array.isArray(term) && term.length > 0) {
    return term.join(", ");
  }
  if (typeof term === "string" && term.length > 0) {
    return term;
  }
  return "N/A";
}

function formatLiberal(lib?: string): string {
  if (lib != "None") {
    return lib === "UL" ? "Upper" : "Lower";
  }
  return "Core";
}

export default function PopUp({ open, onClose, course }: popup_types) {
  const [profs, setProfs] = useState<Professor[]>([]);
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupRowData, setPopupRowData] = React.useState<any>(null);
  console.log("Popup data:", course);

  useEffect(() => {
    if (!course?.code) {
      setProfs([]);
      return;
    }
    const fetchProfs = async () => {
      try {
        const { data, error } = await supabase
          .from('professors')
          .select('*')
          .contains('courses_taught', [course.code])
          .order('avg_rating', { ascending: false });

        if (error) {
          console.error('Error fetching professors:', error);
          setProfs([]);
        } else {
          setProfs(data || []);
        }
      } catch (error) {
        console.error('Error fetching professors:', error);
        setProfs([]);
      }
    };

    fetchProfs();
  }, [course?.code]);

  useEffect(() => {
    if (!open) return;

    // lock scroll
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const prevOb = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.overscrollBehavior = 'contain';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.documentElement.style.overscrollBehavior = prevOb;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const sections: ParsedSection[] = useMemo(() => {
    const raw = normalizeSections(course?.sections);
    const cleaned = dedupeSections(raw);
    const enhanced = enhanceSections(cleaned);
    // Sort by class_number (numerically if possible)
    return enhanced.slice().sort((a, b) => {
      const aNum = parseInt(a.class_number || "");
      const bNum = parseInt(b.class_number || "");
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return (a.class_number || "").localeCompare(b.class_number || "");
    });
  }, [course?.sections]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.12 }}
            className="relative flex flex-col w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] bg-card-bg text-foreground rounded-2xl shadow-2xl border-2 border-borders overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-card-bg border-b border-borders p-4 sm:p-6 flex items-start justify-between">
              <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 hover:bg-card-hover rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-muted hover:text-foreground hover:cursor-pointer" />
                </button>
              </div>
              <div className="w-full text-center">
                <h1 className="font-[900] text-lg sm:text-xl md:text-2xl text-foreground leading-tight">
                  {course?.code}
                </h1>
                <h2 className="font-[600] text-sm sm:text-base md:text-lg text-muted mt-1">
                  {course?.name}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {course && (
                <>
                  {/* Description */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-3">Description</h3>
                    <p className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed">
                      {course.description || "No description available"}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Course Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Liberal:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {formatLiberal(course.liberal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Term:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {formatTermCommas(course.term)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Weekly Contact:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["weekly contact"] || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">GPA Weight:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["gpa weight"] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Billing Unit:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["billing unit"] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-input-border">
                          <span className="font-[600] text-xs sm:text-sm text-muted">Course Count:</span>
                          <span className="text-xs sm:text-sm text-foreground font-[600]">
                            {course["course count"] || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                    <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Requirements & Restrictions</h3>
                    <div className="space-y-4">
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-success mb-2">Prerequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.prerequisites || "None"}
                        </p>
                      </div>
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-primary mb-2">Corequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.corequisites || "None"}
                        </p>
                      </div>
                      <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                        <h4 className="font-[700] text-xs sm:text-sm text-danger mb-2">Antirequisites</h4>
                        <p className="text-xs sm:text-sm text-foreground">
                          {course.antirequisites || "None"}
                        </p>
                      </div>
                      {course["custom requisites"] && course["custom requisites"] !== "None" && (
                        <div className="bg-card-bg rounded-lg p-3 border border-input-border">
                          <h4 className="font-[700] text-xs sm:text-sm text-warning mb-2">Custom Requisites</h4>
                          <p className="text-xs sm:text-sm text-foreground">
                            {course["custom requisites"]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Professors */}
              <div>
                <h3 className="font-[800] text-sm sm:text-base text-foreground mb-4">Professors</h3>
                {profs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {profs.map((prof) => (
                      <div
                        key={prof.rmf_id}
                        className="bg-card-hover rounded-lg p-3 border border-input-border flex flex-col items-center text-center hover:cursor-pointer hover:shadow-md hover:scale-105 transition-all duration-200"
                        onClick={() => {
                          setShowPopup(true);
                          setPopupRowData(prof);
                        }}
                      >
                        <h4 className="font-[700] text-xs sm:text-sm text-foreground mb-1 truncate w-full">
                          {prof.first_name} {prof.last_name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-muted mb-1 truncate w-full">
                          {prof.department || "No dept"}
                        </p>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] sm:text-xs text-muted">Avg Rating</span>
                          <span className="text-[11px] sm:text-xs font-semibold text-foreground">
                            {isNaN(parseFloat(prof.avg_rating))
                              ? "N/A"
                              : parseFloat(prof.avg_rating).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <ProfPopUp open={showPopup} prof={popupRowData} onClose={() => setShowPopup(false)} />
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted">No professors available for this course</p>
                )}
              </div>

              {/* Class Times */}
              <div className="bg-card-hover rounded-xl p-4 border border-input-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-[800] text-sm sm:text-base text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Class Times
                  </h3>
                  <span className="text-[10px] sm:text-xs text-muted">
                    {sections.length} option{sections.length === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Mobile cards */}
                <div className="grid sm:hidden gap-3">
                  {sections.map((s, idx) => {
                    const isOpen = (s.status || "").toLowerCase() === "open";
                    return (
                      <div key={idx} className="rounded-lg border border-input-border bg-card-bg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {isOpen ? (
                              <CheckCircle2 className="h-2 w-2" />
                            ) : (
                              <XCircle className="h-2 w-2" />
                            )}
                            <span className={`text-sm font-semibold px-2 py-0.5 rounded-full border ${
                              isOpen
                                ? "border-emerald-500/40 text-emerald-500"
                                : "border-rose-500/40 text-rose-500"
                            }`}>
                              {s.status || "N/A"}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted">{s.section || "—"}</span>
                        </div>

                        <div className="mt-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">
                              {s.day || "—"} {s.start || "—"}-{s.end || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{s.room || "TBA"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span className="text-sm">{s.instructor || "TBA"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            <span className="text-sm">Class #{s.class_number || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm text-muted">{s.meeting_dates || "—"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop/tablet table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-muted border-b border-input-border">
                        <th className="text-left py-2 pr-3 font-semibold">Status</th>
                        <th className="text-left py-2 px-3 font-semibold">Day & Time</th>
                        <th className="text-left py-2 px-3 font-semibold">Room</th>
                        <th className="text-left py-2 px-3 font-semibold">Instructor</th>
                        <th className="text-left py-2 px-3 font-semibold">Section</th>
                        <th className="text-left py-2 px-3 font-semibold">Class #</th>
                        <th className="text-left py-2 pl-3 font-semibold">Dates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.map((s, idx) => {
                        const isOpen = (s.status || "").toLowerCase() === "open";
                        return (
                          <tr key={idx} className="border-b border-input-border/60">
                            <td className="py-2 pr-3">
                              <span className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full border ${
                                isOpen
                                  ? "border-emerald-500/40 text-emerald-500"
                                  : "border-rose-500/40 text-rose-500"
                              }`}>
                                {isOpen ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                {s.status || "N/A"}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-medium text-xs">
                              {s.day || "—"} {s.start || "—"}–{s.end || "—"}
                            </td>
                            <td className="py-2 px-3 text-[10px]">{s.room || "TBA"}</td>
                            <td className="py-2 px-3 text-[10px]">{s.instructor || "TBA"}</td>
                            <td className="py-2 px-3 text-[10px]">{s.section || "—"}</td>
                            <td className="py-2 px-3 text-[10px]">{s.class_number || "—"}</td>
                            <td className="py-2 pl-3 text-muted text-[9px]">{s.meeting_dates || "—"}</td>
                          </tr>
                        );
                      })}
                      {sections.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-muted">
                            No scheduled sections found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
