"use client";

import Navbar from "@/components/navbar";
import plus from "@/assets/plus.png";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProgramSelector } from "../catalogue/program-selector";

export default function Planner() {
  // Define the Program type
  type Program = {
    id: number;
    program: string;
    total_courses: number;
    total_lowerlib: number;
    total_upperlib: number;
    total_open: number;
    total_core: number;
    other: number;
    semesters: {
    semester: string;
    requirements: {
      code?: string;
      option?: string[];
      table?: string;
      lowerlib?: string;
      upperlib?: string;
      open?: string;
    }[];
    }[] | null;
  };

  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase.from("programs").select("*").order("program", { ascending: true });
        if (error) {
          console.error("Error fetching programs:", error);
          setPrograms([]);
        } else {
          setPrograms(data || []);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, []);

  const handleProgramSelect = (programName: string) => {
    const program = programs.find((p) => p.program === programName);
    if (program) {
      setSelectedProgram(program.id);
    }
  };

  const handleClearSelection = () => {
    setSelectedProgram(null);
  };

  const selectedProgramData = programs.find((p) => p.id === selectedProgram);

  return (
    <main className="min-h-screen bg-foreground pt-5 flex flex-col items-center">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-30 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary">Degree Planner</h1>
        <p className="text-[20px] font-[400] text-white">
          Take control of your academic journey. Use the degree planner to map out
          future semesters, organize required courses, and stay on track for
          graduation. Visualize your progress and plan what's next with clarity.
        </p>
      </div>

      <div className="flex flex-row gap-4 items-center justify-center w-full max-w-6xl mt-10 text-white">
        <p>Choose your Program:</p>
        <ProgramSelector
          programs={programs.map((prog) => prog.program)}
          selectedPrograms={
            selectedProgramData ? [selectedProgramData.program] : []
          }
          onProgramToggle={handleProgramSelect}
          onClearSelection={handleClearSelection}
        />
      </div>

      {/* Show semesters ONLY if program selected */}
      {selectedProgramData && (
        <div className="overflow-x-auto w-full max-w-6xl mt-10 space-y-8 mb-20">
          {selectedProgramData && (
            <div className="overflow-x-auto w-full max-w-6xl mt-10 space-y-8 mb-20">
              {(selectedProgramData.semesters ?? []).map((semester, i) => (
                <table
                  key={i}
                  className="table-auto border-collapse border border-white/30 w-full text-white"
                >
                  <thead className="bg-white/10">
                    <tr>
                      <th
                        colSpan={2}
                        className="border border-white/30 px-4 py-2 text-left text-xl"
                      >
                        {semester.semester}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.requirements?.map((req, j) => (
                      <tr key={j}>
                        <td className="border border-white/30 px-4 py-2 text-center font-semibold w-1/3">
                          {/* Requirement Label */}
                          {Object.keys(req)[0]}
                        </td>
                        <td className="border border-white/30 px-4 py-2 text-center">
                          {/* Requirement Value(s) */}
                          {(() => {
                            if (req.code) return req.code;
                            if (req.option) return req.option.join(" / ");
                            if (req.table) return req.table;
                            if (req.lowerlib) return "Lower Liberal";
                            if (req.upperlib) return "Upper Liberal";
                            if (req.open) return "Open Elective";
                            return "-";
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          )}

        </div>
      )}
    </main>
  );
}
