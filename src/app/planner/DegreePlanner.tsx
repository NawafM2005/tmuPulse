"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import programsData from "../../../all_programs.json";
import ProgramSelector from "./ProgramSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GripVertical, X, Info } from "lucide-react";
import PopUp from "@/components/course-popup";

interface Course {
  id: string;
  code?: string;
  table?: string;
  option?: string[];
  open?: string;
  title?: string;
  credits?: number;
  term?: string[]; // Add term data
  category:
    | "core"
    | "elective"
    | "liberal"
    | "lowerlib"
    | "upperlib"
    | "table"
    | "open";
}

interface RequirementSlot {
  id: string;
  type: "code" | "table" | "option" | "open";
  requirement: any; // The original requirement from JSON
  course?: Course; // The course assigned to this slot
  acceptedCourses?: string[]; // For option type, list of acceptable courses
}

interface SemesterPlan {
  id: string;
  title: string;
  requirements: RequirementSlot[];
}

export default function DegreePlanner() {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(
    new Set()
  );
  const [semesterPlans, setSemesterPlans] = useState<SemesterPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string[]>([]);
  const [catalogueFilterTypes, setCatalogueFilterTypes] = useState<string[]>([]);
  const [catalogueFilterTerms, setCatalogueFilterTerms] = useState<string[]>([]);
  const [cataloguePagination, setCataloguePagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupCourse, setPopupCourse] = useState<any>(null);

  // Program data
  const selectedProgramData = useMemo(
    () => programsData.find((p) => p.program === selectedProgram),
    [selectedProgram]
  );

  const programOptions = useMemo(
    () => programsData.map((p) => p.program).sort(),
    []
  );

  // Fetch courses from Supabase (like catalogue)
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let query = supabase.from("courses").select("*").order("code");

        const typeMap = {
          "Lower liberal": "LL",
          "Upper liberal": "UL",
        };
        const supabaseTypes = selectedTypes.map(
          (t) => typeMap[t as keyof typeof typeMap]
        );
        if (supabaseTypes.length > 0) {
          query = query.in("liberal", supabaseTypes);
        }
        if (selectedTerm.length > 0) {
          query = query.overlaps("term", selectedTerm);
        }

        const { data, error } = await query;
        if (error) {
          setCourses([]);
        } else {
          // Transform to minimal Course type
          const transformedCourses: Course[] = (data || []).map(
            (course: any, idx: number) => {
              let category: Course["category"] = "core";
              if (course.liberal === "LL") category = "lowerlib";
              else if (course.liberal === "UL") category = "upperlib";
              else if (course.liberal) category = "liberal";
              return {
                id: `course-${idx}`,
                code: course.code,
                title: course.name,
                credits: course.billing_unit
                  ? Number(course.billing_unit)
                  : 3,
                term: course.term || [], // Include term data
                category,
              };
            }
          );
          setCourses(transformedCourses);
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedTypes, selectedTerm]);

  // Filtered courses based on search and catalogue filters
  const filteredCourses = useMemo(() => {
    let filtered = courses;
    
    // Apply search filter
    if (searchQuery) {
      const normalizedQuery = searchQuery.replace(/\s+/g, "").toLowerCase();
      filtered = filtered.filter((course) => {
        const normalizedCode = (course.code || "")
          .replace(/\s+/g, "")
          .toLowerCase();
        const normalizedTitle = (course.title || "").toLowerCase();
        return (
          normalizedCode.includes(normalizedQuery) ||
          normalizedTitle.includes(searchQuery.toLowerCase())
        );
      });
    }
    
    // Apply type filter (Lower/Upper liberal)
    if (catalogueFilterTypes.length > 0) {
      filtered = filtered.filter((course) => {
        if (catalogueFilterTypes.includes("Lower liberal") && course.category === "lowerlib") return true;
        if (catalogueFilterTypes.includes("Upper liberal") && course.category === "upperlib") return true;
        return false;
      });
    }
    
    // Apply term filter (Fall/Winter)
    if (catalogueFilterTerms.length > 0) {
      filtered = filtered.filter((course) => {
        return catalogueFilterTerms.some(term => course.term?.includes(term));
      });
    }
    
    return filtered;
  }, [courses, searchQuery, catalogueFilterTypes, catalogueFilterTerms]);

  // Paginated courses for display
  const paginatedCourses = useMemo(() => {
    const startIndex = cataloguePagination.pageIndex * cataloguePagination.pageSize;
    const endIndex = startIndex + cataloguePagination.pageSize;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, cataloguePagination]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredCourses.length / cataloguePagination.pageSize);
  const currentPage = cataloguePagination.pageIndex + 1;
  const canPreviousPage = cataloguePagination.pageIndex > 0;
  const canNextPage = cataloguePagination.pageIndex < totalPages - 1;

  // === 🦍 UPDATED LOGIC FOR SEMESTER REQUIREMENTS ===
  const handleProgramSelect = (programName: string) => {
    setSelectedProgram(programName);
    setCompletedCourses(new Set());

    const program = programsData.find((p) => p.program === programName);
    if (!program) return;

    const plans: SemesterPlan[] = program.semesters.map(
      (semester, semesterIndex) => {
        const requirements: RequirementSlot[] =
          semester.requirements?.map((req: any, reqIndex: number) => {
            const slotId = `semester-${semesterIndex}-req-${reqIndex}`;
            if ("code" in req && req.code) {
              // Fixed course - pre-populate it
              return {
                id: slotId,
                type: "code" as const,
                requirement: req,
                course: {
                  id: `${slotId}-course`,
                  code: req.code,
                  title: `Course ${req.code}`,
                  credits: 3,
                  category: "core",
                },
              };
            } else if ("table" in req && req.table) {
              // Table requirement
              return {
                id: slotId,
                type: "table" as const,
                requirement: req,
                course: undefined,
              };
            } else if ("option" in req && Array.isArray(req.option)) {
              // Option requirement
              return {
                id: slotId,
                type: "option" as const,
                requirement: req,
                course: undefined,
                acceptedCourses: req.option,
              };
            } else if ("lowerlib" in req && req.lowerlib) {
              // Lower Liberal
              return {
                id: slotId,
                type: "open" as const,
                requirement: {
                  ...req,
                  label: "Lower Liberal",
                  liberal: "LL",
                },
                course: undefined,
              };
            } else if ("upperlib" in req && req.upperlib) {
              // Upper Liberal
              return {
                id: slotId,
                type: "open" as const,
                requirement: {
                  ...req,
                  label: "Upper Liberal",
                  liberal: "UL",
                },
                course: undefined,
              };
            } else if ("open" in req && req.open) {
              // Open elective
              return {
                id: slotId,
                type: "open" as const,
                requirement: { ...req, label: "Open Elective" },
                course: undefined,
              };
            }
            // Fallback
            return {
              id: slotId,
              type: "open" as const,
              requirement: req,
              course: undefined,
            };
          }) || [];
        return {
          id: `semester-${semesterIndex}`,
          title: semester.semester,
          requirements,
        };
      }
    );
    setSemesterPlans(plans);
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const draggedCourse = courses.find((c: Course) => c.id === active.id);
    const targetSlotId = over.id as string;

    if (draggedCourse && targetSlotId.includes("-req-")) {
      // Find the target requirement slot
      setSemesterPlans((prev) =>
        prev.map((plan) => {
          const updatedRequirements = plan.requirements.map((req) => {
            if (req.id === targetSlotId && !req.course) {
              // Validate if the course fits the requirement
              const isValid = validateCourseForRequirement(draggedCourse, req);

              if (isValid) {
                return {
                  ...req,
                  course: { ...draggedCourse, id: `${req.id}-course` },
                };
              }
            }
            return req;
          });

          return {
            ...plan,
            requirements: updatedRequirements,
          };
        })
      );
    }

    setActiveId(null);
  };

  // Validate if a course can be placed in a requirement slot
  const validateCourseForRequirement = (
    course: Course,
    requirement: RequirementSlot
  ): boolean => {
    switch (requirement.type) {
      case "code":
        // Fixed courses are pre-populated, shouldn't be droppable
        return false;
      case "table":
        // Table requirements now accept any course
        return true;
      case "option":
        // Option requirements accept any of the listed courses
        return (
          requirement.acceptedCourses?.includes(course.code || "") || false
        );
      case "open":
        // Open electives with specific liberal requirements
        if (requirement.requirement.liberal === "LL") {
          // Only accept lower liberal courses
          return course.category === "lowerlib";
        }
        if (requirement.requirement.liberal === "UL") {
          // Only accept upper liberal courses
          return course.category === "upperlib";
        }
        if (
          requirement.requirement.label === "Lower Liberal"
        ) {
          // Only accept lower liberal courses
          return course.category === "lowerlib";
        }
        if (
          requirement.requirement.label === "Upper Liberal"
        ) {
          // Only accept upper liberal courses
          return course.category === "upperlib";
        }
        if (
          requirement.requirement.label === "Open Elective" ||
          requirement.requirement.open === "open"
        ) {
          // Accept any course for general open electives
          return true;
        }
        // fallback for any other open type
        return true;
      default:
        return false;
    }
  };

  // Remove course from requirement slot
  const removeCourseFromSlot = (slotId: string) => {
    setSemesterPlans((prev) =>
      prev.map((plan) => {
        const updatedRequirements = plan.requirements.map((req) => {
          if (req.id === slotId && req.type !== "code") {
            return {
              ...req,
              course: undefined,
            };
          }
          return req;
        });

        return {
          ...plan,
          requirements: updatedRequirements,
        };
      })
    );
  };

  // Toggle course completion
  const toggleCourseCompletion = (courseCode: string) => {
    setCompletedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseCode)) {
        newSet.delete(courseCode);
      } else {
        newSet.add(courseCode);
      }
      return newSet;
    });
  };

  // Catalogue filter handlers
  const handleCatalogueTypeToggle = (typeName: string) => {
    setCatalogueFilterTypes(prev =>
      prev.includes(typeName)
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
    // Reset pagination when filter changes
    setCataloguePagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleCatalogueTermToggle = (termName: string) => {
    setCatalogueFilterTerms(prev =>
      prev.includes(termName)
        ? prev.filter(t => t !== termName)
        : [...prev, termName]
    );
    // Reset pagination when filter changes
    setCataloguePagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearCatalogueFilters = () => {
    setCatalogueFilterTypes([]);
    setCatalogueFilterTerms([]);
    // Reset pagination when filters are cleared
    setCataloguePagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCataloguePagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1)
    }));
  };

  const handleNextPage = () => {
    setCataloguePagination(prev => ({
      ...prev,
      pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1)
    }));
  };

  // Popup handlers
  const handleShowCourseInfo = (course: Course, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Info button clicked for course:', course.code); // Debug log
    
    // We need to fetch the full course data from Supabase to get all details
    const fetchCourseDetails = async () => {
      try {
        console.log('Fetching details for:', course.code); // Debug log
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('code', course.code)
          .single();
        
        if (data && !error) {
          console.log('Course data fetched:', data); // Debug log
          // Use the full course data from Supabase
          setPopupCourse({
            code: data.code,
            name: data.name,
            description: data.description || "No description available",
            liberal: data.liberal || "None",
            term: data.term || [],
            "weekly contact": data.weekly_contact || "N/A",
            "gpa weight": data.gpa_weight || "N/A",
            "billing unit": data.billing_unit || "N/A",
            "course count": data.course_count || "N/A",
            prerequisites: data.prerequisites || "None",
            corequisites: data.corequisites || "None",
            antirequisites: data.antirequisites || "None",
            custom_requisites: data.custom_requisites || "None"
          });
        } else {
          console.log('Using fallback data for:', course.code); // Debug log
          // Fallback to basic course data
          setPopupCourse({
            code: course.code,
            name: course.title,
            description: "No description available",
            liberal: course.category === "lowerlib" ? "LL" : course.category === "upperlib" ? "UL" : "None",
            term: course.term,
            "weekly contact": "N/A",
            "gpa weight": "N/A",
            "billing unit": course.credits?.toString() || "N/A",
            "course count": "N/A",
            prerequisites: "N/A",
            corequisites: "N/A",
            antirequisites: "N/A",
            custom_requisites: "N/A"
          });
        }
        console.log('Setting showPopup to true'); // Debug log
        setShowPopup(true);
      } catch (error) {
        console.error('Error fetching course details:', error);
        // Still show popup with basic data
        setPopupCourse({
          code: course.code,
          name: course.title,
          description: "No description available",
          liberal: course.category === "lowerlib" ? "LL" : course.category === "upperlib" ? "UL" : "None",
          term: course.term,
          "weekly contact": "N/A",
          "gpa weight": "N/A",
          "billing unit": course.credits?.toString() || "N/A",
          "course count": "N/A",
          prerequisites: "N/A",
          corequisites: "N/A",
          antirequisites: "N/A",
          custom_requisites: "N/A"
        });
        setShowPopup(true);
      }
    };
    
    fetchCourseDetails();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupCourse(null);
  };

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const totalRequirements = semesterPlans.reduce(
      (acc, plan) => acc + plan.requirements.length,
      0
    );
    const filledRequirements = semesterPlans.reduce(
      (acc, plan) =>
        acc + plan.requirements.filter((req) => req.course).length,
      0
    );
    const completedCount = semesterPlans.reduce(
      (acc, plan) =>
        acc +
        plan.requirements.filter(
          (req) => req.course?.code && completedCourses.has(req.course.code)
        ).length,
      0
    );

    return {
      completed: completedCount,
      filled: filledRequirements,
      total: totalRequirements,
      percentage:
        totalRequirements > 0
          ? Math.round((filledRequirements / totalRequirements) * 100)
          : 0,
      completedPercentage:
        filledRequirements > 0
          ? Math.round((completedCount / filledRequirements) * 100)
          : 0,
    };
  }, [semesterPlans, completedCourses]);

  // --- Card coloring for categories (show lib, lowerlib, upperlib, open) ---
  const getCourseColor = (category: string) => {
    switch (category) {
      case "core":
        return "bg-blue-600 border-yellow-400 text-white border-2";
      case "elective":
        return "bg-yellow-400 text-black border-blue-600 border-2";
      case "liberal":
        return "bg-gray-700 text-white border-gray-300 border-2";
      case "lowerlib":
        return "bg-indigo-500 text-white border-indigo-200 border-2";
      case "upperlib":
        return "bg-pink-600 text-white border-pink-300 border-2";
      case "table":
        return "bg-purple-600 text-white border-purple-300 border-2";
      case "open":
        return "bg-green-600 text-white border-green-300 border-2";
      default:
        return "bg-gray-600 text-white border-gray-300 border-2";
    }
  };

  // --- Slot label logic, uses label field for lower/upperlib and open elective ---
  const getSlotLabel = (requirement: RequirementSlot) => {
    if (requirement.type === "code") return requirement.requirement.code;
    if (requirement.type === "table") return requirement.requirement.table;
    if (requirement.type === "option")
      return `Choose from: ${requirement.acceptedCourses
        ?.slice(0, 3)
        .join(", ")}${
        requirement.acceptedCourses &&
        requirement.acceptedCourses.length > 3
          ? "..."
          : ""
      }`;
    if (requirement.type === "open") {
      if (requirement.requirement.label)
        return requirement.requirement.label;
      if (requirement.requirement.liberal === "LL") return "Lower Liberal";
      if (requirement.requirement.liberal === "UL") return "Upper Liberal";
      if (requirement.requirement.open) return "Open Elective";
      return "Open";
    }
    return "Unknown Requirement";
  };

  // --- Slot component
  const RequirementSlotComponent = ({
    requirement,
    semesterIndex,
  }: {
    requirement: RequirementSlot;
    semesterIndex: number;
  }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: requirement.id,
    });

    const getSlotColor = () => {
      if (requirement.course) {
        return getCourseColor(requirement.course.category);
      }
      switch (requirement.type) {
        case "code":
          return "bg-blue-600 border-yellow-400 text-white border-2";
        case "table":
          return "bg-purple-100 border-purple-600 text-purple-900 border-dashed border-2";
        case "option":
          return "bg-yellow-100 border-yellow-600 text-yellow-900 border-dashed border-2";
        case "open":
          if (
            requirement.requirement.liberal === "LL" ||
            requirement.requirement.label === "Lower Liberal"
          )
            return "bg-indigo-100 border-indigo-600 text-indigo-900 border-dashed border-2";
          if (
            requirement.requirement.liberal === "UL" ||
            requirement.requirement.label === "Upper Liberal"
          )
            return "bg-pink-100 border-pink-600 text-pink-900 border-dashed border-2";
          return "bg-green-100 border-green-600 text-green-900 border-dashed border-2";
        default:
          return "bg-gray-100 border-gray-600 text-gray-900 border-dashed border-2";
      }
    };

    const isDroppable = requirement.type !== "code" && !requirement.course;

    return (
      <div
        ref={setNodeRef}
        className={`relative group p-2 sm:p-3 rounded-lg min-h-[50px] sm:min-h-[60px] flex items-center justify-between transition-colors max-w-full ${getSlotColor()} ${
          isDroppable ? "hover:border-solid hover:bg-opacity-30" : ""
        } ${isOver && isDroppable ? "border-solid bg-opacity-50 scale-105" : ""}`}
      >
        <div className="flex-1">
          {requirement.course ? (
            <div
              className="cursor-pointer"
              onClick={() =>
                requirement.course?.code &&
                toggleCourseCompletion(requirement.course.code)
              }
            >
              <p
                className={`font-semibold text-xs sm:text-sm ${
                  requirement.course.code &&
                  completedCourses.has(requirement.course.code)
                    ? "line-through opacity-75"
                    : ""
                }`}
              >
                {requirement.course.code ||
                  requirement.course.table ||
                  requirement.course.open ||
                  "Course"}
              </p>
              <p className="text-xs opacity-80">
                {requirement.course.credits} credits
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs sm:text-sm font-medium">{getSlotLabel(requirement)}</p>
              {isDroppable && (
                <p className="text-xs opacity-60 mt-1 hidden sm:block">Drag course here</p>
              )}
            </div>
          )}
        </div>
        {requirement.course && requirement.type !== "code" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeCourseFromSlot(requirement.id)}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
    );
  };

  // --- Course card in catalogue
  const CourseCard = ({
    course,
    isDragging = false,
  }: {
    course: Course;
    isDragging?: boolean;
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: course.id,
    });

    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`p-2 sm:p-3 rounded-lg transition-all duration-200 bg-background text-foreground border-2 border-gray-600 font-bold relative ${
          isDragging
            ? "opacity-50 scale-95"
            : "hover:scale-105 hover:shadow-lg hover:bg-card-hover"
        }`}
      >
        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Draggable handle area */}
            <div 
              className="flex items-center gap-1 sm:gap-2 flex-1 cursor-grab active:cursor-grabbing"
              {...listeners}
              {...attributes}
            >
              <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 opacity-60" />
              <span className="text-xs font-bold truncate">
                {course.code || "Course"}
              </span>
            </div>
            
            {/* Non-draggable info button */}
            <button
              onClick={(e) => handleShowCourseInfo(course, e)}
              className="p-1 sm:p-1.5 hover:bg-card-hover rounded-full transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-card-hover flex-shrink-0 hover:cursor-pointer"
              title="Course Info"
              type="button"
            >
              <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 hover:text-blue-300 transition-colors" />
            </button>
          </div>
          
          {/* Badges Row */}
          <div className="flex flex-wrap gap-1">
            {/* Liberal Type Badge */}
            {course.category === "lowerlib" && (
              <Badge className="bg-blue-400 text-black text-xs px-1 py-0 h-3 sm:h-4">
                Lower
              </Badge>
            )}
            {course.category === "upperlib" && (
              <Badge className="bg-blue-400 text-black text-xs px-1 py-0 h-3 sm:h-4">
                Upper
              </Badge>
            )}
            
            {/* Term Badges */}
            {course.term?.includes('Fall') && (
              <Badge className="bg-blue-400 text-black text-xs px-1 py-0 h-3 sm:h-4">
                Fall
              </Badge>
            )}
            {course.term?.includes('Winter') && (
              <Badge className="bg-blue-400 text-black text-xs px-1 py-0 h-3 sm:h-4">
                Winter
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <>
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background flex flex-col w-full">
        {/* INSTRUCTIONS */}
        <div className="w-full flex justify-center mt-4 sm:mt-6 md:mt-8 px-4">
          <div className="bg-card-bg border-2 border-borders rounded-2xl shadow-lg max-w-xl w-full p-4 sm:p-6 flex flex-col items-center">
            <h3 className="text-primary font-extrabold mb-3 text-lg sm:text-xl md:text-2xl flex items-center gap-2 tracking-wide drop-shadow-sm">
              <span role="img" aria-label="banana">
                🍌
              </span>
              How to Use
              <span role="img" aria-label="monkey">
                🦍
              </span>
            </h3>
            <div className="text-sm sm:text-base text-foreground space-y-2 sm:space-y-3 font-medium">
              <div>
                <span className="font-bold text-secondary">Fixed Courses:</span>{" "}
                Pre-filled (blue)
              </div>
              <div>
                <span className="font-bold text-accent">Table Requirements:</span>{" "}
                Need specific courses
              </div>
              <div>
                <span className="font-bold text-warning">
                  Option Requirements:
                </span>{" "}
                Multiple choices
              </div>
              <div>
                <span className="font-bold text-success">Open Electives:</span>{" "}
                Accept any course, or Lower/Upper Liberal!
              </div>
              <div>
                <span className="font-bold text-warning">Drag courses</span> from
                catalogue to empty slots
              </div>
              <div>
                <span className="font-bold text-danger">Click courses</span> to
                mark as completed
              </div>
            </div>
          </div>
        </div>

        {/* PROGRAM SELECTOR */}
        <div className="w-full flex justify-center mt-4 sm:mt-6 md:mt-8 px-4">
          <div className="bg-card-bg border-2 border-borders rounded-2xl shadow-lg p-4 max-w-xl w-full">
            <ProgramSelector
              programs={programOptions}
              selectedProgram={selectedProgram}
              onProgramSelect={handleProgramSelect}
            />
          </div>
        </div>

        {/* PROGRAM OVERVIEW */}
        {selectedProgramData && (
          <div className="w-full flex justify-center mt-4 sm:mt-6 md:mt-8 px-4">
            <div className="bg-card-bg border-2 border-borders rounded-2xl shadow-lg max-w-4xl w-full p-4 sm:p-6">
              <h2 className="text-primary text-xl sm:text-2xl font-black text-center mb-3 tracking-wide drop-shadow">
                🎓 {selectedProgram}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm sm:text-base mb-3">
                <div className="bg-card-hover rounded-md px-2 sm:px-4 py-2 text-center font-bold text-secondary">
                  {selectedProgramData.total_courses}
                  <br />
                  <span className="text-foreground font-medium text-xs sm:text-sm">Total</span>
                </div>
                <div className="bg-card-hover rounded-md px-2 sm:px-4 py-2 text-center font-bold text-primary">
                  {selectedProgramData.total_core}
                  <br />
                  <span className="text-foreground font-medium text-xs sm:text-sm">Core</span>
                </div>
                <div className="bg-card-hover rounded-md px-2 sm:px-4 py-2 text-center font-bold text-success">
                  {selectedProgramData.total_open}
                  <br />
                  <span className="text-foreground font-medium text-xs sm:text-sm">Open</span>
                </div>
                <div className="bg-card-hover rounded-md px-2 sm:px-4 py-2 text-center font-bold text-accent">
                  {selectedProgramData.total_lowerlib +
                    selectedProgramData.total_upperlib}
                  <br />
                  <span className="text-foreground font-medium text-xs sm:text-sm">Liberal</span>
                </div>
              </div>
              {/* Progress Bars */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted">
                  <span>Planning Progress</span>
                  <span className="text-primary">{progressStats.percentage}%</span>
                </div>
                <div className="w-full bg-input-bg rounded-full h-3">
                  <div
                    className="bg-warning h-3 rounded-full transition-all duration-500 ease-out shadow"
                    style={{ width: `${progressStats.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-center text-muted font-semibold">
                  {progressStats.filled} / {progressStats.total} requirements
                  filled
                </div>
                {progressStats.filled > 0 && (
                  <>
                    <div className="flex justify-between text-xs font-bold text-muted">
                      <span>Completion Progress</span>
                      <span className="text-success">
                        {progressStats.completedPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-input-bg rounded-full h-3">
                      <div
                        className="bg-success h-3 rounded-full transition-all duration-500 ease-out shadow"
                        style={{
                          width: `${progressStats.completedPercentage}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-center text-muted font-semibold">
                      {progressStats.completed} / {progressStats.filled} courses
                      completed
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedProgram && (
          <div className="flex-1 flex flex-col lg:flex-row w-full mx-auto gap-4 lg:gap-6 xl:gap-10 pt-6 md:pt-8 lg:pt-12 pb-12 lg:pb-24 px-4 lg:px-8">
            {/* SEMESTER CARDS */}
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 xl:gap-10">
              {semesterPlans.map((semester, semesterIndex) => (
                <Card
                  key={semester.id}
                  className="bg-card-bg border-2 border-borders rounded-2xl shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-primary font-bold flex justify-between items-center text-base sm:text-lg">
                      <span>{semester.title}</span>
                      <Badge
                        variant="secondary"
                        className="bg-warning text-foreground shadow text-xs"
                      >
                        {
                          semester.requirements.filter((req) => req.course)
                            .length
                        }
                        /{semester.requirements.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {semester.requirements.map((requirement) => (
                      <RequirementSlotComponent
                        key={requirement.id}
                        requirement={requirement}
                        semesterIndex={semesterIndex}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* RIGHT SIDEBAR - CATALOGUE */}
            <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-20 lg:self-start bg-card-bg border-2 border-borders rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 lg:h-[calc(100vh-6rem)]">
              <h3 className="text-primary font-extrabold mb-2 sm:mb-4 text-base sm:text-lg text-center">
                Course Catalogue
              </h3>
              
              {/* Filter Badges */}
              <div className="space-y-2 sm:space-y-3">
                {/* Type Filters */}
                <div className="flex flex-col gap-1 sm:gap-2 items-center">
                  <p className="text-foreground text-xs font-semibold">Type:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <button
                      className={`px-2 py-1 rounded-lg font-semibold text-xs hover:opacity-80 hover:cursor-pointer border border-secondary transition-all
                        ${catalogueFilterTypes.includes("Lower liberal") ? "bg-blue-400 text-black" : "bg-background text-foreground border-secondary"}`}
                      onClick={() => handleCatalogueTypeToggle("Lower liberal")}
                    >
                      Lower
                    </button>
                    <button
                      className={`px-2 py-1 rounded-lg font-semibold text-xs hover:opacity-80 hover:cursor-pointer border border-secondary transition-all
                        ${catalogueFilterTypes.includes("Upper liberal") ? "bg-blue-400 text-black" : "bg-background text-foreground border-secondary"}`}
                      onClick={() => handleCatalogueTypeToggle("Upper liberal")}
                    >
                      Upper
                    </button>
                  </div>
                </div>

                {/* Term Filters */}
                <div className="flex flex-col gap-1 sm:gap-2 items-center">
                  <p className="text-foreground text-xs font-semibold">Term:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <button
                      className={`px-2 py-1 rounded-lg font-semibold text-xs hover:opacity-80 hover:cursor-pointer border border-secondary transition-all
                        ${catalogueFilterTerms.includes("Fall") ? "bg-blue-400 text-black" : "bg-background text-foreground border-secondary"}`}
                      onClick={() => handleCatalogueTermToggle("Fall")}
                    >
                      Fall
                    </button>
                    <button
                      className={`px-2 py-1 rounded-lg font-semibold text-xs hover:opacity-80 hover:cursor-pointer border border-secondary transition-all
                        ${catalogueFilterTerms.includes("Winter") ? "bg-blue-400 text-black" : "bg-background text-foreground border-secondary"}`}
                      onClick={() => handleCatalogueTermToggle("Winter")}
                    >
                      Winter
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(catalogueFilterTypes.length > 0 || catalogueFilterTerms.length > 0) && (
                  <div className="p-2 bg-secondary text-background rounded-lg border border-blue-700">
                    <div className="flex flex-wrap gap-1 items-center justify-center">
                      <span className="text-xs font-semibold mr-1">Active:</span>
                      {catalogueFilterTypes.map(type => (
                        <Badge
                          key={type}
                          className="bg-blue-400 text-black text-xs px-1 py-0 h-4 cursor-pointer"
                          onClick={() => setCatalogueFilterTypes(catalogueFilterTypes.filter(t => t !== type))}
                        >
                          {type === "Lower liberal" ? "Lower" : "Upper"}
                          <X className="h-2 w-2 ml-1" />
                        </Badge>
                      ))}
                      {catalogueFilterTerms.map(term => (
                        <Badge
                          key={term}
                          className="bg-blue-400 text-black text-xs px-1 py-0 h-4 cursor-pointer"
                          onClick={() => setCatalogueFilterTerms(catalogueFilterTerms.filter(t => t !== term))}
                        >
                          {term}
                          <X className="h-2 w-2 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear All Button */}
                {(catalogueFilterTypes.length > 0 || catalogueFilterTerms.length > 0) && (
                  <div className="flex justify-center">
                    <button
                      className="px-2 py-1 rounded-lg font-semibold text-xs bg-red-400 text-black hover:bg-red-500 transition-all border border-red-600"
                      onClick={handleClearCatalogueFilters}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              <div className="relative mb-4 sm:mb-6">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 bg-input-bg border-2 border-input-border rounded-xl text-foreground font-bold placeholder:text-muted focus:border-input-focus transition-all text-sm"
                />
              </div>
              <div className="flex-1 overflow-y-auto px-1 sm:px-2 lg:max-h-96">
                <div className="space-y-2 sm:space-y-3">
                  {paginatedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="text-center text-muted py-4 sm:py-8">
                      <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                      <p className="font-bold text-sm">No courses found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pagination Controls */}
              {filteredCourses.length > 0 && (
                <div className="flex items-center justify-between px-1 sm:px-2 py-2 sm:py-3 border-t border-borders">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!canPreviousPage}
                    className="border-gray-700 text-foreground hover:bg-gray-800 hover:text-white hover:cursor-pointer bg-background text-xs px-2 py-1 h-6"
                  >
                    Previous
                  </Button>
                  <p className="text-xs font-semibold text-foreground">
                    {totalPages === 0 ? "0 / 0" : `${currentPage} / ${totalPages}`}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!canNextPage}
                    className="border-gray-700 text-foreground hover:bg-gray-800 hover:text-white hover:cursor-pointer bg-background text-xs px-2 py-1 h-6"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DRAG OVERLAY */}
        <DragOverlay>
          {activeId && (
            <CourseCard course={courses.find((c: Course) => c.id === activeId)!} isDragging />
          )}
        </DragOverlay>
      </div>
    </DndContext>

    {/* COURSE POPUP - Outside DndContext for better z-index */}
    <PopUp 
      open={showPopup} 
      course={popupCourse} 
      onClose={handleClosePopup}
    />
    </>
  );
}
