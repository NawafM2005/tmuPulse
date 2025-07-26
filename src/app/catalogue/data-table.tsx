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
        pageSize: 15,
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
        <div className="flex flex-col items-center text-center">
            <div className="flex justify-center items-center w-full mt-5 mb-5">
                <div className="flex gap-4 w-full max-w-6xl items-center">
                    <div className="relative flex-grow">
                    <img
                        src={search.src}
                        alt="Search"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
                    />
                    <Input
                        className="pl-12 text-secondary bg-black/20 w-full font-semibold h-10 border-1"
                        placeholder="Search courses by code or name..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                    />
                    </div>

                    <div className="flex-shrink-0">
                    {topContent}
                    </div>
                </div>
            </div>

            {belowSearchContent}
            <div className="rounded-md border-1 border-secondary bg-black/50 p-5 w-full max-w-7xl">
                <Table className="table-fixed w-full overflow-hidden">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-red-400">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-secondary text-center font-[600] text-[18px] p-5">
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
                                    className="border-gray-700 hover:bg-gray-800/50 hover:cursor-pointer transition-colors hover:scale-101 font-bold"
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest(".no-popup")) return;
                                        setPopupRowData(row.original);
                                        setShowPopup(true);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-white whitespace-normal break-words max-w-[600px] text-center p-5">
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
                className="border-gray-700 text-white hover:bg-gray-800 hover:cursor-pointer"
                >
                    Previous
                </Button>
                <p className="text-sm font-semibold text-white">
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
                className="border-gray-700 text-white hover:bg-gray-800 hover:cursor-pointer"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}