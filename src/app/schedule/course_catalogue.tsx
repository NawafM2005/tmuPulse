"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, Info, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* NEW */
import { supabase } from "@/lib/supabaseClient";
import PopUp from "@/components/course-popup";
import type { Section } from "@/types/course"; // <- uses your existing Section type

/** ---- Minimal shape from your DB ---- */
export type CourseRow = {
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  liberal?: string | null;
  term?: string[] | null;
  /** NEW: include sections on the row so we can pass-through/fallback cleanly */
  sections?: Section[] | null;
};

type Props = {
  courses: CourseRow[];
  pageSize?: number;
  renderCourse?: (course: CourseRow) => React.ReactNode;
  onShowCourseInfo?: (course: CourseRow) => void;
  onAddCourse?: (course: CourseRow) => void;
};

const TYPE_LOWER = "Lower liberal";
const TYPE_UPPER = "Upper liberal";

/* ---------- Robust normalizers ---------- */
function normalizeLiberal(v?: string | null): "Lower liberal" | "Upper liberal" | "None" {
  if (!v) return "None";
  const s = v.toLowerCase().replace(/[\(\)\[\]]/g, "").replace(/\s+/g, " ").trim();
  const hasLower = /\blower\b/.test(s) || /\blower level\b/.test(s) || /\blower liberal\b/.test(s) || /\bll\b/.test(s);
  const hasUpper = /\bupper\b/.test(s) || /\bupper level\b/.test(s) || /\bupper liberal\b/.test(s) || /\bul\b/.test(s);
  if (hasLower && !hasUpper) return TYPE_LOWER;
  if (hasUpper && !hasLower) return TYPE_UPPER;
  return "None";
}
function normalizeTermValue(v?: string | null): "Fall" | "Winter" | null {
  if (!v) return null;
  const s = v.trim().toLowerCase();
  if (s.startsWith("fall")) return "Fall";
  if (s.startsWith("winter")) return "Winter";
  return null;
}

type NormCourse = CourseRow & {
  liberalNorm: "Lower liberal" | "Upper liberal" | "None";
  termNorm: ("Fall" | "Winter")[];
  hay: string;
};

function preprocessCourses(courses: CourseRow[]): NormCourse[] {
  return courses.map((c) => {
    const liberalNorm = normalizeLiberal(c.liberal);
    const termNorm = Array.isArray(c.term)
      ? (c.term.map((t) => normalizeTermValue(t)).filter(Boolean) as ("Fall" | "Winter")[])
      : [];
    const hay = `${c.code ?? ""} ${c.name ?? ""} ${c.description ?? ""}`.toLowerCase();
    // keep sections from the row
    return { ...c, liberalNorm, termNorm, hay };
  });
}

/* ---------- Planner-style mapping for filtering ---------- */
function liberalToCategory(v?: string | null): "lowerlib" | "upperlib" | "liberal" | "other" {
  const s = (v ?? "").toString().trim().toUpperCase();
  if (s === "LL" || s.includes("LOWER")) return "lowerlib";
  if (s === "UL" || s.includes("UPPER")) return "upperlib";
  if (s.includes("LIBERAL")) return "liberal";
  return "other";
}

export default function CourseCatalogue({
  courses,
  pageSize = 10,
  renderCourse,
  onShowCourseInfo,
  onAddCourse,
}: Props) {
  const [catalogueFilterTypes, setCatalogueFilterTypes] = useState<string[]>([]);
  const [catalogueFilterTerms, setCatalogueFilterTerms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupCourse, setPopupCourse] = useState<any>(null);
  const closePopup = () => {
    setShowPopup(false);
    setPopupCourse(null);
  };

  // Open info — delegates to parent if provided; otherwise fetch + local popup
  const openCourseInfo = async (course: CourseRow) => {
    if (onShowCourseInfo) {
      onShowCourseInfo(course);
      return;
    }
    try {
      // If sections is a JSONB column on "courses", this is enough:
      const { data, error } = await supabase
        .from("courses")
        .select("*") // or explicitly: select("code,name,description,liberal,term,weekly_contact,gpa_weight,billing_unit,course_count,prerequisites,corequisites,antirequisites,custom_requisites,sections")
        .eq("code", course.code)
        .single();

      // If sections live in a related table instead, swap the select() above for:
      // .select("code,name,description,liberal,term,weekly_contact,gpa_weight,billing_unit,course_count,prerequisites,corequisites,antirequisites,custom_requisites,sections:sections(*)")

      if (data && !error) {
        setPopupCourse({
          code: data.code,
          name: data.name,
          description: data.description || "No description available",
          liberal: data.liberal || "None",
          term: data.term || [],
          "weekly contact": data.weekly_contact || "N/A",
          "gpa weight": data.gpa_weight || "N/A",
          "billing unit": data.billing_unit || "N/A",
          "course count": data.course_count || "N/A",
          prerequisites: data.prerequisites || "None",
          corequisites: data.corequisites || "None",
          antirequisites: data.antirequisites || "None",
          custom_requisites: data.custom_requisites || "None",
          /** NEW: pass sections from DB (JSONB or joined) */
          sections: (data.sections as Section[] | null) || [],
        });
      } else {
        // Fallback to whatever we already have on the row (if present)
        setPopupCourse({
          code: course.code,
          name: course.name,
          description: course.description || "No description available",
          liberal: course.liberal ?? "None",
          term: course.term ?? [],
          "weekly contact": "N/A",
          "gpa weight": "N/A",
          "billing unit": "N/A",
          "course count": "N/A",
          prerequisites: "N/A",
          corequisites: "N/A",
          antirequisites: "N/A",
          custom_requisites: "N/A",
          /** NEW: fallback */
          sections: course.sections ?? [],
        });
      }
    } catch {
      setPopupCourse({
        code: course.code,
        name: course.name,
        description: course.description || "No description available",
        liberal: course.liberal ?? "None",
        term: course.term ?? [],
        "weekly contact": "N/A",
        "gpa weight": "N/A",
        "billing unit": "N/A",
        "course count": "N/A",
        prerequisites: "N/A",
        corequisites: "N/A",
        antirequisites: "N/A",
        custom_requisites: "N/A",
        sections: course.sections ?? [],
      });
    } finally {
      setShowPopup(true);
    }
  };

  const handleCatalogueTypeToggle = (type: string) =>
    setCatalogueFilterTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  const handleCatalogueTermToggle = (term: string) =>
    setCatalogueFilterTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  const handleClearCatalogueFilters = () => {
    setCatalogueFilterTypes([]);
    setCatalogueFilterTerms([]);
    setSearchQuery("");
  };

  // Precompute normalized dataset
  const normalized = useMemo(() => preprocessCourses(courses), [courses]);

  // Filter + search
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return normalized.filter((c) => {
      if (catalogueFilterTypes.length > 0) {
        const cat = liberalToCategory(c.liberal);
        const wantsLower = catalogueFilterTypes.includes(TYPE_LOWER);
        const wantsUpper = catalogueFilterTypes.includes(TYPE_UPPER);
        const matches =
          (wantsLower && cat === "lowerlib") ||
          (wantsUpper && cat === "upperlib");
        if (!matches) return false;
      }
      if (catalogueFilterTerms.length > 0) {
        const hasTerm = c.termNorm.some((t) => catalogueFilterTerms.includes(t));
        if (!hasTerm) return false;
      }
      if (q && !c.hay.includes(q)) return false;
      return true;
    });
  }, [normalized, catalogueFilterTypes, catalogueFilterTerms, searchQuery]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;
  const handlePreviousPage = () => canPreviousPage && setCurrentPage((p) => p - 1);
  const handleNextPage = () => canNextPage && setCurrentPage((p) => p + 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [catalogueFilterTypes, catalogueFilterTerms, searchQuery, courses]);

  const start = (currentPage - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(start, start + pageSize);

  return (
    <>
      <aside className="w-full lg:sticky lg:top-20 lg:self-start bg-card-bg border border-borders rounded-2xl shadow p-4 space-y-4 h-auto">
        <h3 className="text-primary font-extrabold text-base sm:text-lg text-center">Course Catalogue</h3>

        {/* Filters */}
        <section className="space-y-2">
            {/* Term */}
          <div className="flex items-center gap-2">
            <p className="text-foreground text-lg font-semibold">Term: Winter 2026</p>
          </div>
          {/* Type */}
          <div className="flex items-center gap-2">
            <p className="text-foreground text-xs font-semibold">Type:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCatalogueTypeToggle(TYPE_LOWER)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer
                  ${catalogueFilterTypes.includes(TYPE_LOWER)
                    ? "bg-blue-400 text-black border-blue-500"
                    : "bg-background text-foreground border-secondary hover:opacity-80"}`}
              >
                Lower
              </button>
              <button
                onClick={() => handleCatalogueTypeToggle(TYPE_UPPER)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer
                  ${catalogueFilterTypes.includes(TYPE_UPPER)
                    ? "bg-blue-400 text-black border-blue-500"
                    : "bg-background text-foreground border-secondary hover:opacity-80"}`}
              >
                Upper
              </button>
            </div>
          </div>

          {/* Active chips + Clear all */}
          {(catalogueFilterTypes.length > 0 || catalogueFilterTerms.length > 0) && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {catalogueFilterTypes.map((type) => (
                  <Badge
                    key={type}
                    className="bg-blue-400 text-black text-xs px-2 py-0.5 h-5 flex items-center gap-1 cursor-pointer"
                    onClick={() => handleCatalogueTypeToggle(type)}
                    title="Remove"
                  >
                    {type === TYPE_LOWER ? "Lower" : "Upper"}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
                {catalogueFilterTerms.map((term) => (
                  <Badge
                    key={term}
                    className="bg-blue-400 text-black text-xs px-2 py-0.5 h-5 flex items-center gap-1 cursor-pointer"
                    onClick={() => handleCatalogueTermToggle(term)}
                    title="Remove"
                  >
                    {term}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCatalogueFilters}
                className="text-xs h-7 px-2 cursor-pointer"
                title="Clear all filters"
              >
                Clear
              </Button>
            </div>
          )}
        </section>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-input-bg border border-input-border rounded-xl text-foreground placeholder:text-muted focus:border-input-focus text-sm"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-1 lg:max-h-96">
          <div className="space-y-2">
            {paginatedCourses.map((course: NormCourse) =>
              renderCourse ? (
                <div key={course.id}>{renderCourse(course)}</div>
              ) : (
                <div key={course.id} className="rounded-lg border border-borders bg-background p-3">
                  {/* Top row: code + actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold">{course.code}</div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Course Info"
                        aria-label={`Info for ${course.code}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openCourseInfo(course);
                        }}
                        className="p-1.5 rounded-md border border-borders hover:bg-card-hover transition cursor-pointer"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Add to plan"
                        aria-label={`Add ${course.code}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAddCourse?.(course);
                        }}
                        className="p-1.5 rounded-md border border-borders hover:bg-card-hover transition cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="text-xs text-foreground/70">{course.name}</div>

                  {/* Badges */}
                  <div className="mt-1 flex gap-2">
                    {course.liberalNorm !== "None" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {course.liberalNorm.startsWith("Lower") ? "Lower" : "Upper"}
                      </span>
                    )}
                    {course.termNorm.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}

            {filteredCourses.length === 0 && (
              <div className="text-center text-muted py-8">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="font-bold text-sm">No courses found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <div className="flex items-center justify-between border-t border-borders pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canPreviousPage}
              className="text-xs h-8 px-3 cursor-pointer"
            >
              Previous
            </Button>

            <p className="text-xs font-semibold text-foreground">
              {filteredCourses.length === 0 ? "0 / 0" : `${currentPage} / ${totalPages}`}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canNextPage}
              className="text-xs h-8 px-3 cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </aside>

      {/* Local popup (used only if onShowCourseInfo not supplied) */}
      <PopUp open={showPopup} course={popupCourse} onClose={closePopup} />
    </>
  );
}
