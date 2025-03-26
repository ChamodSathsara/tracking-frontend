"use client";

import { LayoutDashboard, Package, Truck, TruckIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AppSidebar({ activeView, setActiveView }) {
  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-4 border-b">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            <Truck className="h-5 w-5" />
          </div>
          LogiTrack
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === "dashboard"}
              onClick={() => setActiveView("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === "shipment"}
              onClick={() => setActiveView("shipment")}
            >
              <Package className="h-4 w-4" />
              <span>Shipments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeView === "carriers"}
              onClick={() => setActiveView("carriers")}
            >
              <TruckIcon className="h-4 w-4" />
              <span>Carriers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
