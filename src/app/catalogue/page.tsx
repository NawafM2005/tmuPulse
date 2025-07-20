"use client";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import logo from "@/assets/tmu-monkey-logo.png";
import { SimpleSelectScrollable } from "@/components/selectScrollable";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Catalogue() {
  const [departments, setDepartments] = useState<{value: string, label: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from('departments')         // Change to your actual table name!
        .select('id, name');         // Adjust fields as needed
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
      setLoading(false);
    };

    fetchDepartments();
  }, []);

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-foreground">
      <Navbar/>

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-3xl mt-8 gap-4 text-center">
        <h1 className="text-[70px] font-[800] text-secondary" >Course Catalogue</h1>
        <p className="text-[20px] font-[400] text-white">Browse all current courses at TMU. Search, filter, and discover classes by course code, department, or keyword.</p>
      </div>

      <div className="flex justify-center w-full max-w-3xl mt-8">
        <div className="relative w-full">
          <img
            src={logo.src}
            alt="TMU Logo"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 pointer-events-none"
          />
          <Input
            className="pl-12 text-secondary bg-black/20 w-full font-semibold"
            type="search"
            placeholder="Course Code, Title..."
          />
        </div>
      </div>

      <div className="flex flex-row gap-10 justify-left w-full max-w-3xl mt-8 text-center">
        <SimpleSelectScrollable
          className="bg-black/20 text-secondary font-semibold"
          options={departments}
          placeholder="Select a department"
        />
      </div>

    </main>
  );
}