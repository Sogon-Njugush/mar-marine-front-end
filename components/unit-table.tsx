"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query"; // Changed from useSuspenseQuery
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Types
type WialonUnit = { id: number; name: string };
type ApiResponse = { statusCode: number; message: string; data: WialonUnit[] };

const fetchUnits = async (): Promise<ApiResponse> => {
  const res = await fetch("/api/wialon/units"); // Call client-side relative URL
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function UnitsDataTable({
  initialData,
}: {
  initialData: WialonUnit[];
}) {
  const [search, setSearch] = useState("");

  // Use standard useQuery with initialData
  const { data } = useQuery({
    queryKey: ["units"],
    queryFn: fetchUnits,
    // This uses the server data immediately, then polls every 5s
    initialData: { statusCode: 200, message: "Initial", data: initialData },
    refetchInterval: 5000,
  });

  const units = data?.data || [];

  // Filter Logic
  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(search.toLowerCase()) ||
      unit.id.toString().includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell>{unit.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
