"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable, SummaryStat } from "@/components/reports/report-table";
import { processSummaryData } from "@/lib/utils";

type Unit = { id: number; name: string };

export default function Page() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<SummaryStat | null>(null);

  // Default date: Today
  const today = new Date().toISOString().split("T")[0];
  const [dateFrom, setDateFrom] = useState<string>(today);
  const [dateTo, setDateTo] = useState<string>(today);

  // 1. Fetch Form Data (Units)
  useEffect(() => {
    async function loadFormData() {
      try {
        const res = await fetch("/api/proxy/form-data");
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        if (json.data && json.data.units) {
          setUnits(json.data.units);
        }
      } catch (error) {
        console.error("Form Data Error:", error);
        toast.error("Could not load vehicle list.");
      }
    }
    loadFormData();
  }, []);

  // 2. Generate Report
  const handleGenerate = async () => {
    if (!selectedUnitId || !dateFrom || !dateTo) {
      toast.error("Please select a unit and date range.");
      return;
    }

    setIsLoading(true);
    setReportData(null);

    try {
      // API Payload matches your request structure
      const payload = {
        resourceId: 29822618,
        templateIds: [1, 3],
        objectId: parseInt(selectedUnitId),
        from: dateFrom,
        to: dateTo,
      };

      const res = await fetch("/api/proxy/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.data?.tables) {
        // Find unit name
        const unitName =
          units.find((u) => u.id.toString() === selectedUnitId)?.name ||
          "Unknown Unit";

        // Process the tables to find specific rows
        const summary = processSummaryData(json.data.tables, unitName);
        setReportData(summary);

        toast.success("Report generated successfully");
      } else {
        const msg = json.message || "Failed to generate report";
        toast.error(msg);
      }
    } catch (error) {
      console.error("Execution Error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
              <h1 className="text-3xl font-bold tracking-tight">
                Fleet Analytics
              </h1>

              <ReportFilters
                units={units}
                selectedUnitId={selectedUnitId}
                onUnitChange={setSelectedUnitId}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
              />

              <div className="space-y-4">
                {reportData && (
                  <h2 className="text-xl font-semibold">Report Summary</h2>
                )}
                <ReportTable data={reportData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
