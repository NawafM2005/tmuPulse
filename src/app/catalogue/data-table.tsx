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
import Image from "next/image"

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
                    <Image
                        src={search}
                        alt="Search"
                        width={20}
                        height={20}
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
            <div className="w-full overflow-x-auto px-2">
                <div className="rounded-md text-foreground bg-background border-4 border-secondary p-2 sm:p-3 md:p-5 w-full max-w-7xl mx-auto">
                    <Table className="min-w-[360px] xl:min-w-[900px] w-full table-fixed">
                        <TableHeader >
                            {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-red-400">
                                {headerGroup.headers.map((header) => {
                                    const colId = header.column.id
                                    const alwaysShow = ["code", "name"]
                                    return (
                                    <TableHead 
                                        key={header.id} 
                                        className={`
                                            text-secondary text-center font-bold 
                                            text-[10px] sm:text-xs xl:text-sm 
                                            p-1 sm:p-2 xl:p-3
                                            ${!alwaysShow.includes(colId) ? "hidden xl:table-cell" : ""}
                                        `}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )})}
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
                                    {row.getVisibleCells().map((cell) => {
                                        const colId = cell.column.id
                                        const alwaysShow = ["code", "name"]
                                        return (
                                        <TableCell 
                                            key={cell.id} 
                                            className={`
                                                text-foreground 
                                                text-[10px] sm:text-xs xl:text-sm
                                                p-1 sm:p-2 xl:p-3
                                                align-middle text-center
                                                whitespace-nowrap overflow-hidden text-ellipsis
                                                max-w-[9rem] sm:max-w-[12rem] xl:max-w-[16rem]
                                                ${!alwaysShow.includes(colId) ? "hidden xl:table-cell" : ""}
                                            `}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    )})}
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
                </div>
            </div>
            <PopUp open={showPopup} course={popupRowData} onClose={() => setShowPopup(false)}></PopUp>
            <div className="flex items-center justify-end gap-2 py-4 mt-5 w-full max-w-7xl px-2">
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