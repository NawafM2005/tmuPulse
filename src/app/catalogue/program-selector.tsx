"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from 'next/navigation'

interface ProgramSelectorProps {
  programs: string[]
  label?: string
  selectedPrograms: string[]
  onProgramToggle?: (program: string) => void
  onClearSelection?: () => void
}

export function ProgramSelector({ label = "Programs", programs, selectedPrograms, onProgramToggle, onClearSelection }: ProgramSelectorProps) {
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

  const getButtonText = () => {
    if (selectedPrograms.length === 0) {
      return `${label}`
    } else if (selectedPrograms.length === 1) {
      return `${selectedPrograms[0]}`
    } else {
      return `${selectedPrograms.length} ${label} Selected`
    }
  }


  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-black/30 border-secondary border-1 text-white hover:bg-gray-800 hover:text-white hover:cursor-pointer p-5 w-full max-w-sm min-w-[200px]"
          >
            {getButtonText()}
            <ChevronDown className="ml-2 h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border-accent border-1 max-h-80 overflow-y-auto" side="bottom">
          <DropdownMenuLabel className="text-gray-300">{`Select ${label}`}</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          {programs.map((program) => (
            <DropdownMenuCheckboxItem
              key={program}
              checked={selectedPrograms.includes(program)}
              onCheckedChange={() => handleProgramToggle(program)}
              className="text-white hover:bg-gray-800 focus:bg-gray-800 hover:cursor-pointer"
            >
              {program}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedPrograms.length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuCheckboxItem
                checked={false}
                onCheckedChange={handleClearSelection}
                className="text-gray-400 hover:bg-gray-800 focus:bg-gray-800"
              >
                Clear All
              </DropdownMenuCheckboxItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
