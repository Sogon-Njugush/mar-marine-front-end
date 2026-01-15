"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable, DailyStat } from "@/components/reports/report-table";
import { processReportData } from "@/lib/utils";

type Unit = { id: number; name: string };
type Template = {
  templateId: number;
  templateName: string;
  resourceId: number;
};

export default function Page() {
  // --- Fleet Analytics State ---
  const [units, setUnits] = useState<Unit[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<DailyStat[]>([]);

  // 1. Fetch Form Data (Units & Templates)
  useEffect(() => {
    async function loadFormData() {
      try {
        const res = await fetch("/api/proxy/form-data");
        if (!res.ok) throw new Error(`Status: ${res.status}`);

        const json = await res.json();

        if (json.data) {
          setUnits(json.data.units || []);
          setTemplates(json.data.templates || []);
        }
      } catch (error) {
        console.error("Form Data Error:", error);
        toast.error("Could not load units/templates.");
      }
    }
    loadFormData();
  }, []);

  // 2. Generate Report Logic
  const handleGenerate = async () => {
    if (!selectedUnitId) return;

    if (templates.length === 0) {
      toast.error("No report templates found.");
      return;
    }

    setIsLoading(true);
    setReportData([]);

    try {
      // Find valid templates. We prefer "Integration" or "Motion", otherwise take the first one.
      const targetTemplate =
        templates.find((t) => t.templateName.includes("Integration")) ||
        templates[0];

      // We explicitly ask for template ID 1 and 3
      const payload = {
        resourceId: targetTemplate.resourceId,
        templateIds: [1, 3],
        objectId: parseInt(selectedUnitId),
      };

      const res = await fetch("/api/proxy/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.data?.tables && json.data.tables.length > 0) {
        // Find the table named "Engine hours" that contains RAW sensor data
        const validTable = json.data.tables.find(
          (t: any) =>
            t.tableName === "Engine hours" &&
            t.totalRows > 0 &&
            t.data[0] &&
            "fuel_level_begin" in t.data[0]
        );

        if (validTable) {
          const unitName =
            units.find((u) => u.id.toString() === selectedUnitId)?.name ||
            "Unknown";
          const processed = processReportData(validTable.data, unitName);
          setReportData(processed);

          if (processed.length > 0) {
            toast.success(`Loaded ${processed.length} daily records`);
          } else {
            toast.warning("Data found, but processing returned 0 rows.");
          }
        } else {
          console.warn(
            "Could not find Detailed Engine Table. Available tables:",
            json.data.tables
          );
          toast.warning("Detailed engine data not found in response.");
        }
      } else {
        const msg = json.message || "Failed to generate report data";
        console.error("API Error Response:", json);
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
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                  Fleet Analytics
                </h1>
                {templates.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {templates.length} Templates Loaded
                  </div>
                )}
              </div>

              {/* Filters Section */}
              <ReportFilters
                units={units}
                selectedUnitId={selectedUnitId}
                onUnitChange={setSelectedUnitId}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />

              {/* Data Table Section */}
              <div className="space-y-4">
                {reportData.length > 0 && (
                  <h2 className="text-xl font-semibold">Daily Breakdown</h2>
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
