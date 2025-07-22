"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export type Course = {
    code: string
    name: string
    description: string
    "weekly contact": string
    "gpa weight": string
    "billing unit": string
    "course count": string
    prerequisites: string
    corequisites: string
    antirequisites: string
    "custom requisites": string
    liberal: string
}


export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "code",
        header: "Course Code",
        cell: ({ row }) => {
            const code = row.getValue("code") as string
            const description = row.original?.description || "No description available"
            return (
                <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-secondary text-black hover:bg-secondary/80 p-2 text-sm font-semibold">
                        {code}
                    </Badge>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Info className="h-10 w-5 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 bg-white border shadow-lg">
                            <Card className="bg-white border-0">
                                <CardHeader className="bg-white">
                                    <CardTitle className="text-gray-900">{code}</CardTitle>
                                </CardHeader>
                                <CardContent className="bg-white">
                                    <CardDescription className="text-sm text-gray-700">
                                        {description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </PopoverContent>
                    </Popover>
                </div>
            )
        }
    },
    {
        accessorKey: "name",
        header: "Course Name"
    },
    {
        accessorKey: "gpa weight",
        header: "GPA Weight",
         cell: ({ row }) => {
            const gpa = row.getValue("gpa weight") as string
            return (
                <Badge className="bg-[#3375C2] text-white hover:bg-[#3375C2]/80">
                    {gpa}
                </Badge>
            )
         }
    },
    {
        accessorKey: "prerequisites",
        header: "Prerequisites"
    },
]