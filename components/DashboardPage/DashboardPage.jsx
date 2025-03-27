"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { DashboardContent } from "@/components/DashboardContent/DashboardContent";
import { ShipmentContent } from "@/components/ShipmentContent/ShipmentContent";
import { CarriersContent } from "../CarriersContent/CarriersContent";

export function DashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="flex w-screen min-h-screen">
        {/* Sidebar Side */}
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Content Side */}
        <SidebarInset className="flex-1">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {activeView === "dashboard" ? (
              <DashboardContent />
            ) : activeView === "shipment" ? (
              <ShipmentContent />
            ) : (
              <CarriersContent activeView={activeView} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
