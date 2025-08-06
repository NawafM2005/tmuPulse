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
    <div className="relative w-xs sm:w-sm mx-auto">
      <Card className="bg-background border-gray-700 p-2 backdrop-blur-sm items-center gap-1 text-foreground w-full">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-foreground" />
          <h3 className="text-foreground font-semibold">Select Program</h3>
        </div>
        
        <div className="p-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="
                pl-12 pr-6 py-3 w-full rounded-2xl 
                bg-white/10 border-0 shadow-lg 
                ring-1 ring-[#3375C2]/30 focus:ring-2 focus:ring-[#F9DD4A]/80 
                text-base text-foreground font-semibold transition-all duration-300
                placeholder:text-foreground
                focus:bg-white/20
                outline-none
                mb-5
                min-w-0
                box-border
              "
              style={{
                boxShadow: "0 6px 24px 0 rgba(50,100,220,0.15)",
                WebkitBackdropFilter: "blur(4px)",
                width: "100%"
              }}
            />

          </div>

          {/* Current Selection */}
          {selectedProgram && (
            <div className="p-3 bg-background border border-[#3375C2]/50 rounded-lg mt-5">
              <p className="text-sm text-foreground mb-1">Current Program:</p>
              <p className="text-foreground font-medium text-sm">{selectedProgram}</p>
            </div>
          )}

          {/* Program List */}
          {(isOpen || searchTerm) && (
            <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg w-full">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <button
                    key={program}
                    onClick={() => handleProgramSelect(program)}
                    className={`w-full text-left p-3 text-foreground bg-background hover:bg-background/50 hover:cursor-pointer transition-colors border-b border-gray-700 last:border-b-0 ${
                      selectedProgram === program
                        ? 'bg-background border-l-4 border-l-[#F9DD4A]'
                        : ''
                    }`}
                  >
                    <span className="text-foreground text-sm block truncate">{program}</span>
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
              className="w-full bg-background border-gray-600 text-foreground hover:bg-gray-600 cursor-pointer"
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
