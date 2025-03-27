"use client";
import { Search, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

function ViewShipmen({ isSee, setIsSee, shipment, fetchShipments }) {
  console.log(isSee);
  const [newShipment, setNewShipment] = useState({});
  const [newStatus, setNewStatus] = useState();

  const fetchShipmentById = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${id}`
      );
      console.log("Shipment Details:", response.data);
      setNewShipment(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching shipment by ID:", error);
      toast.error("Error fetching shipment by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchShipmentById(shipment.id);
  }, [shipment]);

  const updateShipmentStatus = async (id, newStatus) => {
    console.log(id);
    console.log(newStatus);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments/${id}/status`,
        { status: newStatus }
      );
      console.log("Updated Shipment:", response.data);
      setNewShipment({});
      setIsSee(false);
      fetchShipments();
      toast.success("Successfully Update...!");
      return response.data;
    } catch (error) {
      console.error("Error updating shipment status:", error);
      toast.error("Error updating shipment status:", error);
      return null;
    }
  };

  return (
    <Dialog open={!!isSee} onOpenChange={() => setIsSee(false)}>
      <Toaster />
      {/* Trigger Button */}
      <DialogTrigger asChild>{/*  */}</DialogTrigger>

      <DialogContent>
        {/* Dialog / form Header */}
        <DialogHeader>
          <DialogTitle>View Selected Shipment</DialogTitle>
          <p>Can you update only Status </p>
        </DialogHeader>

        {/* View Shipments form */}
        <div className="grid gap-4 py-4">
          {/* trackingNumber */}
          <div className="grid gap-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <input
              className="outline-1 rounded-md p-2"
              id="trackingNumber"
              value={newShipment.trackingNumber}
              disabled
            />
          </div>

          {/* Customer */}
          <div className="grid gap-2">
            <Label htmlFor="customer">Customer</Label>
            <input
              disabled
              className="outline-1 rounded-md p-2"
              id="customer"
              value={newShipment.customer}
            />
          </div>

          {/* Origin */}
          <div className="grid gap-2">
            <Label htmlFor="origin">Origin</Label>
            <input
              id="origin"
              className="outline-1 rounded-md p-2"
              value={newShipment.origin}
              disabled
            />
          </div>

          {/* Select Carrier */}
          <div className="grid gap-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select value={newShipment.carrier}>
              <SelectTrigger>
                <SelectValue placeholder="Select Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={newShipment.carrier}>FedEx</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination */}
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <input
              className="outline-1 rounded-md p-2"
              disabled
              id="destination"
              value={newShipment.destination}
            />
          </div>

          {/* date */}
          <div className="grid gap-2">
            <Label htmlFor="date">Create Date</Label>
            <input
              disabled
              className="outline-1 rounded-md p-2"
              id="date"
              value={newShipment.createdAt}
            />
          </div>

          {/* Add status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newShipment.status}
              onValueChange={(value) => setNewStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delay">Delay</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* date */}
        <div className="grid gap-2">
          <Label htmlFor="date">Delivery Date</Label>
          <input
            type="date"
            className="outline-1 rounded-md p-2"
            id="date"
            value={newShipment.createdAt}
            onChange={(e) => {
              e.preventDefault();
              const value = e.target.value;
              setNewShipment({ ...newShipment, actualDelivery: value });
            }}
          />
        </div>

        {/* Submit & Cancel Button  */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsSee(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => updateShipmentStatus(newShipment.id, newStatus)}
          >
            Update Shipment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewShipmen;
