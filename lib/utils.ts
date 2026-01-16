import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Helpers ---

export const parseDurationToSeconds = (
  durationStr: string | undefined
): number => {
  if (!durationStr || typeof durationStr !== "string") return 0;

  // Case 1: Decimal Hours (e.g., "98.33")
  if (!durationStr.includes(":") && !isNaN(parseFloat(durationStr))) {
    return parseFloat(durationStr) * 3600;
  }

  // Case 2: Time Format (e.g., "5 days 10:30:05")
  let days = 0;
  let timeStr = durationStr;

  if (durationStr.includes("days")) {
    const parts = durationStr.split(" days ");
    days = parseInt(parts[0], 10);
    timeStr = parts[1].trim();
  }

  const parts = timeStr.split(":");
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts.map(Number);
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};

export const parseFuel = (fuelStr: string | undefined) => {
  if (!fuelStr || typeof fuelStr !== "string") return 0;
  return parseFloat(fuelStr.replace(/[^\d.-]/g, ""));
};

// --- Updated Processor ---
export const processSummaryData = (tables: any[], unitName: string) => {
  // 1. Get "Engine Hours" (Numerator)
  const sensorsTable = tables.find(
    (t: any) => t.tableName === "Digital sensors"
  );
  const sensorRow = sensorsTable?.data?.find(
    (r: any) => r.col_1 === "Total" || r.col_0 === "1"
  );
  const engineHoursSeconds = sensorRow
    ? parseDurationToSeconds(sensorRow.duration)
    : 0;

  // 2. Get "Total Duration", "Fuel", "Avg Fuel"
  const engineTable = tables.find(
    (t: any) =>
      t.tableName === "Engine hours" &&
      t.data?.some((r: any) => r.col_0 === "Total")
  );

  const summaryRow = engineTable?.data?.find((r: any) => r.col_0 === "Total");

  const totalDurationSeconds = summaryRow
    ? parseDurationToSeconds(summaryRow.duration)
    : 0;
  const fuelConsumption = summaryRow
    ? parseFuel(summaryRow.fuel_consumption_all)
    : 0;
  const avgFuelConsumption = summaryRow
    ? parseFuel(summaryRow.avg_fuel_consumption_all)
    : 0;

  // 3. Calculate Idle Hours
  const idleHoursSeconds = Math.max(
    0,
    totalDurationSeconds - engineHoursSeconds
  );

  return {
    id: unitName,
    machineName: unitName,
    totalDurationSeconds,
    engineHoursSeconds,
    idleHoursSeconds, // New Field
    fuelConsumption,
    avgFuelConsumption,
  };
};
