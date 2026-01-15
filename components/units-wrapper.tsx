"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import UnitsDataTable from "@/components/unit-table"; // Your existing table component

// Define the type for your data
type WialonUnit = {
  id: number;
  name: string;
};

export default function UnitsWrapper({
  initialData,
}: {
  initialData: WialonUnit[];
}) {
  // We create the QueryClient here to ensure it persists across re-renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
                <div className="container mx-auto py-10">
                  <h1 className="text-3xl font-bold mb-6 tracking-tight">
                    Fleet Overview
                  </h1>

                  {/* Pass the server data to the table */}
                  <UnitsDataTable initialData={initialData} />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
