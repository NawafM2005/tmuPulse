"use client"

import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

interface ProgramOverviewData {
  label: string;
  totalCourses: number;
  totalCore: number;
  totalOpen: number;
  totalLowerLib: number;
  totalUpperLib: number;
  other: number;
}

interface ProgramOverviewNodeProps {
  data: ProgramOverviewData;
}

export default function ProgramOverviewNode({ data }: ProgramOverviewNodeProps) {
  const { 
    label, 
    totalCourses, 
    totalCore, 
    totalOpen, 
    totalLowerLib, 
    totalUpperLib, 
    other 
  } = data;

  return (
    <div className="program-overview-node">
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#F9DD4A', width: '16px', height: '16px' }}
      />
      
      <Card className="bg-gradient-to-br from-[#3375C2] to-[#1E4B96] border-[#F9DD4A] border-3 shadow-2xl min-w-[400px]">
        <div className="p-6 text-white">
          {/* Program Title */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <GraduationCap className="h-10 w-10 text-[#F9DD4A]" />
            </div>
            <h2 className="text-xl font-bold text-[#F9DD4A] mb-2">{label}</h2>
            <Badge className="bg-[#F9DD4A] text-[#3375C2] font-bold">
              {totalCourses} Total Courses
            </Badge>
          </div>

          {/* Course Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-[#F9DD4A]" />
                <span className="text-sm font-semibold">Core Courses</span>
              </div>
              <p className="text-2xl font-bold text-[#F9DD4A]">{totalCore}</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-[#F9DD4A]" />
                <span className="text-sm font-semibold">Open Electives</span>
              </div>
              <p className="text-2xl font-bold text-[#F9DD4A]">{totalOpen}</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">Liberal Studies</span>
              </div>
              <p className="text-lg font-bold text-[#F9DD4A]">
                {totalLowerLib + totalUpperLib}
                <span className="text-xs ml-1">
                  ({totalLowerLib}L + {totalUpperLib}U)
                </span>
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">Other</span>
              </div>
              <p className="text-2xl font-bold text-[#F9DD4A]">{other}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
