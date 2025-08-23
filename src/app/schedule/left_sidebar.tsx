"use client";

import { BookOpen, FlaskConical, X } from "lucide-react";

export type CourseRow = {
  idx: number;
  id: number;
  code: string;
  name: string;
  description?: string;
  weekly_contact?: string;
  gpa_weight?: string;
  billing_unit?: string;
  course_count?: string;
  prerequisites?: string;
  corequisites?: string;
  antirequisites?: string;
  custom_requisites?: string;
  liberal?: string;
  department_id?: number;
  term?: string[];
  sections?: string | RawSection[];
  // 🎨 from parent (calendar color)
  color?: string;      // hex, e.g. "#CFE8FF"
  colorName?: string;  // e.g. "Sky"
  // selection state
  lecture?: string; // class_number of chosen lecture
  lab?: string;     // class_number of chosen lab
  selected?: boolean;
};

export type RawSection = {
  room: string;
  status: string;
  section: string;       // e.g. "061-LEC UGRD Reg" or "062-LAB UGRD Reg"
  days_times: string;
  instructor: string;
  class_number: string;  // unique
  meeting_dates: string;
};

/* ---------- Utilities ---------- */
function parseSections(sections?: string | RawSection[]): RawSection[] {
  if (!sections) return [];
  if (Array.isArray(sections)) return sections;
  try {
    const arr = JSON.parse(sections);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function dedupeSections(arr: RawSection[]): RawSection[] {
  const seen = new Map<string, RawSection>();
  for (const s of arr) {
    const key = s.class_number || `${s.section}|${s.days_times}|${s.room}`;
    if (!seen.has(key)) seen.set(key, s);
  }
  return Array.from(seen.values());
}
const isLecture = (s: RawSection) => /(?:^|\s)\d{3}\s*-\s*LEC\b/i.test(s.section) || /LEC\b/i.test(s.section);
const isLabOrTut = (s: RawSection) => /LAB|TUT/i.test(s.section);

// 3-digit section num from "061-LEC ..."
function secNum(sectionStr: string): number | null {
  const m = sectionStr?.trim().match(/^(\d{3})\s*-/);
  return m ? parseInt(m[1], 10) : null;
}

function optionLabel(s: RawSection) {
  const shortSec = s.section.split(" ")[0]; // "061-LEC"
  const instr = s.instructor?.split(",")[0] || s.instructor || "";
  return `${shortSec} • ${s.days_times} • ${s.room}${instr ? " • " + instr : ""}`;
}

function formatCredits(course_count?: string) {
  const n = Number(parseFloat(course_count || "0").toFixed(2));
  if (!n) return undefined;
  const isInt = Math.abs(n - Math.round(n)) < 1e-9;
  return isInt ? `${n} credit${n === 1 ? "" : "s"}` : `${n} credits`;
}

// hex -> rgba with alpha (for soft background tint)
function withAlpha(hex?: string, alpha = 0.35): string | undefined {
  if (!hex) return undefined;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return undefined;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** ---------- Props ---------- */
export type LeftSidebarProps = {
  courses: CourseRow[];
  onRemove?: (id: number) => void;
  onToggle?: (id: number, checked: boolean) => void;
  // value = class_number
  onChange?: (id: number, kind: "lecture" | "lab", value: string) => void;
};

export default function LeftSidebar({ courses, onRemove, onToggle, onChange }: LeftSidebarProps) {
  return (
  <aside className="w-full h-auto sticky top-[64px] overflow-y-auto bg-background border-r border-input-border p-4">
      {/* Header */}
      <header className="mb-3 flex items-center justify-between">
        <h1 className="text-md font-bold tracking-wide uppercase text-foreground">Course Cart</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-card-hover text-foreground border border-input-border">
          {courses.length} items
        </span>
      </header>

      {courses.length === 0 ? (
        <p className="text-sm text-foreground">No courses found.</p>
      ) : (
        <ul className="space-y-3">
          {courses.map((c) => {
            const raw = dedupeSections(parseSections(c.sections));

            const lectures = raw.filter(isLecture);
            const labs = raw.filter(isLabOrTut);

            // Build options (value = class_number)
            const lecOptions = lectures.map((s) => ({
              value: s.class_number,
              label: optionLabel(s),
              n: secNum(s.section),
            }));
            const labOptions = labs.map((s) => ({
              value: s.class_number,
              label: optionLabel(s),
              n: secNum(s.section),
            }));

            // Index by class_number for quick lookup
            const byClass = new Map<string, RawSection>(raw.map((s) => [s.class_number, s]));

            // Defaults (first available), but keep selects controlled using c.lecture/c.lab
            const defaultLec = lecOptions[0]?.value || "";
            const defaultLab = labOptions[0]?.value || "";

            // Current selected (from parent state) or defaults
            let lectureValue = c.lecture ?? defaultLec;
            let labValue = c.lab ?? defaultLab;

            // Auto-pair suggestions
            if (lectureValue && !labValue) {
              const lecSec = byClass.get(lectureValue);
              const n = lecSec ? secNum(lecSec.section) : null;
              if (n !== null) {
                const targetLabNum = n + 1;
                const match = labOptions.find((o) => o.n === targetLabNum);
                if (match) labValue = match.value;
              }
            } else if (!lectureValue && labValue) {
              const labSec = byClass.get(labValue);
              const n = labSec ? secNum(labSec.section) : null;
              if (n !== null) {
                const targetLecNum = n - 1;
                const match = lecOptions.find((o) => o.n === targetLecNum);
                if (match) lectureValue = match.value;
              }
            }

            const credits = formatCredits(c.course_count);

            // Pairing handlers
            const handleLectureChange = (newLectureClass: string) => {
              onChange?.(c.id, "lecture", newLectureClass);
              const lecSec = byClass.get(newLectureClass);
              const n = lecSec ? secNum(lecSec.section) : null;
              if (n !== null) {
                const targetLabNum = n + 1;
                const match = labOptions.find((o) => o.n === targetLabNum);
                if (match) onChange?.(c.id, "lab", match.value);
              }
            };

            const handleLabChange = (newLabClass: string) => {
              onChange?.(c.id, "lab", newLabClass);
              const labSec = byClass.get(newLabClass);
              const n = labSec ? secNum(labSec.section) : null;
              if (n !== null) {
                const targetLecNum = n - 1;
                const match = lecOptions.find((o) => o.n === targetLecNum);
                if (match) onChange?.(c.id, "lecture", match.value);
              }
            };

            // 🎨 Color styling: soft bg tint + top bar + border color
            const bgTint = withAlpha(c.color, 0.35);
            const borderColor = c.color || undefined;

            return (
              <li
                key={c.id}
                className="relative rounded-xl border bg-card-bg hover:bg-card-hover transition-colors"
                style={{
                  background: bgTint ?? undefined,
                  borderColor: borderColor ?? undefined,
                }}
              >
                {/* top color bar */}
                {c.color && (
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 rounded-t-[10px]"
                    style={{ backgroundColor: c.color }}
                  />
                )}

                {/* Remove button */}
                <button
                  type="button"
                  aria-label={`Remove course ${c.code}`}
                  title="Remove"
                  className="absolute top-2 right-2 h-7 w-7 inline-flex items-center justify-center rounded-md border border-input-border bg-card-bg/70 hover:bg-card-bg active:scale-95 cursor-pointer"
                  onClick={() => onRemove?.(c.id)}
                >
                  <X className="h-4 w-4 text-foreground" />
                </button>

                <div className="p-3 pt-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`chk-${c.id}`}
                      className="mt-1 h-4 w-4 rounded border-input-border accent-primary focus:ring-2 focus:ring-primary"
                      defaultChecked
                      onChange={(e) => onToggle?.(c.id, e.target.checked)}
                    />
                    <div className="w-full">
                      <label htmlFor={`chk-${c.id}`} className="block cursor-pointer">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* color dot + name */}
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-foreground"
                              style={{
                                backgroundColor: c.color || "var(--card-bg)",
                                borderColor: "color-mix(in oklab, var(--foreground) 10%, transparent)",
                              }}
                              title={c.colorName || "Color"}
                            />
                            {c.colorName && (
                              <span className="text-[10px] uppercase tracking-wide text-foreground">
                                {c.colorName}
                              </span>
                            )}
                            <span className="text-sm font-semibold text-foreground">{c.code}</span>
                            <span className="text-sm text-foreground">{c.name}</span>
                          </div>
                          {credits && (
                            <div className="text-xs">
                              <span className="rounded-full bg-card-bg/70 text-foreground px-2 py-0.5 border border-input-border">
                                {credits}
                              </span>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Dropdowns (controlled + auto-pair) */}
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        {/* Lecture */}
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`lec-${c.id}`}
                            className="text-xs font-medium text-foreground inline-flex items-center gap-1"
                          >
                            <BookOpen className="h-4 w-4 text-foreground" />
                            Lecture
                          </label>
                          <select
                            id={`lec-${c.id}`}
                            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            value={lectureValue}
                            onChange={(e) => handleLectureChange(e.target.value)}
                            disabled={lecOptions.length === 0}
                          >
                            {lecOptions.length === 0 ? (
                              <option value="">— None available —</option>
                            ) : (
                              lecOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        {/* Lab / Tutorial */}
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`lab-${c.id}`}
                            className="text-xs font-medium text-foreground inline-flex items-center gap-1"
                          >
                            <FlaskConical className="h-4 w-4 text-foreground" />
                            Lab / Tutorial
                          </label>
                          <select
                            id={`lab-${c.id}`}
                            className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            value={labValue}
                            onChange={(e) => handleLabChange(e.target.value)}
                            disabled={labOptions.length === 0}
                          >
                            {labOptions.length === 0 ? (
                              <option value="">— None required —</option>
                            ) : (
                              labOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
