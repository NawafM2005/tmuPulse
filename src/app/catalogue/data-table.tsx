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


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState("")
    
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
            
            return code.toLowerCase().includes(searchValue) || 
                   name.toLowerCase().includes(searchValue)
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                placeholder="Search courses by code or name..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm bg-black/30 border-gray-700 text-white placeholder:text-gray-400"
                />
            </div>
            <div className="rounded-md border border-gray-700 bg-black/20">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-800/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-gray-300">
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
                                    className="border-gray-700 hover:bg-gray-800/30"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-white">
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
                                    className="h-24 text-center text-gray-400"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-700 text-white hover:bg-gray-800"
                >
                    Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-gray-700 text-white hover:bg-gray-800"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}