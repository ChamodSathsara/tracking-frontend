"use client";

import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

// Define validation schema using Zod
const shipmentSchema = z.object({
  trackingNumber: z
    .string()
    .min(3, "Tracking Number is required")
    .max(6, "Max Number is 6"),
  customer: z
    .string()
    .min(4, "Customer name is required")
    .max(10, "Max Number is 6"),
  origin: z.string().min(3, "Origin is required"),
  carrier: z.enum(["FedEx", "DHL"]),
  destination: z.string().min(1, "Destination is required"),
  status: z.enum(["InTransit", "Delivered", "Delayed", "Failed"]),
});

function AddShipment({ isDialogOpen, setIsDialogOpen, fetchShipments }) {
  const [metricsData, setMetricsData] = useState({});

  // call get metrics api end point
  const fetchMetrics = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/metrics`
      );
      console.log("Metrics:", response.data);
      setMetricsData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [fetchShipments]);
  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      id: metricsData.total_shipments + 1,
      trackingNumber: "",
      customer: "",
      origin: "",
      carrier: "FedEx",
      destination: "",
      status: "InTransit",
      actualDelivery: null,
      createdAt: new Date(Date.now()).toISOString().split("T")[0],
    },
  });

  // Function to handle form submission
  const onSubmit = async (shipmentData) => {
    const updatedShipmentData = {
      ...shipmentData,
      id: metricsData.total_shipments + 1,
      actualDelivery: "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    console.log(updatedShipmentData);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments`,
        updatedShipmentData
      );
      console.log("Shipment Created:", response.data);
      toast.success("Successfully added shipment");
      reset();

      setIsDialogOpen(false);
      fetchShipments();
      return response.data;
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Error creating shipment");
      return null;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Toaster />
      {/* Trigger Button to Open Dialog */}
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Shipment</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        {/* Dialog / Form Header */}
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
        </DialogHeader>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Tracking Number Input */}
          <div className="grid gap-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              {...register("trackingNumber")}
              placeholder="Tracking Number"
            />
            {errors.trackingNumber && (
              <p className="text-red-500">{errors.trackingNumber.message}</p>
            )}
          </div>

          {/* Customer Input */}
          <div className="grid gap-2">
            <Label htmlFor="customer">Customer</Label>
            <Input
              id="customer"
              {...register("customer")}
              placeholder="Customer Name"
            />
            {errors.customer && (
              <p className="text-red-500">{errors.customer.message}</p>
            )}
          </div>

          {/* Origin Input */}
          <div className="grid gap-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              {...register("origin")}
              placeholder="Origin (From)"
            />
            {errors.origin && (
              <p className="text-red-500">{errors.origin.message}</p>
            )}
          </div>

          {/* Carrier Select */}
          <div className="grid gap-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select onValueChange={(value) => setValue("carrier", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination Input */}
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              {...register("destination")}
              placeholder="City, State"
            />
            {errors.destination && (
              <p className="text-red-500">{errors.destination.message}</p>
            )}
          </div>

          {/* Status Select */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="InTransit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Shipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddShipment;
