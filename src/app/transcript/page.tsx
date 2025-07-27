"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import Footer from "@/components/footer";
import Stats from "@/components/stats";

interface Course {
  code: string;
  name: string;
  credits: number;
  grade: string;
  grade_points?: number;
}

interface Semester {
  term: string | null;
  cgpa: number | null;
  courses: Course[];
}

interface TranscriptData {
  program: string | null;
  semesters: Semester[];
  cumulative_gpa: number | null;
  transfer_courses?: Course[];
}

export default function Transcript() {
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }, []);

  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [text, setText] = useState("");
  const [json, setJson] = useState<TranscriptData | null>(null);

  async function parsePDF(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText;
  }

  function extractTranscriptData(rawText: string): TranscriptData {
    const programMatch = rawText.match(/Program:\s+(.*?)\s+\d{2}\/\d{2}\/\d{4}/);
    const program = programMatch ? programMatch[1] : null;

    const termRegex = /(Fall|Winter|Spring|Summer) \d{4}[\s\S]*?(?=(Fall|Winter|Spring|Summer) \d{4}|End of Transcript)/g;
    const terms = [];
    let termMatch;
    while ((termMatch = termRegex.exec(rawText)) !== null) {
      terms.push(termMatch);
    }

    const semesters = terms.map(term => {
      const termText = term[0];
      const termName = termText.match(/(Fall|Winter|Spring|Summer) \d{4}/)?.[0] || null;
      const termGpaMatch = termText.match(/Term GPA\s+(\d\.\d{3})/);
      const cgpa = termGpaMatch ? parseFloat(termGpaMatch[1]) : null;

      const courseRegex = /([A-Z]{3} \d{3})\s+(.+?)\s+(\d\.\d{3})\s+([A-Z+\-]+)\s+(\d\.\d{3})/g;
      const courseMatches = [];
      let courseMatch;
      while ((courseMatch = courseRegex.exec(termText)) !== null) {
        courseMatches.push(courseMatch);
      }

      const courses = courseMatches.map(match => ({
        code: match[1],
        name: match[2].trim(),
        credits: parseFloat(match[3]),
        grade: match[4],
        grade_points: parseFloat(match[5]),
      }));

      return {
        term: termName,
        cgpa,
        courses,
      };
    }).filter(sem => sem.cgpa !== null || sem.courses.length > 0);

    const cumulativeMatch = rawText.match(/Cum GPA:\s+(\d\.\d{3})/);
    const cumulative_gpa = cumulativeMatch ? parseFloat(cumulativeMatch[1]) : null;

    const transferCourses: Course[] = [];
    const transferBlockMatch = rawText.match(/Transfer Credits[\s\S]*?(?=Beginning of Undergraduate Record)/);
    if (transferBlockMatch) {
      const transferBlock = transferBlockMatch[0];
      // This regex looks for [course code] [course name] [credits] CRT [points]
      // Handles extra/multiple spaces
      const lineRegex = /([A-Z]{3}(?:\s+[A-Z]+)?(?:\s+\d{3})?(?:\s+\d)?)(?:\s+)([A-Za-z\-&\s]+?)\s+(\d\.\d{3})\s+CRT\s+(\d\.\d{3})/g;
      let match;
      while ((match = lineRegex.exec(transferBlock)) !== null) {
        transferCourses.push({
          code: match[1].replace(/\s+/g, " ").trim(), // Normalize spaces in code
          name: match[2].replace(/\s+/g, " ").trim(),
          credits: parseFloat(match[3]),
          grade: "CRT",
          grade_points: parseFloat(match[4])
        });
      }
    }

    const uniqueSemestersMap = new Map<string, Semester>();

    for (const semester of semesters) {
      if (!semester.term) continue;

      if (!uniqueSemestersMap.has(semester.term)) {
        // Deduplicate courses within the same semester by code
        const uniqueCoursesMap = new Map<string, Course>();
        for (const course of semester.courses) {
          if (!uniqueCoursesMap.has(course.code)) {
            uniqueCoursesMap.set(course.code, course);
          }
        }

        uniqueSemestersMap.set(semester.term, {
          ...semester,
          courses: Array.from(uniqueCoursesMap.values()),
        });
      }
    }

    const uniqueSemesters = Array.from(uniqueSemestersMap.values());

    return {
      program,
      semesters: uniqueSemesters,
      cumulative_gpa,
      transfer_courses: transferCourses
    };
  }

  const allCourses = [
    ...(json?.semesters.flatMap(s => s.courses) || []),
    ...(json?.transfer_courses || [])
  ];  
  const totalCourses = allCourses.length;
  const courseCodes = allCourses.map(c => c.code);

  return (
    <main className="min-h-screen bg-foreground pt-5 flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-30 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary">Transcript Parser</h1>
        <p className="text-[20px] font-[400] text-white">
          Effortlessly upload your academic transcript and let our parser automatically extract your courses, grades, and credits. Instantly see a clean summary, track your progress, and save time on manual entry—perfect for students who want all their academic info in one place!
        </p>
      </div>
      <form className="text-white flex flex-col items-center gap-4">
        <label
          htmlFor="transcript-upload"
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl cursor-pointer hover:bg-yellow-400 transition border-2 border-white"
        >
          Choose Transcript File(s)
        </label>
        <input
          type="file"
          id="transcript-upload"
          name="transcript-upload"
          ref={inputRef}
          className="hidden"
          multiple
          accept="application/pdf"
          onChange={async (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              const fileNames = Array.from(files).map(file => file.name).join(", ");
              setFileName(fileNames);
              setFiles(files);

              let result = "";
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file) continue;
                const parsed = await parsePDF(file);
                result += `\n\nFile: ${file.name}\n` + parsed;
              }

              setText(result);
              setJson(extractTranscriptData(result));
            } else {
              setFileName("No file chosen.");
              setFiles(null);
              setText("");
              setJson(null);
            }
          }}></input>
        <span className="italic text-[16px]">{fileName}</span>
      </form>
      {json && (
        <div className="bg-black/30 text-white mt-10 rounded-xl p-6 max-w-4xl w-full space-y-6 mb-20">
          <h2 className="text-3xl font-bold flex flex-row gap-1">Program: <p className="text-secondary">{json.program}</p></h2>
          <h3 className="text-xl font-semibold flex flex-row gap-1">Cumulative GPA: <p className="text-yellow-500">{json.cumulative_gpa}</p></h3>
          {json.transfer_courses && json.transfer_courses.length > 0 && (
            <div className="bg-white/10 p-4 rounded-lg border-1 border-white">
              <h4 className="text-xl font-bold text-blue-300 mb-5">Transfer Credits</h4>
              <div className="grid grid-cols-2 gap-2">
                {json.transfer_courses.map((course, cIndex) => (
                  <div key={cIndex} className="bg-black/80 p-3 rounded border-1 border-secondary">
                    <p><strong>{course.code}</strong> – {course.name}</p>
                    <p>Grade: {course.grade} | Grade Points: {course.grade_points} | Credits: {course.credits}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-6 grid-cols-2 w-full">
            {json.semesters.map((semester, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg border-1 border-white">
                <h4 className="text-xl font-bold text-blue-300">{semester.term}</h4>
                <p className="text-md mb-2 font-semibold">Term GPA: {semester.cgpa ?? "N/A"}</p>
                <div className="grid gap-2">
                  {semester.courses.map((course, cIndex) => (
                    <div key={cIndex} className="bg-black/80 p-3 rounded border-1 border-secondary">
                      <p><strong>{course.code}</strong> – {course.name}</p>
                      <p>Grade: {course.grade} | Grade Points: {course.grade_points} | Credits: {course.credits}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {json && (
        <Stats totalCourses={totalCourses} courseCodes={courseCodes} program={json?.program || ""} cgpa={json?.cumulative_gpa || 0} allCourses={allCourses}/>
      )}
    </main>
  );
}
