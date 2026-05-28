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
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import search from "@/assets/search.png"
import PopUp from "@/components/course-popup"
import Image from "next/image"
import type { Course } from "@/types/course"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    topContent?: React.ReactNode
    belowSearchContent?: React.ReactNode
}

function termBadgeClass(t: string) {
    const l = t.toLowerCase()
    if (l === "fall") return "bg-secondary text-background"
    if (l === "winter") return "bg-borders text-background"
    return "bg-primary/80 text-white"
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

    const openCourse = (rowData: any) => {
        setPopupRowData(rowData);
        setShowPopup(true);
    };

    return (
        <div className="flex flex-col items-center text-center bg-background w-full">
            <div className="flex flex-col items-center text-center bg-background w-full">
                <div className="flex justify-center items-center w-full mt-4 sm:mt-5 mb-4 sm:mb-5 px-2 sm:px-0">
                <div className="
                    flex flex-col md:flex-row flex-wrap
                    gap-3 md:gap-6
                    w-full max-w-6xl items-center
                ">
                    {/* Search input section */}
                    <div className="relative flex-grow min-w-0 w-full md:w-auto">
                    <Image
                        src={search}
                        alt="Search"
                        width={20}
                        height={20}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
                    />
                    <Input
                        className="pl-12 text-foreground bg-background border-secondary w-full font-semibold h-12 border-2 text-base"
                        placeholder="Search by code or name..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                    </div>
                    {/* Filter section */}
                    <div className="flex-shrink-0 w-full md:w-auto md:min-w-[180px]">
                    {topContent}
                    </div>
                </div>
                </div>
            </div>


            {belowSearchContent}

            {/* Mobile card list (below md) */}
            <div className="md:hidden w-full px-2">
                <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const c = row.original as Course
                            const rawTerm = (c as any).term
                            const termArr: string[] = Array.isArray(rawTerm)
                                ? rawTerm
                                : (typeof rawTerm === "string" ? (rawTerm.match(/([A-Z][a-z]+)/g) || [rawTerm]) : [])
                            const liberal = (c as any).liberal
                            return (
                                <button
                                    key={row.id}
                                    onClick={() => openCourse(row.original)}
                                    className="flex items-center gap-3 w-full text-left bg-card-bg border-2 border-secondary/40 rounded-xl p-3 active:scale-[0.99] transition-transform hover:border-secondary hover:bg-card-hover"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <Badge className="bg-foreground text-background text-[11px] font-semibold">
                                                {c.code}
                                            </Badge>
                                            {liberal && liberal !== "None" && (
                                                <Badge className="bg-primary/80 text-white text-[10px]">
                                                    {liberal === "UL" ? "Upper Lib" : liberal === "LL" ? "Lower Lib" : liberal}
                                                </Badge>
                                            )}
                                            {termArr.map((t, i) => (
                                                <Badge key={i} className={`${termBadgeClass(t)} text-[10px]`}>
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                        <p className="text-sm font-semibold text-foreground line-clamp-2 break-words">
                                            {c.name}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted shrink-0" />
                                </button>
                            )
                        })
                    ) : (
                        <div className="py-10 text-center text-red-500 text-base font-semibold">
                            No results.
                        </div>
                    )}
                </div>
            </div>

            {/* Tablet+ table (md+) */}
            <div className="hidden md:block w-full overflow-x-auto px-2">
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
            <div className="flex items-center justify-center gap-3 py-4 mt-5 w-full max-w-7xl px-3">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    table.previousPage();
                    scrollToTop();
                }}
                disabled={!table.getCanPreviousPage()}
                className="border-foreground/20 text-foreground hover:bg-primary/20 hover:cursor-pointer bg-card-bg font-[700] transition-all duration-200 hover:scale-105 shadow-md h-11 px-5 flex-1 sm:flex-none"
                >
                    Previous
                </Button>
                <p className="text-sm font-semibold text-foreground tabular-nums min-w-[3rem] text-center">
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
                className="border-foreground/20 text-foreground hover:bg-primary/20 hover:cursor-pointer bg-card-bg font-[700] transition-all duration-200 hover:scale-105 shadow-md h-11 px-5 flex-1 sm:flex-none"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
