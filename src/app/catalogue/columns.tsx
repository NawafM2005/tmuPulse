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
    term: string[]
}


export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "code",
        header: "Course Code",
        cell: ({ row }) => {
            const code = row.getValue("code") as string
            const description = row.original?.description || "No description available"
            return (
                <div className="flex items-center justify-center gap-2 pl-2">
                    <Badge className="bg-foreground text-background p-1 text-xs sm:text-xs font-semibold">
                        {code}
                    </Badge>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="h-5 w-5 flex items-center justify-center cursor-pointer hidden sm:block">
                                <Info className="no-popup h-5 w-5 text-gray-500 hover:text-secondary transition-colors" />
                            </div>
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
        accessorKey: "term",
        header: "Term",
        cell: ({ row }) => {
            const rawTerm = row.getValue("term");
            const term = rawTerm ? String(rawTerm) : "";
            const terms = term.match(/([A-Z][a-z]+)/g) || [term];

            // Badge color function
            const getBadgeClass = (t: string) => {
                if (t.toLowerCase() === "fall") return "bg-secondary text-background";
                if (t.toLowerCase() === "winter") return "bg-borders text-background";
                return "bg-primary/80 text-white";
            };

            return (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
                    {terms.map((t, i) => (
                        <Badge
                            key={i}
                            className={getBadgeClass(t)}
                        >
                            {t || "N/A"}
                        </Badge>
                    ))}
                </div>
            );
        }

    },
    {
        accessorKey: "prerequisites",
        header: () => (
            <span className="hidden sm:table-cell text-center">Prerequisites</span>
        ),
        cell: ({ row }) => (
            <span className="hidden sm:table-cell text-center break-words whitespace-normal max-w-lg w-full">
                {row.getValue("prerequisites")}
            </span>
        )
    },
]