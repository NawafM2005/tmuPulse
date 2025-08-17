"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"


export type Professor = {
    rmf_id: string;
    legacy_id: number;
    first_name: string;
    last_name: string;
    department: string;
    avg_rating: string;
    num_ratings: number;
    would_take_again_percent: string;
    avg_difficulty: string;
};



export const professorColumns: ColumnDef<Professor>[] = [
    {
        accessorKey: "first_name",
        header: "Name",
        cell: ({ row }) => {
            const first = row.getValue("first_name") as string;
            const last = row.original?.last_name || "";
            return (
                <span className="font-medium">{first} {last}</span>
            );
        },
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <Badge className="bg-primary/80 text-white px-2 py-1 text-xs font-semibold">
                {row.getValue("department")}
            </Badge>
        ),
    },
    {
        accessorKey: "avg_rating",
        header: "Avg. Rating",
        cell: ({ row }) => {
            const rating = parseFloat(row.getValue("avg_rating") as string);
            let color = "bg-gray-300 text-gray-800";
            if (!isNaN(rating)) {
                if (rating >= 4.0) color = "bg-green-500 text-white";
                else if (rating >= 3.0) color = "bg-yellow-400 text-black";
                else if (rating > 0) color = "bg-red-500 text-white";
            }
            return (
                <Badge className={`${color} px-2 py-1 text-xs font-semibold`}>
                    {isNaN(rating) ? "N/A" : rating.toFixed(2)}
                </Badge>
            );
        },
    },
    {
        accessorKey: "num_ratings",
        header: "# Reviews",
        cell: ({ row }) => {
            const num = row.getValue("num_ratings") as number;

            if (!num || num === 0) {
                return (
                    <span className="text-xs text-gray-400 italic">
                        No ratings
                    </span>
                );
            }

            let color = "bg-gray-200 text-gray-800";
            if (num >= 100) color = "bg-green-500 text-white";
            else if (num >= 50) color = "bg-blue-500 text-white";
            else if (num >= 20) color = "bg-yellow-400 text-black";
            else color = "bg-red-400 text-white";

            return (
                <Badge
                    className={`${color} px-2 py-1 text-xs font-semibold rounded-md shadow-sm`}
                >
                    {num}
                </Badge>
            );
        },
    },
    {
        accessorKey: "courses_taught",
        header: "Courses Taught",
        cell: ({ row }) => {
            const courses = row.getValue("courses_taught") as string[] | null;

            if (!courses || courses.length === 0) {
                return (
                    <span className="text-xs text-gray-500 italic">
                        No courses listed
                    </span>
                );
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {courses.slice(0, 5).map((course) => (
                        <Badge
                            key={course}
                            className="bg-blue-100 text-blue-800 rounded-md px-2 py-0.5 text-xs font-medium shadow-sm"
                        >
                            {course}
                        </Badge>
                    ))}

                    {courses.length > 5 && (
                        <span className="text-xs text-gray-500 ml-1">
                            +{courses.length - 5} more
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "avg_difficulty",
        header: "Avg. Difficulty",
        cell: ({ row }) => {
            const diff = parseFloat(row.getValue("avg_difficulty") as string);
            let color = "bg-gray-300 text-gray-800";
            if (!isNaN(diff)) {
                if (diff <= 2.0) color = "bg-green-500 text-white";
                else if (diff <= 3.5) color = "bg-yellow-400 text-black";
                else color = "bg-red-500 text-white";
            }
            return (
                <Badge className={`${color} px-2 py-1 text-xs font-semibold`}>
                    {isNaN(diff) ? "N/A" : diff.toFixed(2)}
                </Badge>
            );
        },
    },
];