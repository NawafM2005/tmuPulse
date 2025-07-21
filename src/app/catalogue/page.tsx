"use client"

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Course, columns } from "./columns";
import { DataTable } from "./data-table";
import { ProgramSelector } from "./program-selector";
import { supabase } from "@/lib/supabaseClient";
import Loading from "../loading";

// Define the Supabase Course type
type SupabaseCourse = {
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
  department_id: number;
}

// Define the Department type
type Department = {
  id: number;
  name: string;
}

export default function Catalogue() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments from Supabase
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');

        if (error) {
          console.error('Error fetching departments:', error);
          setDepartments([]);
        } else {
          setDepartments(data || []);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('courses')
          .select('*')
          .order('code');

        // Filter by selected departments if any are selected
        if (selectedDepartments.length > 0) {
          query = query.in('department_id', selectedDepartments);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching courses:', error);
          setCourses([]);
        } else {
          // Transform Supabase data to match our Course interface
          const transformedCourses: Course[] = (data || []).map((course: SupabaseCourse) => ({
            code: course.code,
            name: course.name,
            description: course.description,
            "weekly contact": course.weekly_contact,
            "gpa weight": course.gpa_weight,
            "billing unit": course.billing_unit,
            "course count": course.course_count,
            prerequisites: course.prerequisites,
            corequisites: course.corequisites,
            antirequisites: course.antirequisites,
            "custom requisites": course.custom_requisites,
          }));
          setCourses(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedDepartments]);

  const handleDepartmentToggle = (departmentId: number) => {
    setSelectedDepartments(prev => {
      if (prev.includes(departmentId)) {
        return prev.filter(id => id !== departmentId);
      } else {
        return [...prev, departmentId];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedDepartments([]);
  };

  if (loading && courses.length === 0) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-foreground pt-20">
      <Navbar/>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-white">Course Catalogue</h1>
        <ProgramSelector 
          programs={departments.map(dept => dept.name)} 
          selectedPrograms={departments
            .filter(dept => selectedDepartments.includes(dept.id))
            .map(dept => dept.name)
          }
          onProgramToggle={(programName: string) => {
            const department = departments.find(dept => dept.name === programName);
            if (department) {
              handleDepartmentToggle(department.id);
            }
          }}
          onClearSelection={handleClearSelection}
        />
        <DataTable columns={columns} data={courses} />
      </div>
    </main>
  );
}