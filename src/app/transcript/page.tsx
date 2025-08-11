"use client";
import React, { useRef, useState, useEffect } from "react";
import Navbar from "@/components/navbar";
// @ts-ignore: pdfjsLib types not fully compatible with current setup
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import _Footer from "@/components/footer";
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
    const programMatch = rawText.match(/Program\s+([A-Z\s&\-]+Major)/i);
    let program = programMatch?.[1] ?? null;
    program = program?.replace(/\s+Major$/i, "") ?? null;

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

  const termGpaChartData = json?.semesters
    .filter(sem => (sem.cgpa ?? 0) > 0) // Exclude semesters with 0 GPA
    .map(sem => ({
      term: sem.term ?? "Unknown",
      gpa: sem.cgpa ?? 0,
    })) || [];

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-8 w-full max-w-6xl mt-20 gap-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[900] text-foreground mb-4">
          <span className="text-accent">T</span><span className="text-[#f5d60b]">M</span><span className="text-primary">U</span> Transcript Analyser
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-[600] text-muted max-w-4xl leading-relaxed">
          Effortlessly upload your academic transcript and let our parser automatically extract your courses, grades, and credits. 
          Instantly see a clean summary, track your progress, and save time on manual entry—perfect for students who want all their academic info in one place!
        </p>
        
        {/* Upload Section */}
        <div className="bg-card-bg border-2 border-input-border rounded-xl shadow-lg p-8 w-full max-w-md mt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <label
              htmlFor="transcript-upload"
              className="bg-primary text-white font-[700] px-8 py-3 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 border-2 border-primary hover:scale-105 shadow-md"
            >
              Choose Transcript File
            </label>
            <input
              type="file"
              id="transcript-upload"
              name="transcript-upload"
              ref={inputRef}
              className="hidden"
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
              }}
            />
            {fileName && (
              <span className="text-sm text-muted font-[600] bg-highlight px-3 py-1 rounded-full">
                {fileName}
              </span>
            )}
          </div>
        </div>
      </div>
      {json && allCourses.length > 0 && (
        <div className="bg-card-bg border-2 border-input-border rounded-xl shadow-lg px-8 md:px-16 lg:px-24 py-8 max-w-6xl w-full space-y-8 mb-20">
          {/* Header Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6">
              <h2 className="text-xl font-[800] text-primary mb-2">Program</h2>
              <p className="text-2xl font-[700] text-foreground">{json.program}</p>
            </div>
            <div className="bg-[#f5d60b]/10 border-2 border-[#f5d60b]/30 rounded-lg p-6">
              <h2 className="text-xl font-[800] text-[#f5d60b] mb-2">Cumulative GPA</h2>
              <p className="text-2xl font-[700] text-foreground">{json.cumulative_gpa}</p>
            </div>
          </div>

          {/* Transfer Credits */}
          {json.transfer_courses && json.transfer_courses.length > 0 && (
            <div className="bg-success/10 border-2 border-success/30 rounded-lg p-6">
              <h4 className="text-xl font-[800] text-success mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transfer Credits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {json.transfer_courses.map((course, cIndex) => (
                  <div key={cIndex} className="bg-card-bg border border-input-border rounded-lg p-4">
                    <p className="font-[700] text-foreground text-lg">{course.code}</p>
                    <p className="text-muted font-[600] mb-2">{course.name}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="bg-success/20 text-success px-2 py-1 rounded font-[600]">
                        {course.grade}
                      </span>
                      <span className="text-muted font-[600]">
                        {course.grade_points} pts | {course.credits} credits
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semesters */}
          {json && allCourses.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-[800] text-foreground">Academic History</h3>
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {json.semesters
                  .filter(semester => (semester.cgpa ?? 0) > 0)
                  .map((semester, index) => (
                  <div key={index} className="bg-card-hover border-2 border-input-border rounded-lg p-6 hover:border-accent transition-colors duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-[800] text-accent">{semester.term}</h4>
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded-full font-[700] text-sm">
                        GPA: {semester.cgpa ?? "N/A"}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {semester.courses.map((course, cIndex) => (
                        <div key={cIndex} className="bg-card-bg border border-input-border rounded-lg p-4">
                          <p className="font-[700] text-foreground text-lg">{course.code}</p>
                          <p className="text-muted font-[600] mb-2">{course.name}</p>
                          <div className="flex gap-4 text-sm">
                            <span className={`px-2 py-1 rounded font-[600] ${
                              course.grade === 'A+' || course.grade === 'A' || course.grade === 'A-' 
                                ? 'bg-success/20 text-success'
                                : course.grade === 'B+' || course.grade === 'B' || course.grade === 'B-'
                                ? 'bg-primary/20 text-primary' 
                                : course.grade === 'C+' || course.grade === 'C' || course.grade === 'C-'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-danger/20 text-danger'
                            }`}>
                              {course.grade}
                            </span>
                            <span className="text-muted font-[600]">
                              {course.grade_points} pts | {course.credits} credits
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {json && allCourses.length > 0 && (
        <Stats totalCourses={totalCourses} 
        courseCodes={courseCodes} 
        program={json?.program || ""} 
        cgpa={json?.cumulative_gpa || 0} 
        allCourses={allCourses} 
        termGpas={termGpaChartData}/>
      )}

      {json !== null && allCourses.length === 0 && (
        <div className="bg-danger/10 border-2 border-danger/30 rounded-lg p-8 max-w-md w-full mx-auto mt-8 mb-20 text-center">
          <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-[800] text-danger">Invalid Transcript</h3>
          <p className="text-muted font-[600]">Please upload a valid TMU transcript PDF file.</p>
        </div>
      )}      
    </main>
  );
}
