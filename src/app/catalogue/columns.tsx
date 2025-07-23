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
            return (
                <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-secondary text-black hover:bg-secondary/80 p-2 text-sm font-semibold">
                        {code}
                    </Badge>
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
                if (t.toLowerCase() === "fall") return "bg-secondary text-black";
                if (t.toLowerCase() === "winter") return "bg-accent text-black";
                return "bg-primary/20 text-white";
            };

            return (
                <div className="flex justify-center items-center gap-2 w-full">
                    {terms.map((t, i) => (
                        <Badge
                            key={i}
                            className={getBadgeClass(t) + " hover:opacity-80"}
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
        header: "Prerequisites"
    },
]