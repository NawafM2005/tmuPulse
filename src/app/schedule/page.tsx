// app/schedule/page.tsx
"use client";

import Navbar from "@/components/navbar";
import LeftSidebar, { CourseRow as LeftCourseRow } from "./left_sidebar";
import ScheduleCalendar from "./schedule";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useMemo, useState } from "react";
import CourseCatalogue, { CourseRow as CatalogueCourseRow } from "./course_catalogue";
import type { Section } from "@/types/course";
import Loading from "../loading";
import type { EventInput } from "@fullcalendar/core";

// ✅ Sonner toaster
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

/* ---------------------- Pretty colors per course ---------------------- */
const COURSE_COLORS: { name: string; hex: `#${string}` }[] = [
  { name: "Mint",       hex: "#BFF7D6" },
  { name: "Honey",      hex: "#FFE9A7" },
  { name: "Sky",        hex: "#CFE8FF" },
  { name: "Peach",      hex: "#FFD8C2" },
  { name: "Lavender",   hex: "#E5D4FF" },
  { name: "Lime",       hex: "#E5F7A8" },
  { name: "Aqua",       hex: "#C9F0FF" },
  { name: "Blush",      hex: "#FCD6E5" },
  { name: "Sand",       hex: "#F5E6C8" },
  { name: "Pear",       hex: "#DFF2BF" },
  { name: "Periwinkle", hex: "#D8E1FF" },
  { name: "Moss",       hex: "#DDEECC" },
];

/* ---------------------- Date/parse helpers (multi-slot aware) ---------------------- */
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const DAY_MAP: Record<string, number> = { su:0, mo:1, tu:2, we:3, th:4, fr:5, sa:6 };

function parseTime12hTo24h(s: string): { hh: number; mm: number } | null {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ampm = m[3].toUpperCase();
  if (ampm === "AM") { if (hh === 12) hh = 0; } else { if (hh !== 12) hh += 12; }
  return { hh, mm };
}
function parseDateMMDDYYYY(s: string): Date | null {
  const m = s.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, mm, dd, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(d.getTime()) ? null : d;
}
function parseDateRangePair(s: string): [Date | null, Date | null] {
  const m = s.trim().match(/^(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})$/);
  if (!m) return [null, null];
  return [parseDateMMDDYYYY(m[1]!), parseDateMMDDYYYY(m[2]!)];
}
function formatLocalISO(date: Date, hh: number, mm: number): string {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}T${pad(hh)}:${pad(mm)}:00`;
}
function addDays(d: Date, days: number) { const x = new Date(d.getTime()); x.setDate(x.getDate() + days); return x; }
function firstOnOrAfterWeekday(start: Date, weekday: number) {
  const diff = (weekday - start.getDay() + 7) % 7;
  return addDays(start, diff);
}

const splitPipes = (s?: string) => (s ?? "").split("|").map(x => x.trim()).filter(Boolean);
const pickForIndex = <T,>(arr: T[], i: number, fallback: T): T =>
  arr.length === 0 ? fallback : (i < arr.length ? arr[i] : arr[arr.length - 1]);

function parseDaysTimesSegment(seg: string): {
  days: number[];
  start?: { hh: number; mm: number };
  end?: { hh: number; mm: number };
} {
  const tokens = seg.trim().split(/\s+/);
  const timeIdx = tokens.findIndex((t) => /^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(t));
  if (timeIdx === -1 || timeIdx + 2 >= tokens.length) {
    const days = tokens
      .map((t) => DAY_MAP[t.toLowerCase() as keyof typeof DAY_MAP])
      .filter((n) => typeof n === "number") as number[];
    return { days };
  }
  const dayTokens = tokens.slice(0, timeIdx);
  const startStr = tokens[timeIdx];
  const endStr = tokens[timeIdx + 2];
  const days = dayTokens
    .map((t) => DAY_MAP[t.toLowerCase() as keyof typeof DAY_MAP])
    .filter((n) => typeof n === "number") as number[];
  return { days, start: parseTime12hTo24h(startStr) || undefined, end: parseTime12hTo24h(endStr) || undefined };
}

function parseAlignedSlots(sec: any) {
  const dtSlots = splitPipes(String(sec.days_times || ""));
  const roomSlots = splitPipes(String(sec.room || ""));
  const instrSlots = splitPipes(String(sec.instructor || ""));
  const dateSlots = splitPipes(String(sec.meeting_dates || ""));
  const count = Math.max(dtSlots.length, 1);
  return Array.from({ length: count }, (_, i) => {
    const dt = pickForIndex(dtSlots, i, dtSlots[0] ?? "");
    const room = pickForIndex(roomSlots, i, roomSlots[0] ?? "");
    const instr = pickForIndex(instrSlots, i, instrSlots[0] ?? "");
    const dateRangeStr = pickForIndex(dateSlots, i, dateSlots[0] ?? "");
    const [termStart, termEnd] = parseDateRangePair(dateRangeStr);
    const parsed = parseDaysTimesSegment(dt);
    return {
      days: parsed.days, start: parsed.start, end: parsed.end,
      room, instructor: instr, termStart, termEnd,
    };
  }).filter(s => s.days.length && s.start && s.end && s.termStart && s.termEnd);
}

function sectionToEvents(courseCode: string, sec: any): EventInput[] {
  const out: EventInput[] = [];
  const slots = parseAlignedSlots(sec);
  if (slots.length === 0) return out;
  slots.forEach((slot, idx) => {
    for (const wkday of slot.days) {
      let d = firstOnOrAfterWeekday(slot.termStart as Date, wkday);
      while (d.getTime() <= (slot.termEnd as Date).getTime()) {
        const startISO = formatLocalISO(d, slot.start!.hh, slot.start!.mm);
        const endISO   = formatLocalISO(d, slot.end!.hh, slot.end!.mm);
        out.push({
          id: `${courseCode}-${sec.class_number}-${idx}-${wkday}-${startISO}`,
          title: `${courseCode} — ${String(sec.section || "").split(" ")[0] ?? "Class"}`,
          start: startISO,
          end: endISO,
          extendedProps: {
            room: slot.room,
            instructor: slot.instructor,
            status: sec.status,
            class_number: sec.class_number,
            raw_section: sec.section,
            meeting_dates: String(sec.meeting_dates || ""),
            courseCode,
          },
        });
        d = addDays(d, 7);
      }
    }
  });
  return out;
}

/* ---------------------- Page ---------------------- */
export default function Schedule() {
  const [booting, setBooting] = useState(true);

  // DB rows for catalogue
  const [courses, setCourses] = useState<LeftCourseRow[]>([]);
  // LEFT sidebar (attach a color)
  const [selectedCourses, setSelectedCourses] = useState<(LeftCourseRow & { color?: string; colorName?: string })[]>([]);

  useEffect(() => { const t = setTimeout(() => setBooting(false), 1000); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .not("sections", "is", null)
        .order("code", { ascending: true });
      if (error) { console.error("Error fetching courses:", error); return; }
      setCourses((data ?? []) as unknown as LeftCourseRow[]);
    };
    fetchCourses();
  }, []);

  function normalizeSections(raw: unknown): Section[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as Section[];
    if (typeof raw === "string") {
      try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? (parsed as Section[]) : []; }
      catch { return []; }
    }
    return [];
  }

  const catalogueCourses: CatalogueCourseRow[] = useMemo(
    () =>
      (courses || []).map((c) => ({
        id: (c as any).id ?? (c as any).idx ?? (c as any).code,
        code: (c as any).code,
        name: (c as any).name,
        description: (c as any).description ?? null,
        liberal: (c as any).liberal ?? null,
        term: Array.isArray((c as any).term) ? (c as any).term : [],
        sections: normalizeSections((c as any).sections),
      })),
    [courses]
  );

  function toLeftCourse(c: CatalogueCourseRow): LeftCourseRow {
    return {
      id: (c as any).id ?? c.code,
      code: c.code,
      name: c.name,
      sections: normalizeSections((c as any).sections),
    } as LeftCourseRow;
  }

  function pickNextColor(used: Set<string>) {
    for (const col of COURSE_COLORS) if (!used.has(col.hex)) return col;
    const idx = used.size % COURSE_COLORS.length;
    return COURSE_COLORS[idx];
  }

  function handleAddCourse(c: CatalogueCourseRow) {
    setSelectedCourses((prev) => {
      const cid = (c as any).id ?? c.code;
      const exists = prev.some((p) => ((p as any).id ?? (p as any).code) === cid);
      if (exists) return prev;

      const used = new Set(prev.map((p) => p.color).filter(Boolean) as string[]);
      const col = pickNextColor(used);

      return [...prev, { ...toLeftCourse(c), color: col.hex, colorName: col.name }];
    });
  }

  // Build COLORED events from chosen lecture/lab (or first if not chosen)
  const calendarEvents: EventInput[] = useMemo(() => {
    const events: EventInput[] = [];
    for (const course of selectedCourses) {
      if ((course as any).selected === false) continue;
      const code = (course as any).code || "COURSE";
      const secs = normalizeSections((course as any).sections);
      const lectures = secs.filter((s) => /LEC/i.test(String(s.section)));
      const labsTuts = secs.filter((s) => /LAB|TUT/i.test(String(s.section)));

      const chosenLecture = (course as any).lecture || lectures[0]?.class_number || "";
      const chosenLab     = (course as any).lab     || labsTuts[0]?.class_number || "";

      const paint = (sec: any) => {
        const evs = sectionToEvents(code, sec).map((e) => ({
          ...e,
          backgroundColor: course.color || "#E5E7EB",
          borderColor: course.color || "#E5E7EB",
          textColor: "#111827",
        }));
        events.push(...evs);
      };

      if (chosenLecture) {
        const sec = lectures.find((s) => String(s.class_number) === String(chosenLecture));
        if (sec) paint(sec);
      }
      if (chosenLab) {
        const sec = labsTuts.find((s) => String(s.class_number) === String(chosenLab));
        if (sec) paint(sec);
      }
    }
    return events;
  }, [selectedCourses]);

  /* ---------------------- Overlap detector + sticky Sonner toast ---------------------- */
  type Timed = { ev: EventInput; start: Date; end: Date; dateKey: string; course?: string };
  const toDate = (val: string | Date) => (val instanceof Date ? val : new Date(val));

  function findOverlaps(evs: EventInput[]) {
    const byDay = new Map<string, Timed[]>();
    for (const ev of evs) {
      if (!ev.start || !ev.end) continue;
      const s = toDate(ev.start as any);
      const e = toDate(ev.end as any);
      const key = `${s.getFullYear()}-${pad(s.getMonth() + 1)}-${pad(s.getDate())}`;
      const t: Timed = { ev, start: s, end: e, dateKey: key, course: (ev.extendedProps as any)?.courseCode };
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(t);
    }

    const pairs: { a: Timed; b: Timed }[] = [];
    Array.from(byDay.values()).forEach((arr) => {
      arr.sort((x, y) => x.start.getTime() - y.start.getTime());
      let active: Timed | null = null;
      for (const cur of arr) {
        if (active && cur.start.getTime() < active.end.getTime()) {
          pairs.push({ a: active, b: cur });
          // extend window to the latest end to catch chains
          if (cur.end.getTime() > active.end.getTime()) active = cur;
        } else {
          active = cur;
        }
      }
    });
    return pairs;
  }

  const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const fmtDay  = (d: Date) => d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  useEffect(() => {
    const conflicts = findOverlaps(calendarEvents);
    if (conflicts.length > 0) {
      const { a, b } = conflicts[0];
      const msg =
        `Schedule overlap detected:\n` +
        `• ${(a.course || "")} ${a.ev.title ?? "Event A"} — ${fmtDay(a.start)} ${fmtTime(a.start)}–${fmtTime(a.end)}\n` +
        `• ${(b.course || "")} ${b.ev.title ?? "Event B"} — ${fmtDay(b.start)} ${fmtTime(b.start)}–${fmtTime(b.end)}\n` +
        (conflicts.length > 1 ? `(+ ${conflicts.length - 1} more)` : "");
      toast.error(msg, {
        id: "overlap",
        duration: Infinity,
        closeButton: true,
      });
    } else {
      toast.dismiss("overlap");
    }
  }, [calendarEvents]);

  if (booting) return <Loading />;

  return (
    <main className="min-h-screen bg-background pt-5 flex flex-col items-center">
      {/* Sonner host (keep once at app root or here) */}
      <Toaster position="bottom-right" richColors />

      <Navbar />

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-20 gap-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[800] text-foreground">
          Schedule Builder
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-secondary max-w-4xl mx-auto">
          Plan your semester schedule with our interactive schedule builder
        </p>
      </div>

      <div className="w-full p-5">
        {/* Planner UI only on xl+ */}
        <div className="hidden xl:flex flex-row gap-5">
          {/* Left Sidebar */}
          <div className="w-1/5">
            <LeftSidebar
              courses={selectedCourses as any}
              onRemove={(id) =>
                setSelectedCourses((prev) => prev.filter((c) => (c as any).id !== id))
              }
              onToggle={(id, chk) =>
                setSelectedCourses((prev) =>
                  prev.map((c) =>
                    (c as any).id === id ? ({ ...c, selected: chk } as any) : c
                  )
                )
              }
              onChange={(id, kind, value) =>
                setSelectedCourses((prev) =>
                  prev.map((c) =>
                    (c as any).id === id ? ({ ...c, [kind]: value } as any) : c
                  )
                )
              }
            />
          </div>

          {/* Calendar */}
          <div className="w-3/5">
            <ScheduleCalendar events={calendarEvents} />
          </div>

          {/* Catalogue */}
          <div className="w-1/5">
            <CourseCatalogue courses={catalogueCourses} onAddCourse={handleAddCourse} />
          </div>
        </div>

        {/* Show message below xl */}
        <div className="xl:hidden mt-6 bg-card-bg border-2 border-borders rounded-2xl shadow-lg p-6 text-center max-w-md mx-auto">
          <div className="mb-4 text-6xl">📱</div>
          <h2 className="text-primary font-bold text-xl mb-3">
            Screen Too Small
          </h2>
          <p className="text-foreground text-sm leading-relaxed mb-4">
            The Degree Planner requires a larger screen for the best experience. 
            Please use a tablet, laptop, or desktop computer to access the planner.
          </p>
          <div className="text-xs text-muted">
            Minimum screen width: 1280px (desktop size)
          </div>
        </div>
      </div>
    </main>
  );
}
