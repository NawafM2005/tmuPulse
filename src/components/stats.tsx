import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { ChartPieLegend } from "./piechart";


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

export default function Stats({ totalCourses, courseCodes, program, cgpa, allCourses }: StatsProps) {
  const [courseTypeMap, setCourseTypeMap] = useState<Record<string, string>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gpaByType, setGpaByType] = useState<{ name: string; avgGpa: number }[]>([]);


  useEffect(() => {
    const fetchAndComputeStats = async () => {
        // Fetch course liberal types
        const { data: courseData, error: courseError } = await supabase
            .from("courses")
            .select("code, liberal")
            .in("code", courseCodes);

        if (courseError || !courseData) {
            console.error("Error fetching course types", courseError);
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

        // Fetch program requirements
        const { data: programData, error: programError } = await supabase
            .from("programs")
            .select("total_courses, total_lowerlib, total_upperlib, total_open, total_core")
            .eq("program", program)
            .single();

        if (programError || !programData) {
            console.error("Error fetching program data", programError);
            return;
        }

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
            total_courses_done: totalCourses,
            lower_libs_done: lower,
            upper_libs_done: upper,
            other_done: core_open,
            total_courses_required: programData.total_courses,
            lower_libs_required: programData.total_lowerlib,
            upper_libs_required: programData.total_upperlib,
            other_required: programData.total_open + programData.total_core,
            unknown: other
        };

        setUserStats(stats);
        };

        if (courseCodes.length > 0) {
        fetchAndComputeStats();
        }
    }, [courseCodes, program, totalCourses, cgpa]);

  return (
    <main className="flex flex-col items-center text-center">
      <div className="bg-black/20 p-6 rounded-xl text-white max-w-7xl w-full space-y-6 flex flex-col gap-2 mb-20">
        <h2 className="text-3xl font-bold tex-secondary">Transcript Stats</h2>

        {userStats && (
          <div className="space-y-2">
            <p>Total Courses: {userStats.total_courses_done} / {userStats.total_courses_required}</p>
            <p>Lower Libs: {userStats.lower_libs_done} / {userStats.lower_libs_required}</p>
            <p>Upper Libs: {userStats.upper_libs_done} / {userStats.upper_libs_required}</p>
            <p>Other (Core): {userStats.other_done} / {userStats.other_required}</p>
            <p>GPA: {userStats.cumulative_gpa?.toFixed(2) ?? "N/A"}</p>
          </div>
        )}

        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-2">Course Types:</h3>
          <div className="flex flex-wrap gap-2">
            {courseCodes.map((code, i) => (
              <span key={i} className="bg-white/10 px-3 py-1 rounded text-sm border border-white/20">
                {code} - {courseTypeMap[code]}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-20">
          {userStats && (
            <ChartPieLegend
                mode="breakdown"  
                lower={userStats.lower_libs_done}
                upper={userStats.upper_libs_done}
                other={userStats.unknown}
                core_open={userStats.other_done}
            />
          )}

          {userStats && (
            <ChartPieLegend
                mode="completion"  
                completed={userStats.total_courses_done}
                total={userStats.total_courses_required}
            />
          )}

          <ChartPieLegend
            mode="gpa_by_type"
            gpaData={gpaByType}
          />
        </div>
      </div>
    </main>
  );
}
