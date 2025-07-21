"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from 'next/navigation'

interface ProgramSelectorProps {
  programs: string[]
  selectedPrograms: string[]
  onProgramToggle?: (program: string) => void
  onClearSelection?: () => void
}

export function ProgramSelector({ programs, selectedPrograms, onProgramToggle, onClearSelection }: ProgramSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleProgramToggle = (program: string) => {
    if (onProgramToggle) {
      // Use callback for Supabase version
      onProgramToggle(program);
    } else {
      // Use URL navigation for API version
      const params = new URLSearchParams(searchParams)
      let updatedPrograms: string[]
      
      if (selectedPrograms.includes(program)) {
        // Remove program from selection
        updatedPrograms = selectedPrograms.filter(p => p !== program)
      } else {
        // Add program to selection
        updatedPrograms = [...selectedPrograms, program]
      }
      
      if (updatedPrograms.length > 0) {
        params.set('programs', updatedPrograms.join(','))
      } else {
        params.delete('programs')
      }
      
      router.push(`/catalogue?${params.toString()}`)
    }
  }

  const handleClearSelection = () => {
    if (onClearSelection) {
      // Use callback for Supabase version
      onClearSelection();
    } else {
      // Use URL navigation for API version
      const params = new URLSearchParams(searchParams)
      params.delete('programs')
      router.push(`/catalogue?${params.toString()}`)
    }
  }

  return (
    <Card className="mb-6 bg-black/30 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Select Program</CardTitle>
        <CardDescription className="text-gray-300">
          Choose one or more programs to view their courses. Click badges to add/remove programs from your selection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedPrograms.length === 0 ? "default" : "outline"}
            className={`cursor-pointer transition-colors border ${
              selectedPrograms.length === 0
                ? "bg-[#3375C2] text-white hover:bg-[#3375C2]/80 border-[#3375C2]" 
                : "bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
            }`}
            onClick={handleClearSelection}
          >
            All Programs
          </Badge>
          {programs.map((program) => (
            <Badge
              key={program}
              variant={selectedPrograms.includes(program) ? "default" : "outline"}
              className={`cursor-pointer transition-colors border ${
                selectedPrograms.includes(program)
                  ? "bg-[#3375C2] text-white hover:bg-[#3375C2]/80 border-[#3375C2]"
                  : "bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500"
              }`}
              onClick={() => handleProgramToggle(program)}
            >
              {program}
            </Badge>
          ))}
        </div>
        {selectedPrograms.length > 0 && (
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
            <p className="text-sm text-blue-200">
              <span className="font-semibold">Showing courses for:</span>{" "}
              {selectedPrograms.length === 1 
                ? selectedPrograms[0]
                : `${selectedPrograms.length} programs (${selectedPrograms.join(", ")})`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
