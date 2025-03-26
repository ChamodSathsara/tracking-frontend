"use client";

import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { shipments as allShipments } from "@/Data/shipments";

import AddShipment from "../AddShipment/AddShipment";
import TableOfShipments from "../TableOfShipments/TableOfShipments";
import axios from "axios";

export function ShipmentContent() {
  // shipments
  const [shipments, setShipments] = useState([]);

  const fetchShipments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments`
      );
      console.log("Shipments:", response.data);
      setShipments(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // filters (carrier and status)
  const [filters, setFilters] = useState({
    carrier: "all",
    status: "all",
  });

  // Serch Term
  const [searchTerm, setSearchTerm] = useState("");
  // Add shipment Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter shipments based on selected filters and search term
  const filteredShipments = shipments.filter((shipment) => {
    const matchesCarrier =
      filters.carrier === "all" || shipment.carrier === filters.carrier;
    const matchesStatus =
      filters.status === "all" || shipment.status === filters.status;
    const matchesSearch =
      searchTerm === "" ||
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCarrier && matchesStatus && matchesSearch;
  });

  const clearFilters = () => {
    setFilters({
      carrier: "all",
      status: "all",
    });
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Shipment Management
        </h2>
        {/* Shipment Add  */}
        <AddShipment
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          fetchShipments={fetchShipments}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Carrier Filter */}
        <Select
          value={filters.carrier}
          onValueChange={(value) => setFilters({ ...filters, carrier: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Carriers</SelectItem>
            <SelectItem value="FedEx">FedEx</SelectItem>
            <SelectItem value="DHL">DHL</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="In Transit">In Transit</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        {(filters.carrier !== "all" ||
          filters.status !== "all" ||
          searchTerm !== "") && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {(filters.carrier !== "all" ||
        filters.status !== "all" ||
        searchTerm !== "") && (
        <div className="flex flex-wrap gap-2">
          {filters.carrier !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Carrier: {filters.carrier}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, carrier: "all" })}
              />
            </Badge>
          )}
          {filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, status: "all" })}
              />
            </Badge>
          )}
          {searchTerm !== "" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Table of all shipments = i declear as card */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {/* table */}
          <TableOfShipments filteredShipments={filteredShipments} />
        </CardContent>
      </Card>
    </div>
  );
}
