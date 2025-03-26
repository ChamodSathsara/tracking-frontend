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

function TableOfShipments({ filteredShipments }) {
  const [isSee, setIsSee] = useState(false);

  return (
    <Table>
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
      <TableBody>
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell className="font-medium">{shipment.id}</TableCell>
              <TableCell>{shipment.customer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CarrierLogo carrier={shipment.carrier} />
                  <span className="hidden md:inline">{shipment.carrier}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {shipment.destination}
              </TableCell>
              <TableCell>
                <StatusBadge status={shipment.status} />
              </TableCell>
              <TableCell>
                <Button onClick={() => setIsSee(shipment.id)}>
                  <Eye className="h-4 w-4" /> View
                </Button>

                {isSee === shipment.id && (
                  <ViewShipmen
                    isSee={isSee}
                    setIsSee={setIsSee}
                    shipmentId={shipment.id}
                    shipment={shipment}
                  />
                )}
              </TableCell>
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
              No shipments found matching your filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableOfShipments;
