"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Unit = { id: number; name: string };

// --- FIXED INTERFACE ---
interface ReportFiltersProps {
  units: Unit[];
  selectedUnitId: string;
  onUnitChange: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  // New props added here:
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
}

export function ReportFilters({
  units,
  selectedUnitId,
  onUnitChange,
  onGenerate,
  isLoading,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: ReportFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Report Generator</CardTitle>
        <CardDescription>
          Select a unit and date range to calculate Engine Hours, Fuel, and
          Productivity.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col xl:flex-row gap-4 items-end">
        {/* Unit Selector */}
        <div className="grid w-full max-w-xs items-center gap-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Select value={selectedUnitId} onValueChange={onUnitChange}>
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="grid w-full max-w-xs items-center gap-1.5">
          <Label htmlFor="from">From Date</Label>
          <Input
            id="from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="grid w-full max-w-xs items-center gap-1.5">
          <Label htmlFor="to">To Date</Label>
          <Input
            id="to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Submit */}
        <Button
          onClick={onGenerate}
          disabled={!selectedUnitId || !dateFrom || !dateTo || isLoading}
          className="w-full xl:w-auto"
        >
          {isLoading ? "Fetching..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
}
