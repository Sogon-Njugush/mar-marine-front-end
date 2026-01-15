import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Report Parsing Helpers ---

// Convert "9 days 15:42:02" or "0:16:11" to total seconds
export const parseDurationToSeconds = (durationStr: string | undefined) => {
  if (!durationStr || typeof durationStr !== "string") return 0;

  let days = 0;
  let timeStr = durationStr;

  if (durationStr.includes("days")) {
    const parts = durationStr.split(" days ");
    days = parseInt(parts[0], 10);
    timeStr = parts[1].trim();
  }

  const parts = timeStr.split(":");
  if (parts.length !== 3) return 0; // Safety check

  const [hours, minutes, seconds] = parts.map(Number);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
};

// Convert seconds back to "HH:mm:ss"
export const formatSecondsToTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

// Parse "664.00 l" to number 664.00
export const parseFuel = (fuelStr: string | undefined) => {
  if (!fuelStr || typeof fuelStr !== "string") return 0;
  return parseFloat(fuelStr.replace(/[^\d.-]/g, ""));
};

// Group raw API rows by Date
export const processReportData = (rows: any[], machineName: string) => {
  const grouped: Record<string, any> = {};

  rows.forEach((row) => {
    // FIX: Skip rows that don't have a valid time string (e.g., Total rows)
    if (!row.time_begin || typeof row.time_begin !== "string") {
      return;
    }

    // Extract date "16.12.2025" from "16.12.2025 08:06:52"
    const dateKey = row.time_begin.split(" ")[0];

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        machineName: machineName,
        engineHoursSeconds: 0,
        idleTimeSeconds: 0,
        moveTimeSeconds: 0,
        fuelConsumption: 0,
      };
    }

    grouped[dateKey].engineHoursSeconds += parseDurationToSeconds(row.duration);
    grouped[dateKey].idleTimeSeconds += parseDurationToSeconds(
      row.duration_stay
    );
    grouped[dateKey].moveTimeSeconds += parseDurationToSeconds(
      row.duration_move
    );

    const fuelStart = parseFuel(row.fuel_level_begin);
    const fuelEnd = parseFuel(row.fuel_level_end);

    // Only add positive consumption
    grouped[dateKey].fuelConsumption += Math.max(0, fuelStart - fuelEnd);
  });

  return Object.values(grouped).sort((a, b) => {
    const [d1, m1, y1] = a.date.split(".");
    const [d2, m2, y2] = b.date.split(".");
    return (
      new Date(`${y1}-${m1}-${d1}`).getTime() -
      new Date(`${y2}-${m2}-${d2}`).getTime()
    );
  });
};
