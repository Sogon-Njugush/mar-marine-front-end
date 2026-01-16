"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types ---
export type SummaryStat = {
  id: string;
  machineName: string;
  totalDurationSeconds: number;
  engineHoursSeconds: number;
  idleHoursSeconds: number; // New Type
  fuelConsumption: number;
  avgFuelConsumption: number;
};

// --- Column Definitions ---
export const columns: ColumnDef<SummaryStat>[] = [
  // 1. Machine Name
  {
    accessorKey: "machineName",
    header: () => <div className="text-center">Machine Name</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium min-w-[150px]">
        {row.getValue("machineName")}
      </div>
    ),
  },
  // 2. Total Fuel
  {
    accessorKey: "fuelConsumption",
    header: () => <div className="text-center">Total Fuel (L)</div>,
    cell: ({ row }) => {
      const val = row.getValue("fuelConsumption") as number;
      return <div className="text-center font-medium">{val.toFixed(2)}</div>;
    },
  },
  // 3. Avg Fuel
  {
    accessorKey: "avgFuelConsumption",
    header: () => <div className="text-center">Avg Fuel (L/h)</div>,
    cell: ({ row }) => {
      const val = row.getValue("avgFuelConsumption") as number;
      return <div className="text-center font-medium">{val.toFixed(2)}</div>;
    },
  },
  // 4. Duration
  {
    accessorKey: "totalDurationSeconds",
    header: () => <div className="text-center">Eng Hours (h)</div>,
    cell: ({ row }) => {
      const val = row.getValue("totalDurationSeconds") as number;
      const hours = (val / 3600).toFixed(2);
      return <div className="text-center font-mono">{hours}</div>;
    },
  },
  // 5. Eng Hours
  {
    accessorKey: "engineHoursSeconds",
    header: () => <div className="text-center">Duration (h)</div>,
    cell: ({ row }) => {
      const val = row.getValue("engineHoursSeconds") as number;
      const hours = (val / 3600).toFixed(2);
      return <div className="text-center font-mono">{hours}</div>;
    },
  },
  // 6. Idle Hours (New Column)
  {
    accessorKey: "idleHoursSeconds",
    header: () => <div className="text-center">Idle Hours (h)</div>,
    cell: ({ row }) => {
      const val = row.getValue("idleHoursSeconds") as number;
      const hours = (val / 3600).toFixed(2);
      return (
        <div className="text-center font-mono text-yellow-600 dark:text-yellow-500">
          {hours}
        </div>
      );
    },
  },
  // 7. Productivity
  {
    id: "productivity",
    header: () => <div className="text-center">Productivity</div>,
    cell: ({ row }) => {
      const engineSeconds = row.original.engineHoursSeconds;
      const totalSeconds = row.original.totalDurationSeconds;

      let productivity = 0;
      if (totalSeconds > 0) {
        productivity = (engineSeconds / totalSeconds) * 100;
      }

      return (
        <div
          className={`text-center font-bold ${
            productivity < 50 ? "text-red-500" : "text-green-600"
          }`}
        >
          {productivity.toFixed(2)}%
        </div>
      );
    },
  },
];

interface ReportTableProps {
  data: SummaryStat | null;
}

export function ReportTable({ data }: ReportTableProps) {
  const tableData = React.useMemo(() => (data ? [data] : []), [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data) return null;

  return (
    <div className="rounded-md border bg-card w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center bg-muted/50">
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
