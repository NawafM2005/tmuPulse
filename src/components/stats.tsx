import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { ChartPieLegend } from "./piechart";
import LineChartGeneric from "./linechart";


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
            .ilike("program", program)
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

        {/* Course Types */}
        <div className="bg-card-hover border border-input-border rounded-lg p-6">
          <h3 className="text-xl font-[800] text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Course Classification
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {courseCodes.map((code, i) => {
              const type = courseTypeMap[code];
              const colorClass = 
                type === "LL" ? "bg-accent/20 text-accent border-accent/30" :
                type === "UL" ? "bg-success/20 text-success border-success/30" :
                type === "Core/Open" ? "bg-primary/20 text-primary border-primary/30" :
                "bg-muted/20 text-muted border-muted/30";
              
              return (
                <span key={i} className={`${colorClass} px-3 py-2 rounded-lg text-sm font-[600] border-2`}>
                  {code} - {type}
                </span>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-card-bg border border-input-border rounded-lg p-8 space-y-8">
          <h3 className="text-2xl font-[800] text-foreground text-center mb-6">Performance Analytics</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
