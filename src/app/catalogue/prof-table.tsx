"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
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
import Image from "next/image"
import search from "@/assets/search.png"
import ProfPopUp from "@/components/prof-popup"
import type { Professor } from "./prof_columns"

function ratingColor(r: number) {
  if (isNaN(r)) return "bg-gray-300 text-gray-800"
  if (r >= 4.0) return "bg-green-500 text-white"
  if (r >= 3.0) return "bg-yellow-400 text-black"
  if (r > 0) return "bg-red-500 text-white"
  return "bg-gray-300 text-gray-800"
}
function difficultyColor(d: number) {
  if (isNaN(d)) return "bg-gray-300 text-gray-800"
  if (d <= 2.0) return "bg-green-500 text-white"
  if (d <= 3.5) return "bg-yellow-400 text-black"
  return "bg-red-500 text-white"
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  topContent?: React.ReactNode
  belowSearchContent?: React.ReactNode
}

export function ProfessorDataTable<TData, TValue>({
  columns,
  data,
  topContent,
  belowSearchContent
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [showPopup, setShowPopup] = React.useState(false)
  const [popupRowData, setPopupRowData] = React.useState<any>(null)
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 })

  const [minRating, setMinRating] = React.useState(0)
  const [maxDiff, setMaxDiff] = React.useState(5)

  const filteredData = React.useMemo(() => {
    return data.filter((row: any) => {
      const r = Number.parseFloat(row?.avg_rating ?? "0")
      const d = Number.parseFloat(row?.avg_difficulty ?? "0")
      return (Number.isFinite(r) && r >= minRating) && (Number.isFinite(d) && d <= maxDiff)
    })
  }, [data, minRating, maxDiff])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const firstName = (row.getValue("first_name") as string)?.toLowerCase() ?? ""
      const lastName = ((row.original as Professor)?.last_name ?? "").toLowerCase()
      const searchValue = (filterValue as string).toLowerCase().replace(/\s+/g, "")
      const fullName = (firstName + lastName).replace(/\s+/g, "")
      return firstName.includes(searchValue) || lastName.includes(searchValue) || fullName.includes(searchValue)
    },
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()

  const scrollToTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 200, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col items-center text-center bg-background">
      <div className="flex flex-col items-center text-center w-full">
        <div className="flex justify-center items-center w-full mt-5 mb-5">
          <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 w-full max-w-6xl items-center">
            <div className="relative flex-grow min-w-[200px] w-full md:w-auto">
              <Image
                src={search}
                alt="Search"
                width={20}
                height={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
              />
              <Input
                className="pl-12 text-foreground bg-background border-secondary w-full font-semibold h-10 border-2"
                placeholder="Search professors by name..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
            </div>
            <div className="flex-shrink-0 min-w-[180px] w-full md:w-auto">
              {topContent}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="w-full flex flex-col items-stretch">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm md:text-base font-semibold text-foreground">
                  Min Avg Rating
                </label>
                <span className="text-[10px] sm:text-xs md:text-sm text-muted font-semibold tabular-nums">
                  {minRating.toFixed(1)}
                </span>
              </div>
              <Slider
                aria-label="Minimum average rating"
                className="w-full max-w-full touch-pan-x select-none sm:py-0 py-1 cursor-pointer"
                min={0}
                max={5}
                step={0.1}
                value={[minRating]}
                onValueChange={(v) => setMinRating(v[0])}
              />
              <div className="flex justify-between text-[9px] sm:text-[10px] text-muted mt-1">
                <span>0.0</span><span>5.0</span>
              </div>
            </div>

            <div className="w-full flex flex-col items-stretch">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm md:text-base font-semibold text-foreground">
                  Max Avg Difficulty
                </label>
                <span className="text-[10px] sm:text-xs md:text-sm text-muted font-semibold tabular-nums">
                  {maxDiff.toFixed(1)}
                </span>
              </div>
              <Slider
                aria-label="Maximum average difficulty"
                className="w-full max-w-full touch-pan-x select-none sm:py-0 py-1 cursor-pointer"
                min={1}
                max={5}
                step={0.1}
                value={[maxDiff]}
                onValueChange={(v) => setMaxDiff(v[0])}
              />
              <div className="flex justify-between text-[9px] sm:text-[10px] text-muted mt-1">
                <span>1.0</span><span>5.0</span>
              </div>
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
              const p = row.original as Professor & { courses_taught?: string[] }
              const rating = parseFloat(p.avg_rating)
              const diff = parseFloat(p.avg_difficulty)
              const courses = (p as any).courses_taught as string[] | undefined
              return (
                <button
                  key={row.id}
                  onClick={() => { setPopupRowData(row.original); setShowPopup(true) }}
                  className="flex items-center gap-3 w-full text-left bg-card-bg border-2 border-secondary/40 rounded-xl p-3 active:scale-[0.99] transition-transform hover:border-secondary hover:bg-card-hover"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-xs text-muted truncate mb-2">{p.department || "—"}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className={`${ratingColor(rating)} text-[10px]`}>
                        ★ {isNaN(rating) ? "N/A" : rating.toFixed(2)}
                      </Badge>
                      <Badge className={`${difficultyColor(diff)} text-[10px]`}>
                        Diff {isNaN(diff) ? "N/A" : diff.toFixed(2)}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                        {p.num_ratings ?? 0} reviews
                      </Badge>
                      {courses && courses.length > 0 && (
                        <Badge className="bg-muted/20 text-foreground text-[10px]">
                          {courses.length} course{courses.length === 1 ? "" : "s"}
                        </Badge>
                      )}
                    </div>
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

      <div className="hidden md:block w-full overflow-x-auto px-2">
        <div className="rounded-md text-foreground bg-background border-4 border-secondary p-2 sm:p-3 md:p-5 w-full max-w-7xl mx-auto">
          <Table className="min-w-[360px] xl:min-w-[900px] w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const colId = header.column.id
                    const alwaysShow = ["first_name", "avg_rating", "avg_difficulty"]
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
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-foreground/10 hover:bg-primary/10 hover:cursor-pointer transition-all"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest(".no-popup")) return
                      setPopupRowData(row.original)
                      setShowPopup(true)
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const colId = cell.column.id
                      const alwaysShow = ["first_name", "avg_rating", "avg_difficulty"]
                      return (
                        <TableCell
                          key={cell.id}
                          className={`
                            text-foreground text-[10px] sm:text-xs xl:text-sm
                            p-1 sm:p-2 xl:p-3
                            align-middle text-center
                            whitespace-nowrap overflow-hidden text-ellipsis
                            max-w-[9rem] sm:max-w-[12rem] xl:max-w-[16rem]
                            ${!alwaysShow.includes(colId) ? "hidden xl:table-cell" : ""}
                          `}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-red-500 text-base">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 py-4 mt-5 w-full max-w-7xl px-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => { table.previousPage(); scrollToTop() }}
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
          onClick={() => { table.nextPage(); scrollToTop() }}
          disabled={!table.getCanNextPage()}
          className="border-foreground/20 text-foreground hover:bg-primary/20 hover:cursor-pointer bg-card-bg font-[700] transition-all duration-200 hover:scale-105 shadow-md h-11 px-5 flex-1 sm:flex-none"
        >
          Next
        </Button>
      </div>

      <ProfPopUp open={showPopup} prof={popupRowData} onClose={() => setShowPopup(false)} />
    </div>
  )
}
