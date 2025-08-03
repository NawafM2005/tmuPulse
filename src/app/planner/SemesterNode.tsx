"use client"

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface RequirementItem {
  code?: string;
  table?: string;
  open?: string;
  option?: string[];
  [key: string]: any;
}

interface SemesterNodeData {
  semester: string;
  requirements: RequirementItem[];
  totalCourses: number;
  completedCourses?: Set<string>;
  onCourseToggle?: (courseCode: string) => void;
  onSemesterSelect?: () => void;
  isSelected?: boolean;
  isExpanded?: boolean;
}

interface SemesterNodeProps {
  data: SemesterNodeData;
}

export default function SemesterNode({ data }: SemesterNodeProps) {
  const { 
    semester, 
    requirements, 
    totalCourses, 
    completedCourses = new Set(), 
    onCourseToggle, 
    onSemesterSelect,
    isSelected = false,
    isExpanded = false
  } = data;

  const [localExpanded, setLocalExpanded] = useState(false);
  const showExpanded = isSelected || localExpanded;

  // Helper function to get display text for a requirement
  const getRequirementText = (req: RequirementItem): string => {
    if (req.code) return req.code;
    if (req.table) return req.table;
    if (req.open) return "Open Elective";
    if (req.option) return `Choose from: ${req.option.slice(0, 2).join(', ')}${req.option.length > 2 ? '...' : ''}`;
    return JSON.stringify(req);
  };

  // Helper function to check if a requirement is completed
  const isRequirementCompleted = (req: RequirementItem): boolean => {
    if (req.code) {
      return completedCourses.has(req.code);
    }
    if (req.course_codes && Array.isArray(req.course_codes)) {
      return req.course_codes.some(code => completedCourses.has(code));
    }
    return false;
  };

  // Calculate completion stats
  const completedCount = requirements.filter(req => isRequirementCompleted(req)).length;
  const completionPercentage = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  // Categorize courses by type
  const categorizedCourses = requirements.reduce((acc, req) => {
    const text = getRequirementText(req);
    
    if (req.code) {
      // Core courses (specific course codes)
      acc.core.push({ text, req, completed: isRequirementCompleted(req) });
    } else if (req.open || (req.table && req.table.toLowerCase().includes('open'))) {
      // Open electives
      acc.open.push({ text, req, completed: isRequirementCompleted(req) });
    } else if (req.table && (req.table.toLowerCase().includes('liberal') || req.table.toLowerCase().includes('lib'))) {
      // Liberal studies
      acc.liberal.push({ text, req, completed: isRequirementCompleted(req) });
    } else {
      // Other requirements (tables, options, etc.)
      acc.other.push({ text, req, completed: isRequirementCompleted(req) });
    }
    return acc;
  }, { 
    core: [] as Array<{text: string, req: RequirementItem, completed: boolean}>, 
    open: [] as Array<{text: string, req: RequirementItem, completed: boolean}>, 
    liberal: [] as Array<{text: string, req: RequirementItem, completed: boolean}>, 
    other: [] as Array<{text: string, req: RequirementItem, completed: boolean}> 
  });

  return (
    <div className="semester-node">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#F9DD4A', width: '12px', height: '12px' }}
      />
      
      <Card 
        className={`bg-gray-900 border-gray-700 shadow-xl transition-all duration-300 ${
          showExpanded ? 'w-[320px]' : 'w-[260px]'
        } ${
          isSelected ? 'ring-2 ring-[#F9DD4A] shadow-2xl scale-105' : 'hover:shadow-2xl hover:scale-102'
        }`}
        onClick={onSemesterSelect}
      >
        <div className="p-3">
          {/* Semester Header */}
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-white mb-1">{semester}</h3>
            <div className="flex justify-center gap-2 items-center flex-wrap">
              <Badge variant="outline" className="bg-[#3375C2] text-white border-[#F9DD4A] text-xs">
                {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
              </Badge>
              {completionPercentage > 0 && (
                <Badge variant="outline" className="bg-green-600 text-white border-green-400 text-xs">
                  {completionPercentage}% Done
                </Badge>
              )}
              {!showExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalExpanded(true);
                  }}
                  className="text-[#F9DD4A] text-xs hover:text-yellow-300 underline"
                >
                  Show All
                </button>
              )}
              {showExpanded && !isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalExpanded(false);
                  }}
                  className="text-gray-400 text-xs hover:text-gray-300 underline"
                >
                  Collapse
                </button>
              )}
            </div>
            
            {/* Progress Bar */}
            {totalCourses > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-[#F9DD4A] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Course Requirements */}
          <div className="space-y-2">
            {/* Core Courses */}
            {categorizedCourses.core.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#F9DD4A] mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#3375C2] rounded-full border border-[#F9DD4A]"></div>
                  Core ({categorizedCourses.core.filter(c => c.completed).length}/{categorizedCourses.core.length})
                </h4>
                <div className="space-y-1">
                  {(showExpanded ? categorizedCourses.core : categorizedCourses.core.slice(0, 3)).map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-1.5 rounded border cursor-pointer transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-600/30 border-green-400 text-green-200 line-through' 
                          : 'text-gray-300 bg-[#3375C2]/20 border-[#3375C2]/50 hover:bg-[#3375C2]/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.req.code && onCourseToggle) {
                          onCourseToggle(item.req.code);
                        }
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                  {!showExpanded && categorizedCourses.core.length > 3 && (
                    <div className="text-xs text-gray-400 italic">
                      +{categorizedCourses.core.length - 3} more...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Open Electives */}
            {categorizedCourses.open.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#F9DD4A] mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#F9DD4A] rounded-full"></div>
                  Electives ({categorizedCourses.open.filter(c => c.completed).length}/{categorizedCourses.open.length})
                </h4>
                <div className="space-y-1">
                  {(showExpanded ? categorizedCourses.open : categorizedCourses.open.slice(0, 2)).map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-1.5 rounded border cursor-pointer transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-600/30 border-green-400 text-green-200 line-through' 
                          : 'text-gray-300 bg-[#F9DD4A]/20 border-[#F9DD4A]/50 hover:bg-[#F9DD4A]/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // For open electives, we might not have specific codes
                        if (item.req.code && onCourseToggle) {
                          onCourseToggle(item.req.code);
                        }
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                  {!showExpanded && categorizedCourses.open.length > 2 && (
                    <div className="text-xs text-gray-400 italic">
                      +{categorizedCourses.open.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Liberal Studies */}
            {categorizedCourses.liberal.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#F9DD4A] mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Liberal ({categorizedCourses.liberal.filter(c => c.completed).length}/{categorizedCourses.liberal.length})
                </h4>
                <div className="space-y-1">
                  {(showExpanded ? categorizedCourses.liberal : categorizedCourses.liberal.slice(0, 2)).map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-1.5 rounded border cursor-pointer transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-600/30 border-green-400 text-green-200 line-through' 
                          : 'text-gray-300 bg-gray-600/20 border-gray-600/50 hover:bg-gray-600/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.req.code && onCourseToggle) {
                          onCourseToggle(item.req.code);
                        }
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                  {!showExpanded && categorizedCourses.liberal.length > 2 && (
                    <div className="text-xs text-gray-400 italic">
                      +{categorizedCourses.liberal.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Requirements */}
            {categorizedCourses.other.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#F9DD4A] mb-1 flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Other ({categorizedCourses.other.filter(c => c.completed).length}/{categorizedCourses.other.length})
                </h4>
                <div className="space-y-1">
                  {(showExpanded ? categorizedCourses.other : categorizedCourses.other.slice(0, 2)).map((item, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-1.5 rounded border cursor-pointer transition-all duration-200 ${
                        item.completed 
                          ? 'bg-green-600/30 border-green-400 text-green-200 line-through' 
                          : 'text-gray-300 bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.req.code && onCourseToggle) {
                          onCourseToggle(item.req.code);
                        }
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                  {!showExpanded && categorizedCourses.other.length > 2 && (
                    <div className="text-xs text-gray-400 italic">
                      +{categorizedCourses.other.length - 2} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#F9DD4A', width: '12px', height: '12px' }}
      />
    </div>
  );
}
