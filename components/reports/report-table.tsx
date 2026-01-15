"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { formatSecondsToTime } from "@/lib/utils";

// --- Types ---
export type DailyStat = {
  date: string;
  machineName: string;
  engineHoursSeconds: number;
  idleTimeSeconds: number;
  moveTimeSeconds: number;
  fuelConsumption: number;
};

// --- Column Definitions ---
export const columns: ColumnDef<DailyStat>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium whitespace-nowrap">
        {row.getValue("date")}
      </div>
    ),
  },
  {
    accessorKey: "machineName",
    header: () => <div className="text-center">Machine Name</div>,
    cell: ({ row }) => (
      // Removed fixed width truncation to allow dynamic resizing
      <div className="text-center min-w-[120px]">
        {row.getValue("machineName")}
      </div>
    ),
  },
  {
    accessorKey: "engineHoursSeconds",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Engine Hours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const val = row.getValue("engineHoursSeconds") as number;
      return (
        <div className="text-center font-mono whitespace-nowrap">
          {formatSecondsToTime(val)}
        </div>
      );
    },
  },
  {
    accessorKey: "idleTimeSeconds",
    header: () => <div className="text-center">Idle Time</div>,
    cell: ({ row }) => {
      const val = row.getValue("idleTimeSeconds") as number;
      return (
        <div className="text-center font-mono whitespace-nowrap text-yellow-600 dark:text-yellow-500">
          {formatSecondsToTime(val)}
        </div>
      );
    },
  },
  {
    id: "productivity",
    header: () => <div className="text-center">Productivity</div>,
    cell: ({ row }) => {
      const engine = row.original.engineHoursSeconds;
      const move = row.original.moveTimeSeconds;
      const productivity = engine > 0 ? (move / engine) * 100 : 0;

      return (
        <div
          className={`text-center ${
            productivity < 10 ? "text-red-500 font-bold" : ""
          }`}
        >
          {productivity.toFixed(2)}%
        </div>
      );
    },
  },
  {
    accessorKey: "fuelConsumption",
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fuel Consumption (L)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const val = row.getValue("fuelConsumption") as number;
      return <div className="text-center font-medium">{val.toFixed(2)} </div>;
    },
  },
];

interface ReportTableProps {
  data: DailyStat[];
}

export function ReportTable({ data }: ReportTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  if (data.length === 0) return null;

  // Calculate Totals for Footer
  const totalEngine = data.reduce(
    (acc, curr) => acc + curr.engineHoursSeconds,
    0
  );
  const totalIdle = data.reduce((acc, curr) => acc + curr.idleTimeSeconds, 0);
  const totalFuel = data.reduce((acc, curr) => acc + curr.fuelConsumption, 0);

  return (
    <div className="space-y-4 w-full">
      {/* Search Input */}
      <div className="flex items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dates..."
            value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("date")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-card w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Footer with Totals */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-bold text-center">
                Total (All Pages)
              </TableCell>
              <TableCell className="text-center font-bold font-mono">
                {formatSecondsToTime(totalEngine)}
              </TableCell>
              <TableCell className="text-center font-bold font-mono">
                {formatSecondsToTime(totalIdle)}
              </TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center font-bold">
                {totalFuel.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
