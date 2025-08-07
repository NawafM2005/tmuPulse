"use client"

import * as React from "react"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
 } from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import search from "@/assets/search.png"
import PopUp from "@/components/course-popup"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    topContent?: React.ReactNode
    belowSearchContent?: React.ReactNode
}

export function DataTable<TData, TValue>({
    columns,
    data,
    topContent,
    belowSearchContent
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [showPopup, setShowPopup] = React.useState(false);
    const [popupRowData, setPopupRowData] = React.useState<any>(null);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    });
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const code = row.getValue("code") as string
            const name = row.getValue("name") as string
            const searchValue = filterValue.toLowerCase()
            
            const codeNoSpaces = code.toLowerCase().replace(/\s+/g, "");
            const nameNoSpaces = name.toLowerCase().replace(/\s+/g, "");
            const searchNoSpaces = searchValue.replace(/\s+/g, "");     

            return codeNoSpaces.includes(searchNoSpaces) ||
                nameNoSpaces.includes(searchNoSpaces);
        },
        state: {
            globalFilter,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
    })

    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount(); 

    const scrollToTop = () => {
        window.scrollTo({ top: 200, behavior: "smooth" });
        };

    return (
        <div className="flex flex-col items-center text-center bg-background">
            <div className="flex flex-col items-center text-center bg-background w-full">
                <div className="flex justify-center items-center w-full mt-5 mb-5">
                <div className="
                    flex flex-col md:flex-row flex-wrap
                    gap-4 md:gap-6
                    w-full max-w-6xl items-center
                ">
                    {/* Search input section */}
                    <div className="relative flex-grow min-w-[200px] w-full md:w-auto">
                    <img
                        src={search.src}
                        alt="Search"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
                    />
                    <Input
                        className="pl-12 text-foreground bg-background border-secondary w-full font-semibold h-10 border-2"
                        placeholder="Search courses by code or name..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                    </div>
                    {/* Filter section */}
                    <div className="flex-shrink-0 min-w-[180px] w-full md:w-auto">
                    {topContent}
                    </div>
                </div>
                </div>
            </div>


            {belowSearchContent}
            <div className="rounded-md text-foreground bg-background border-4 border-secondary p-5 w-full max-w-7xl">
                <Table className="overflow-hidden min-w-full w-full table-auto sm:table-fixed">
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-red-400">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-secondary text-center font-bold text-sm sm:text-lg p-1">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow 
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-foreground/10 hover:bg-primary/10 hover:cursor-pointer transition-all duration-10 hover:scale-[1.01] hover:shadow-md"
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest(".no-popup")) return;
                                        setPopupRowData(row.original);
                                        setShowPopup(true);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-foreground whitespace-normal break-words max-w-[600px] text-center p-5 text-xs sm:text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={columns.length} 
                                    className="h-24 text-center text-red-500 text-lg"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <PopUp open={showPopup} course={popupRowData} onClose={() => setShowPopup(false)}></PopUp>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 mt-5">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    table.previousPage();
                    scrollToTop();
                }}
                disabled={!table.getCanPreviousPage()}
                className="border-foreground/20 text-foreground hover:bg-primary/20 hover:cursor-pointer bg-card-bg font-[700] transition-all duration-200 hover:scale-105 shadow-md"
                >
                    Previous
                </Button>
                <p className="text-sm font-semibold text-foreground">
                    {pageCount === 0 ? "0 / 0" : `${pageIndex + 1} / ${pageCount}`}
                </p>
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    table.nextPage();
                    scrollToTop();
                }}
                disabled={!table.getCanNextPage()}
                className="border-foreground/20 text-foreground hover:bg-primary/20 hover:cursor-pointer bg-card-bg font-[700] transition-all duration-200 hover:scale-105 shadow-md"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}