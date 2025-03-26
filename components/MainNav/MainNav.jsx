"use client";

import { LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainNav({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Button
        variant={activeTab === "dashboard" ? "default" : "ghost"}
        className="flex items-center gap-2"
        onClick={() => setActiveTab("dashboard")}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span>Dashboard</span>
      </Button>
      <Button
        variant={activeTab === "shipment" ? "default" : "ghost"}
        className="flex items-center gap-2"
        onClick={() => setActiveTab("shipment")}
      >
        <Package className="h-4 w-4" />
        <span>Shipment</span>
      </Button>
    </div>
  );
}
