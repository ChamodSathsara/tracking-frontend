"use client";
import React, { useState } from "react";
import { Eye } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { CarrierLogo } from "@/components/CarrierLogo/CarrierLogo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewShipmen from "../ViewShipment/ViewShipment";
import { Button } from "../ui/button";

function TableOfShipments({ filteredShipments, fetchShipments }) {
  const [selectedShipment, setSelectedShipment] = useState(null);

  return (
    <div>
      <Table>
        {/* Head of the table */}
        <TableHeader>
          <TableRow>
            <TableHead>Tracking ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead className="hidden md:table-cell">Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>See</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>

        {/* Body of the Table */}
        <TableBody>
          {filteredShipments.length > 0 ? (
            filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                {/* id cel */}
                <TableCell className="font-medium">{shipment.id}</TableCell>

                {/* customer cell */}
                <TableCell>{shipment.customer}</TableCell>

                {/* carrier cell */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CarrierLogo carrier={shipment.carrier} />
                    <span className="hidden md:inline">{shipment.carrier}</span>
                  </div>
                </TableCell>

                {/* destination Cell */}
                <TableCell className="hidden md:table-cell">
                  {shipment.destination}
                </TableCell>

                {/* status cell */}
                <TableCell>
                  <StatusBadge status={shipment.status} />
                </TableCell>

                {/* See button cell */}
                <TableCell>
                  <Button onClick={() => setSelectedShipment(shipment)}>
                    <Eye className="h-4 w-4" /> View
                  </Button>
                </TableCell>

                {/* date cell */}
                <TableCell className="hidden md:table-cell">
                  {shipment.createdAt}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-4 text-muted-foreground"
              >
                No shipmentss found matching your filters..
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Render ViewShipment outside the table */}
      {selectedShipment && (
        <ViewShipmen
          isSee={!!selectedShipment}
          setIsSee={() => setSelectedShipment(null)}
          shipment={selectedShipment}
          fetchShipments={fetchShipments}
        />
      )}
    </div>
  );
}

export default TableOfShipments;
