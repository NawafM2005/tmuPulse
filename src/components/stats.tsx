import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { ChartPieLegend } from "./piechart";
import LineChartGeneric from "./linechart";
import { toast } from "sonner";


interface Course {
  code: string;
  name: string;
  credits: number;
  grade: string;
  grade_points?: number;
}

interface StatsProps {
  totalCourses: number;
  courseCodes: string[];
  program: string;
  cgpa: number;
  allCourses: Course[];
  termGpas: { term: string; gpa: number }[];
}

export type UserStats = {
  program: string;
  cumulative_gpa: number | null;
  total_courses_done: number;
  lower_libs_done: number;
  upper_libs_done: number;
  other_done: number;
  total_courses_required: number;
  lower_libs_required: number;
  upper_libs_required: number;
  other_required: number;
  unknown: number
};

export default function Stats({ totalCourses, courseCodes, program, cgpa, allCourses, termGpas }: StatsProps) {
  const [courseTypeMap, setCourseTypeMap] = useState<Record<string, string>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gpaByType, setGpaByType] = useState<{ name: string; avgGpa: number }[]>([]);


  useEffect(() => {
    const fetchAndComputeStats = async () => {
        try {
            // Fetch course liberal types
            const { data: courseData, error: courseError } = await supabase
                .from("courses")
                .select("code, liberal")
                .in("code", courseCodes);

            if (courseError) {
                if (courseError.message?.includes("No API key found")) {
                    toast.error("Database connection error: API key missing");
                } else {
                    toast.error(`Error fetching course types: ${courseError.message}`);
                }
                return;
            }

            if (!courseData) {
                toast.error("No course data received");
                return;
            }

        const normalizeLiberal = (value: string | null) => {
            const val = (value ?? "").trim().toUpperCase();
            if (val === "LL") return "LL";
            if (val === "UL") return "UL";
            return "Core/Open";
        };

        const courseCodeSet = new Set(courseData.map(c => c.code));
        const typeMap: Record<string, string> = {};

        courseCodes.forEach(code => {
          if (courseCodeSet.has(code)) {
            const liberalType = courseData.find(c => c.code === code)?.liberal ?? null;
            typeMap[code] = normalizeLiberal(liberalType);
          } else {
            typeMap[code] = "Other";
          }
        });

        setCourseTypeMap(typeMap);

        // Count types
        let lower = 0, upper = 0, other = 0, core_open = 0;
        courseCodes.forEach(code => {
            const type = typeMap[code];
            if (type === "LL") lower++;
            else if (type === "UL") upper++;
            else if (type === "Other") other++;
            else core_open++;
        });

            // Fetch program requirements from JSON structure
            const { data: programData, error: programError } = await supabase
                .from("programs")
                .select("semesters")
                .ilike("program", program)
                .single();

            if (programError) {
                if (programError.message?.includes("No API key found")) {
                    toast.error("Database connection error: API key missing");
                } else {
                    toast.error(`Error fetching program data: ${programError.message}`);
                }
                return;
            }

            if (!programData || !programData.semesters) {
                toast.error("No program data received");
                return;
            }

            // Calculate program stats from JSON structure (similar to degree planner)
            let totalCoursesRequired = 0;
            let totalCore = 0;
            let totalOpen = 0;
            let totalLowerLib = 0;
            let totalUpperLib = 0;

            // Count requirements from all semesters
            programData.semesters.forEach((semester: any) => {
                semester.requirements?.forEach((req: any) => {
                    // Check if this is a stream requirement object
                    const streamKeys = Object.keys(req).filter(key => key.endsWith('_stream'));
                    if (streamKeys.length > 0) {
                        // For stream requirements, count as 1 for now (could be expanded to count actual stream requirements)
                        totalCoursesRequired++;
                        totalOpen++; // Stream requirements are typically electives
                    } else if ("code" in req && req.code) {
                        // Fixed course
                        totalCoursesRequired++;
                        totalCore++;
                    } else if ("table" in req && req.table) {
                        // Table requirement
                        totalCoursesRequired++;
                        totalCore++; // Tables are typically core requirements
                    } else if ("option" in req && Array.isArray(req.option)) {
                        // Option requirements
                        totalCoursesRequired++;
                        totalCore++; // Options are typically core requirements
                    } else if ("lowerlib" in req && req.lowerlib) {
                        // Lower Liberal
                        totalCoursesRequired++;
                        totalLowerLib++;
                    } else if ("upperlib" in req && req.upperlib) {
                        // Upper Liberal
                        totalCoursesRequired++;
                        totalUpperLib++;
                    } else if ("open" in req && req.open) {
                        // Open elective
                        totalCoursesRequired++;
                        totalOpen++;
                    } else {
                        // Fallback - count as open
                        totalCoursesRequired++;
                        totalOpen++;
                    }
                });
            });

        const gpaBuckets: Record<string, number[]> = {
          LL: [],
          UL: [],
          "Core/Open": [],
          Other: [],
        };

        allCourses.forEach(course => {
          const type = typeMap[course.code] || "Other";
          if (
            course.grade_points !== undefined &&
            !isNaN(course.grade_points) &&
            course.grade_points > 0
          ) {
            gpaBuckets[type].push(course.grade_points);
          }
        });

        const gpaByType = Object.entries(gpaBuckets).map(([name, values]) => ({
          name,
          avgGpa: values.length ? parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) : 0,
        }));

        setGpaByType(gpaByType)

        const stats: UserStats = {
            program,
            cumulative_gpa: cgpa,
            total_courses_done: totalCourses, // This is the user's actual completed courses count from props
            lower_libs_done: lower,
            upper_libs_done: upper,
            other_done: core_open,
            total_courses_required: totalCoursesRequired, // This is the program's total required courses from JSON
            lower_libs_required: totalLowerLib,
            upper_libs_required: totalUpperLib,
            other_required: totalOpen + totalCore,
            unknown: other
        };

        setUserStats(stats);
        } catch (error) {
            toast.error("An unexpected error occurred while fetching data");
        }
    };

    if (courseCodes.length > 0) {
        fetchAndComputeStats();
    }
}, [courseCodes, program, totalCourses, cgpa]);

    const termGpaChartData = termGpas.map(({ term, gpa }) => ({
      label: term,
      gpa,
    }));

  return (
    <main className="flex flex-col items-center px-8 md:px-16 lg:px-24 w-full max-w-6xl">
      <div className="bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-full space-y-8 mb-20">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-[900] text-foreground mb-2">Academic Analytics</h2>
          <p className="text-muted font-[600]">Comprehensive breakdown of your academic progress and performance</p>
        </div>

        {/* Progress Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center">
              <h3 className="text-sm font-[800] text-primary uppercase tracking-wide mb-2">Total Courses</h3>
              <p className="text-3xl font-[900] text-foreground">{userStats.total_courses_done}</p>
              <p className="text-sm text-muted font-[600]">of {userStats.total_courses_required} required</p>
            </div>
            
            <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-6 text-center">
              <h3 className="text-sm font-[800] text-accent uppercase tracking-wide mb-2">Lower Liberals</h3>
              <p className="text-3xl font-[900] text-foreground">{userStats.lower_libs_done}</p>
              <p className="text-sm text-muted font-[600]">of {userStats.lower_libs_required} required</p>
            </div>
            
            <div className="bg-success/10 border-2 border-success/30 rounded-lg p-6 text-center">
              <h3 className="text-sm font-[800] text-success uppercase tracking-wide mb-2">Upper Liberals</h3>
              <p className="text-3xl font-[900] text-foreground">{userStats.upper_libs_done}</p>
              <p className="text-sm text-muted font-[600]">of {userStats.upper_libs_required} required</p>
            </div>
            
            <div className="bg-[#f5d60b]/10 border-2 border-[#f5d60b]/30 rounded-lg p-6 text-center">
              <h3 className="text-sm font-[800] text-[#f5d60b] uppercase tracking-wide mb-2">Core/Open</h3>
              <p className="text-3xl font-[900] text-foreground">{userStats.other_done}</p>
              <p className="text-sm text-muted font-[600]">of {userStats.other_required} required</p>
            </div>
          </div>
        )}

        {/* GPA Display */}
        {userStats && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 rounded-lg p-8 text-center">
            <h3 className="text-xl font-[800] text-primary mb-4">Cumulative Grade Point Average</h3>
            <p className="text-6xl font-[900] text-foreground mb-2">{userStats.cumulative_gpa?.toFixed(2) ?? "N/A"}</p>
            <p className="text-muted font-[600]">out of 4.33 TMU scale</p>
          </div>
        )}

        {/* Charts Section */}
        <div className="hidden md:block bg-card-bg border border-input-border rounded-lg p-8 space-y-8">
          <h3 className="text-2xl font-[800] text-foreground text-center mb-6">Performance Analytics</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
            {userStats && (
              <div className="bg-black/30 border border-input-border rounded-lg p-6">
                <h4 className="text-lg font-[700] text-foreground mb-4 text-center">Course Breakdown</h4>
                <ChartPieLegend
                    mode="breakdown"  
                    lower={userStats.lower_libs_done}
                    upper={userStats.upper_libs_done}
                    other={userStats.unknown}
                    core_open={userStats.other_done}
                />
              </div>
            )}

            {userStats && (
              <div className="bg-black/30 border border-input-border rounded-lg p-6">
                <h4 className="text-lg font-[700] text-foreground mb-4 text-center">Degree Completion</h4>
                <ChartPieLegend
                    mode="completion"  
                    completed={userStats.total_courses_done}
                    total={userStats.total_courses_required}
                />
              </div>
            )}
          </div>

          <div className="bg-black/30 border border-input-border rounded-lg p-6">
            <h4 className="text-lg font-[700] text-foreground mb-4 text-center">GPA by Course Type</h4>
            <ChartPieLegend
              mode="gpa_by_type"
              gpaData={gpaByType}
            />
          </div>

          <div className="bg-black/30 border border-input-border rounded-lg p-6">
            <h4 className="text-lg font-[700] text-foreground mb-4 text-center">Academic Progress Over Time</h4>
            <div className="flex justify-center">
              <LineChartGeneric
                data={termGpaChartData}
                dataKeys={[{ key: "gpa", label: "Term GPA" }]}
                title="Term GPA Over Time"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
