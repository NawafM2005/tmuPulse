"use client";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import search from "@/assets/search.png";
import { SimpleSelectScrollable } from "@/components/selectScrollable";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Loading from "../loading";
import Footer from "@/components/footer";

export default function Catalogue() {
  const [departments, setDepartments] = useState<{value: string, label: string}[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const COURSES_PER_PAGE = 10;
  const startIdx = (page - 1) * COURSES_PER_PAGE;
  const endIdx = startIdx + COURSES_PER_PAGE;

  const filteredCourses = courses.filter(course => {
  const matchesDepartment =
    !selectedDepartment || course.department_id === Number(selectedDepartment);
  const matchesSearch =
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.name.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesDepartment && matchesSearch;
})
.sort((a, b) => a.code.localeCompare(b.code));


  const paginatedCourses = filteredCourses.slice(startIdx, endIdx);

  type Course = {
    id: number;
    code: string;
    name: string;
    description: string;
    weekly_contact: string;
    gpa_weight: string;
    billing_unit: string;
    course_count: string;
    prerequisites: string;
    corequisites: string;
    antirequisites: string;
    custom_requisites: string;
    liberal: string;
    department_id: number;
  };


  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      let { data, error } = await supabase
        .from('departments')
        .select('id, name');
      if (error) {
        console.error("Error Fetching Departments...", error);
        setDepartments([]);
      } else {
        setDepartments(
          (data ?? []).map((dept: {id: string, name: string}) => ({
            value: dept.id,
            label: dept.name.toUpperCase(),
          }))
        );
      }
      await sleep(250);
      setLoading(false);
    };

      fetchDepartments();
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from('courses')
        .select('*')
      if (error) {
        setCourses([]);
      } else {
        setCourses(data ?? []);
      }
      await sleep(250);
      setLoading(false);
    };
    fetchData();
  }, []);


  const resetSearch = () => {
    setSearchTerm("");
    if (departments.length > 0) setSelectedDepartment(undefined);
    else {
      const interval = setInterval(() => {
        if (departments.length > 0) {
          setSelectedDepartment(undefined);
          clearInterval(interval);
        }
      }, 50);
    }
    setPage(1);
  };



  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-foreground">
      {loading && <Loading/>}

      <Navbar/>

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-3xl mt-30 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary" >Course Catalogue</h1>
        <p className="text-[20px] font-[400] text-white">Browse all current courses at TMU. Search, filter, and discover classes by course code, department, or keyword.</p>
      </div>

      <div className="flex justify-center w-full max-w-3xl mt-8">
        <div className="relative w-full">
          <img
            src={search.src}
            alt="TMU Logo"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 pointer-events-none"
          />
          <Input
            className="pl-12 text-secondary bg-black/20 w-full font-semibold"
            type="search"
            placeholder="Course Code, Title..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-row gap-10 justify-between w-full max-w-3xl mt-4 text-center">
        {departments.length > 0 && (
        <SimpleSelectScrollable
          key={selectedDepartment ?? "empty"}
          className="bg-black/20 text-secondary font-semibold"
          options={departments}
          placeholder="Select a department"
          value={selectedDepartment}
          onChange={(option) => setSelectedDepartment(option?.value ?? undefined)}
        />

      )}
        <button className="text-red-400 font-semibold mr-2 hover:cursor-pointer hover:underline" onClick={() =>resetSearch()}>Reset</button>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-3xl mb-10 gap-4">
          <div className="flex flex-col items-center justify-center w-full max-w-3xl mb-10 gap-4">
            {paginatedCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col justify-left p-8 w-full max-w-3xl mt-8 gap-4 text-left bg-black/40 text-white rounded-lg shadow-lg border-4 border-secondary hover:cursor-pointer transition-all duration-300 ease-in-out hover:scale-101 text-[15px]"
              >
                <h1
                  className="font-bold text-[20px] text-white"
                  style={{ textShadow: "2px 2px 8px #000, 1px 1px 10px #6af3daff" }}
                >
                  {course.code} - {course.name}
                </h1>
                <p>{course.description}</p>

                <div className="flex flex-row gap-5">
                  <p>Lecture: {course.weekly_contact || "N/A"}</p>
                  <p>GPA Weight: {course.gpa_weight || "N/A"}</p>
                  <p>Billing Unit: {course.billing_unit || "N/A"}</p>
                  <p>Course Count: {course.course_count || "N/A"}</p>
                  <p>Liberal: {course.liberal || "N/A"}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <p>Prerequisites: {course.prerequisites || "None"}</p>
                  <p>Corequisites: {course.corequisites || "None"}</p>
                  <p>Antirequisites: {course.antirequisites || "None"}</p>
                  <p>Custom Requisites: {course.custom_requisites || "None"}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCourses.length > 10 && (
          <div className="flex flex-row gap-4 mt-6">
            <button
              className="px-4 py-2 bg-secondary text-black font-semibold rounded disabled:opacity-50 hover:cursor-pointer"
              onClick={() => {
                setPage(page - 1);
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-white font-bold self-center">
              Page {page} of {Math.ceil(filteredCourses.length / COURSES_PER_PAGE)}
            </span>
            <button
              className="px-4 py-2 bg-secondary text-black font-semibold rounded disabled:opacity-50 hover:cursor-pointer"
              onClick={() => {
                setPage(page + 1);
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
              disabled={endIdx >= filteredCourses.length}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer/>

    </main>
  );
}