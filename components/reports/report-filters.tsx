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

type Unit = { id: number; name: string };

interface ReportFiltersProps {
  units: Unit[];
  selectedUnitId: string;
  onUnitChange: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function ReportFilters({
  units,
  selectedUnitId,
  onUnitChange,
  onGenerate,
  isLoading,
}: ReportFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Report Generator</CardTitle>
        <CardDescription>
          Select a unit to calculate Engine Hours, Idle Time, and Fuel
          Consumption.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Select value={selectedUnitId} onValueChange={onUnitChange}>
            <SelectTrigger>
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
        <Button
          onClick={onGenerate}
          disabled={!selectedUnitId || isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
}
