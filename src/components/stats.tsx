import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { ChartPieLegend } from "./piechart";

interface StatsProps {
  totalCourses: number;
  courseCodes: string[];
  program: string;
  cgpa: number;
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
};

export default function Stats({ totalCourses, courseCodes, program, cgpa }: StatsProps) {
  const [courseTypeMap, setCourseTypeMap] = useState<Record<string, string>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);

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

        const typeMap = Object.fromEntries(
            courseData.map(c => [c.code, normalizeLiberal(c.liberal)])
        );

        setCourseTypeMap(typeMap)

        // Count types
        let lower = 0, upper = 0, other = 0;
        courseCodes.forEach(code => {
            const type = typeMap[code];
            if (type === "LL") lower++;
            else if (type === "UL") upper++;
            else other++;
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

        const stats: UserStats = {
            program,
            cumulative_gpa: cgpa,
            total_courses_done: totalCourses,
            lower_libs_done: lower,
            upper_libs_done: upper,
            other_done: other,
            total_courses_required: programData.total_courses,
            lower_libs_required: programData.total_lowerlib,
            upper_libs_required: programData.total_upperlib,
            other_required: programData.total_open + programData.total_core,
        };

        setUserStats(stats);
        };

        if (courseCodes.length > 0) {
        fetchAndComputeStats();
        }
    }, [courseCodes, program, totalCourses, cgpa]);

  return (
    <main className="flex flex-col items-center text-center">
      <div className="bg-black/20 p-6 rounded-xl text-white max-w-4xl w-full space-y-6">
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

        {userStats && (
            <ChartPieLegend
                lower={userStats.lower_libs_done}
                upper={userStats.upper_libs_done}
                other={userStats.other_done}
            />
        )}
      </div>
    </main>
  );
}
