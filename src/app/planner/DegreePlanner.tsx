"use client"

import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import programsData from '../../../all_programs.json';
import ProgramSelector from './ProgramSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, GripVertical, X, Plus } from 'lucide-react';

interface Course {
  id: string;
  code?: string;
  table?: string;
  option?: string[];
  open?: string;
  title?: string;
  credits?: number;
  category: 'core' | 'elective' | 'liberal' | 'table' | 'open';
}

interface RequirementSlot {
  id: string;
  type: 'code' | 'table' | 'option' | 'open';
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
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [semesterPlans, setSemesterPlans] = useState<SemesterPlan[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Program data
  const selectedProgramData = useMemo(() => 
    programsData.find(p => p.program === selectedProgram),
    [selectedProgram]
  );

  const programOptions = useMemo(() => 
    programsData.map(p => p.program).sort(),
    []
  );

  // Available courses for the course catalogue (extracted from all programs)
  const availableCourses = useMemo(() => {
    if (!selectedProgramData) return [];
    
    const courses: Course[] = [];
    let courseId = 0;

    selectedProgramData.semesters.forEach((semester) => {
      semester.requirements?.forEach((req) => {
        if (req.code) {
          courses.push({
            id: `course-${courseId++}`,
            code: req.code,
            title: `Course ${req.code}`,
            credits: 3,
            category: 'core'
          });
        } else if (req.table) {
          courses.push({
            id: `course-${courseId++}`,
            table: req.table,
            title: req.table,
            credits: 3,
            category: 'table'
          });
        } else if (req.option) {
          req.option.forEach((opt) => {
            courses.push({
              id: `course-${courseId++}`,
              code: opt,
              title: `Course ${opt}`,
              credits: 3,
              category: 'elective'
            });
          });
        } else if (req.open) {
          courses.push({
            id: `course-${courseId++}`,
            open: req.open,
            title: 'Open Elective',
            credits: 3,
            category: 'open'
          });
        }
      });
    });

    // Remove duplicates
    const uniqueCourses = courses.filter((course, index, self) => 
      index === self.findIndex((c) => 
        (c.code && course.code && c.code === course.code) ||
        (c.table && course.table && c.table === course.table) ||
        (c.open && course.open)
      )
    );

    return uniqueCourses;
  }, [selectedProgramData]);

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return availableCourses;
    return availableCourses.filter(course =>
      (course.code?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.table?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [availableCourses, searchQuery]);

  // Initialize semester plans when program is selected
  const handleProgramSelect = (programName: string) => {
    setSelectedProgram(programName);
    setCompletedCourses(new Set());
    
    const program = programsData.find(p => p.program === programName);
    if (!program) return;

    const plans: SemesterPlan[] = program.semesters.map((semester, semesterIndex) => {
      const requirements: RequirementSlot[] = semester.requirements?.map((req, reqIndex) => {
        const slotId = `semester-${semesterIndex}-req-${reqIndex}`;
        
        if (req.code) {
          // Fixed course - pre-populate it
          return {
            id: slotId,
            type: 'code' as const,
            requirement: req,
            course: {
              id: `${slotId}-course`,
              code: req.code,
              title: `Course ${req.code}`,
              credits: 3,
              category: 'core'
            }
          };
        } else if (req.table) {
          // Table requirement - empty slot for user to fill
          return {
            id: slotId,
            type: 'table' as const,
            requirement: req,
            course: undefined
          };
        } else if (req.option) {
          // Option requirement - empty slot with accepted courses list
          return {
            id: slotId,
            type: 'option' as const,
            requirement: req,
            course: undefined,
            acceptedCourses: req.option
          };
        } else if (req.open) {
          // Open elective - empty slot
          return {
            id: slotId,
            type: 'open' as const,
            requirement: req,
            course: undefined
          };
        }
        
        return {
          id: slotId,
          type: 'open' as const,
          requirement: req,
          course: undefined
        };
      }) || [];

      return {
        id: `semester-${semesterIndex}`,
        title: semester.semester,
        requirements
      };
    });

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

    const draggedCourse = availableCourses.find(c => c.id === active.id);
    const targetSlotId = over.id as string;

    if (draggedCourse && targetSlotId.includes('-req-')) {
      // Find the target requirement slot
      setSemesterPlans(prev => prev.map(plan => {
        const updatedRequirements = plan.requirements.map(req => {
          if (req.id === targetSlotId && !req.course) {
            // Validate if the course fits the requirement
            const isValid = validateCourseForRequirement(draggedCourse, req);
            
            if (isValid) {
              return {
                ...req,
                course: { ...draggedCourse, id: `${req.id}-course` }
              };
            }
          }
          return req;
        });

        return {
          ...plan,
          requirements: updatedRequirements
        };
      }));
    }

    setActiveId(null);
  };

  // Validate if a course can be placed in a requirement slot
  const validateCourseForRequirement = (course: Course, requirement: RequirementSlot): boolean => {
    switch (requirement.type) {
      case 'code':
        // Fixed courses are pre-populated, shouldn't be droppable
        return false;
      case 'table':
        // Table requirements accept courses with matching table names
        return course.table === requirement.requirement.table;
      case 'option':
        // Option requirements accept any of the listed courses
        return requirement.acceptedCourses?.includes(course.code || '') || false;
      case 'open':
        // Open electives accept any course
        return true;
      default:
        return false;
    }
  };

  // Remove course from requirement slot
  const removeCourseFromSlot = (slotId: string) => {
    setSemesterPlans(prev => prev.map(plan => {
      const updatedRequirements = plan.requirements.map(req => {
        if (req.id === slotId && req.type !== 'code') {
          return {
            ...req,
            course: undefined
          };
        }
        return req;
      });

      return {
        ...plan,
        requirements: updatedRequirements
      };
    }));
  };

  // Toggle course completion
  const toggleCourseCompletion = (courseCode: string) => {
    setCompletedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseCode)) {
        newSet.delete(courseCode);
      } else {
        newSet.add(courseCode);
      }
      return newSet;
    });
  };

  // Calculate progress stats
  const progressStats = useMemo(() => {
    const totalRequirements = semesterPlans.reduce((acc, plan) => acc + plan.requirements.length, 0);
    const filledRequirements = semesterPlans.reduce((acc, plan) => 
      acc + plan.requirements.filter(req => req.course).length, 0
    );
    const completedCount = semesterPlans.reduce((acc, plan) => 
      acc + plan.requirements.filter(req => 
        req.course?.code && completedCourses.has(req.course.code)
      ).length, 0
    );
    
    return {
      completed: completedCount,
      filled: filledRequirements,
      total: totalRequirements,
      percentage: totalRequirements > 0 ? Math.round((filledRequirements / totalRequirements) * 100) : 0,
      completedPercentage: filledRequirements > 0 ? Math.round((completedCount / filledRequirements) * 100) : 0
    };
  }, [semesterPlans, completedCourses]);

  const getCourseColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-[#3375C2] border-[#F9DD4A] text-white';
      case 'elective': return 'bg-[#F9DD4A] text-black border-[#3375C2]';
      case 'liberal': return 'bg-gray-600 text-white';
      case 'table': return 'bg-purple-500 text-white';
      case 'open': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const RequirementSlotComponent = ({ requirement, semesterIndex }: { requirement: RequirementSlot; semesterIndex: number }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: requirement.id,
    });

    const getSlotLabel = () => {
      switch (requirement.type) {
        case 'code':
          return requirement.requirement.code;
        case 'table':
          return requirement.requirement.table;
        case 'option':
          return `Choose from: ${requirement.acceptedCourses?.slice(0, 3).join(', ')}${requirement.acceptedCourses && requirement.acceptedCourses.length > 3 ? '...' : ''}`;
        case 'open':
          return 'Open Elective';
        default:
          return 'Unknown Requirement';
      }
    };

    const getSlotColor = () => {
      if (requirement.course) {
        return getCourseColor(requirement.course.category);
      }
      
      switch (requirement.type) {
        case 'code':
          return 'bg-[#3375C2] border-[#F9DD4A] text-white';
        case 'table':
          return 'bg-purple-500/20 border-purple-500 text-purple-300 border-dashed';
        case 'option':
          return 'bg-[#F9DD4A]/20 border-[#F9DD4A] text-[#F9DD4A] border-dashed';
        case 'open':
          return 'bg-green-500/20 border-green-500 text-green-300 border-dashed';
        default:
          return 'bg-gray-500/20 border-gray-500 text-gray-300 border-dashed';
      }
    };

    const isDroppable = requirement.type !== 'code' && !requirement.course;

    return (
      <div
        ref={setNodeRef}
        className={`relative group p-3 rounded-lg min-h-[60px] flex items-center justify-between transition-colors ${getSlotColor()} ${
          isDroppable ? 'hover:border-solid hover:bg-opacity-30' : ''
        } ${isOver && isDroppable ? 'border-solid bg-opacity-50 scale-105' : ''}`}
      >
        <div className="flex-1">
          {requirement.course ? (
            <div 
              className="cursor-pointer"
              onClick={() => requirement.course?.code && toggleCourseCompletion(requirement.course.code)}
            >
              <p className={`font-semibold text-sm ${
                requirement.course.code && completedCourses.has(requirement.course.code) 
                  ? 'line-through opacity-75' 
                  : ''
              }`}>
                {requirement.course.code || requirement.course.table || requirement.course.open || 'Course'}
              </p>
              <p className="text-xs opacity-80">{requirement.course.credits} credits</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium">{getSlotLabel()}</p>
              {isDroppable && (
                <p className="text-xs opacity-60 mt-1">Drag course here</p>
              )}
            </div>
          )}
        </div>
        
        {requirement.course && requirement.type !== 'code' && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeCourseFromSlot(requirement.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  const CourseCard = ({ course, isDragging = false }: { course: Course; isDragging?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: course.id,
    });

    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
      <div 
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${getCourseColor(course.category)} ${
          isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-lg'
        }`}
      >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 opacity-60" />
          <div>
            <p className="font-semibold text-sm">
              {course.code || course.table || course.open || 'Course'}
            </p>
            <p className="text-xs opacity-80">{course.credits} credits</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {course.category}
        </Badge>
      </div>
    </div>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-full bg-black flex">
        {/* Left Sidebar - Program Info */}
        <div className="w-80 bg-black/60 border-r border-gray-700 flex flex-col">
          {/* Program Selector */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold mb-3">Select Program</h3>
            <ProgramSelector
              programs={programOptions}
              selectedProgram={selectedProgram}
              onProgramSelect={handleProgramSelect}
            />
          </div>

          {/* Program Overview */}
          {selectedProgramData && (
            <div className="p-4 border-b border-gray-700">
              <div className="bg-gradient-to-br from-[#3375C2] to-[#1E4B96] border-[#F9DD4A] border-2 shadow-2xl rounded-xl p-4 text-white">
                <h2 className="text-lg font-bold text-[#F9DD4A] mb-3 text-center">{selectedProgram}</h2>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-white/10 rounded-md px-2 py-1 text-center">
                    <span className="text-[#F9DD4A] font-semibold">{selectedProgramData.total_courses}</span><br/>Total
                  </div>
                  <div className="bg-white/10 rounded-md px-2 py-1 text-center">
                    <span className="text-[#F9DD4A] font-semibold">{selectedProgramData.total_core}</span><br/>Core
                  </div>
                  <div className="bg-white/10 rounded-md px-2 py-1 text-center">
                    <span className="text-[#F9DD4A] font-semibold">{selectedProgramData.total_open}</span><br/>Open
                  </div>
                  <div className="bg-white/10 rounded-md px-2 py-1 text-center">
                    <span className="text-[#F9DD4A] font-semibold">{selectedProgramData.total_lowerlib + selectedProgramData.total_upperlib}</span><br/>Liberal
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Planning Progress</span>
                    <span>{progressStats.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-[#F9DD4A] h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressStats.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-center mt-1">
                    {progressStats.filled} / {progressStats.total} requirements filled
                  </div>
                  
                  {progressStats.filled > 0 && (
                    <>
                      <div className="flex justify-between text-xs mb-1 mt-2">
                        <span>Completion Progress</span>
                        <span>{progressStats.completedPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progressStats.completedPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">
                        {progressStats.completed} / {progressStats.filled} courses completed
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-bold mb-2 text-sm">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3375C2] rounded border border-[#F9DD4A]"></div>
                <span className="text-gray-300">Core Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F9DD4A] rounded"></div>
                <span className="text-gray-300">Open Electives</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-gray-300">Liberal Studies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-gray-300">Tables & Options</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 flex-1">
            <h3 className="text-white font-bold mb-2 text-sm">How to Use</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• <span className="text-[#F9DD4A]">Fixed courses</span> are pre-filled (blue)</p>
              <p>• <span className="text-purple-400">Table requirements</span> need specific courses</p>
              <p>• <span className="text-[#F9DD4A]">Option requirements</span> have multiple choices</p>
              <p>• <span className="text-green-400">Open electives</span> accept any course</p>
              <p>• <span className="text-[#F9DD4A]">Drag courses</span> from catalogue to empty slots</p>
              <p>• <span className="text-[#F9DD4A]">Click courses</span> to mark as completed</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Semester Cards */}
          <div className="flex-1 p-6 overflow-y-auto bg-black">
            {selectedProgram ? (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white mb-6">Degree Planner</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {semesterPlans.map((semester, semesterIndex) => (
                    <Card 
                      key={semester.id}
                      className="bg-gray-900 border-gray-700 hover:border-[#F9DD4A]/50 transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white flex justify-between items-center">
                          <span>{semester.title}</span>
                          <Badge variant="secondary" className="bg-[#F9DD4A] text-black">
                            {semester.requirements.filter(req => req.course).length}/{semester.requirements.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
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
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-8">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#3375C2] to-[#1E4B96] rounded-full flex items-center justify-center mb-6 shadow-2xl">
                      <svg
                        className="h-12 w-12 text-[#F9DD4A]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    TMU Degree Planner
                  </h2>
                  <p className="text-gray-400 text-base mb-6">
                    Select a program from the sidebar to start planning your degree
                  </p>
                  <div className="bg-[#F9DD4A]/10 border border-[#F9DD4A]/30 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-[#F9DD4A] text-sm">
                      ✨ <strong>New Card-Based Interface:</strong><br/>
                      🎯 Drag and drop courses<br/>
                      📊 Visual semester planning<br/>
                      🔍 Search course catalogue<br/>
                      📅 Clean card layout<br/>
                      🎮 Interactive course management
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Course Catalogue */}
          {selectedProgram && (
            <div className="w-80 bg-black/60 border-l border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-bold mb-3">Course Catalogue</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No courses found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && (
            <CourseCard 
              course={availableCourses.find(c => c.id === activeId)!} 
              isDragging 
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
