"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, BookOpen } from 'lucide-react';

interface ProgramSelectorProps {
  programs: string[];
  selectedProgram: string;
  onProgramSelect: (program: string) => void;
}

export default function ProgramSelector({ 
  programs, 
  selectedProgram, 
  onProgramSelect 
}: ProgramSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPrograms = programs.filter(program =>
    program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProgramSelect = (program: string) => {
    onProgramSelect(program);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <Card className="bg-black/90 border-gray-700 p-2 backdrop-blur-sm items-center gap-1">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-[#F9DD4A]" />
          <h3 className="text-white font-semibold">Select Program</h3>
        </div>
        
        <div className="p-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#F9DD4A]"
            />
          </div>

          {/* Current Selection */}
          {selectedProgram && (
            <div className="p-3 bg-[#3375C2]/20 border border-[#3375C2]/50 rounded-lg mt-5">
              <p className="text-sm text-gray-300 mb-1">Current Program:</p>
              <p className="text-white font-medium text-sm">{selectedProgram}</p>
            </div>
          )}

          {/* Program List */}
          {(isOpen || searchTerm) && (
            <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <button
                    key={program}
                    onClick={() => handleProgramSelect(program)}
                    className={`w-full text-left p-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 ${
                      selectedProgram === program 
                        ? 'bg-[#3375C2]/30 border-l-4 border-l-[#F9DD4A]' 
                        : ''
                    }`}
                  >
                    <span className="text-white text-sm block truncate">{program}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-gray-400 text-sm">
                  No programs found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}

          {/* Quick Close */}
          {isOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Close
            </Button>
          )}
        </div>
      </Card>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
