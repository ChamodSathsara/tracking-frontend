"use client";

import { useState, useEffect } from "react";
import { Truck, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { CarrierLogo } from "@/components/CarrierLogo/CarrierLogo";
import axios from "axios";

export function CarriersContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [metricsData, setMetricsData] = useState({});
  const [shipments, setShipments] = useState([]);
  // call get all shipment api end point
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
    console.log("calling use effet");
    fetchShipments();
    fetchMetrics();
  }, []);

  console.log(typeof shipments);

  // success delevered shipments
  const successRate = Math.round(
    (metricsData.fedExDelivered_count / metricsData.feedEx_count) * 100
  );

  // success delevered shipments
  const successRateDhl = Math.round(
    (metricsData.dhlDelivered_count / metricsData.dhl_count) * 100
  );

  // avarage devevery time
  let fedExTotalDeleveryTime = 0;
  let dhlTotalDeleveryTime = 0;
  for (let i = 0; i < shipments.length; i++) {
    const actualDelivery = new Date(shipments[i].actualDelivery);
    const createdAt = new Date(shipments[i].createdAt);
    // Calculate difference in days
    const deliveryTime = (actualDelivery - createdAt) / (1000 * 60 * 60 * 24);
    if (shipments[i].carrier === "FedEx") {
      fedExTotalDeleveryTime += deliveryTime;
    } else if (shipments[i].carrier === "DHL") {
      dhlTotalDeleveryTime += deliveryTime;
    }
  }

  // avg delivery time of FedEx
  const avgFedExDevilevyTime = (
    fedExTotalDeleveryTime / metricsData.feedEx_count
  ).toFixed(1);

  // avg delivery time of FedEx
  const avgDhlDevilevyTime = (
    dhlTotalDeleveryTime / metricsData.dhl_count
  ).toFixed(1);

  const Fshipments = shipments.filter((s) => s.carrier === "FedEx");
  const Dshipments = shipments.filter((s) => s.carrier === "DHL");

  const fedExServiceAreas = Fshipments.map((s) => s.destination);
  const dhlServiceAreas = Dshipments.map((s) => s.destination);

  // Sample data for carriers
  const carriers = [
    {
      id: "fedex",
      name: "FedEx",
      logo: "FX",
      color: "blue",
      activeShipments: metricsData.feedEx_count,
      deliveredToday: metricsData.fedExDelivered_count,
      delayedShipments: metricsData.fedExDelay_count,
      onTimePercentage: successRate,
      avgDeliveryTime: `${avgFedExDevilevyTime} days`,
      contactInfo: {
        phone: "1-800-463-3339",
        email: "support@fedex.com",
        website: "www.fedex.com",
      },
      serviceAreas: fedExServiceAreas,
      shipments: Fshipments,
    },
    {
      id: "dhl",
      name: "DHL",
      logo: "DH",
      color: "yellow",
      activeShipments: metricsData.dhl_count,
      deliveredToday: metricsData.dhlDelivered_count,
      delayedShipments: metricsData.dhlDelay_count,
      onTimePercentage: successRateDhl,
      avgDeliveryTime: `${avgDhlDevilevyTime} days`,
      contactInfo: {
        phone: "1-800-225-5345",
        email: "support@dhl.com",
        website: "www.dhl.com",
      },
      serviceAreas: dhlServiceAreas,
      shipments: Dshipments,
    },
  ];

  // carrier cards
  const renderCarrierCard = (carrier) => {
    console.log(carrier);
    return (
      <Card key={carrier.id} className="overflow-hidden">
        <CardHeader
          className={`bg-${carrier.color}-50 dark:bg-${carrier.color}-900/20`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CarrierLogo carrier={carrier.name} size="lg" />
              <div>
                <CardTitle>{carrier.name}</CardTitle>
                <CardDescription>Logistics Carrier</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b">
            <div className="p-4 border-r">
              <div className="text-sm text-muted-foreground">
                Active Shipments
              </div>
              <div className="text-2xl font-bold mt-1">
                {carrier.activeShipments}
              </div>
            </div>
            <div className="p-4 border-r">
              <div className="text-sm text-muted-foreground">
                Delivered Shipment
              </div>
              <div className="text-2xl font-bold mt-1">
                {carrier.deliveredToday}
              </div>
            </div>
            <div className="p-4 border-r">
              <div className="text-sm text-muted-foreground">On-Time Rate</div>
              <div className="text-2xl font-bold mt-1">
                {carrier.onTimePercentage}%
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground">
                Avg Delivery Time
              </div>
              <div className="text-2xl font-bold mt-1">
                {carrier.avgDeliveryTime}
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-3">Recent Shipments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrier.shipments.slice(0, 5).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {shipment.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t">
            <h3 className="font-medium mb-2">Service Areas</h3>
            <div className="flex flex-wrap gap-2">
              {carrier.serviceAreas.map((area) => (
                <div
                  key={area}
                  className="bg-muted text-xs px-2.5 py-1 rounded-full"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // renderCarrierPerformance Card
  const renderCarrierPerformance = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carrier Performance Comparison</CardTitle>
          <CardDescription>
            Compare key metrics between carriers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carrier</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>On-Time %</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>Avg Delivery</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Delayed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.map((carrier) => (
                <TableRow key={carrier.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CarrierLogo carrier={carrier.name} />
                      <span>{carrier.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          carrier.onTimePercentage > 90
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      ></div>
                      {carrier.onTimePercentage}%
                    </div>
                  </TableCell>
                  <TableCell>{carrier.avgDeliveryTime}</TableCell>
                  <TableCell>{carrier.activeShipments}</TableCell>
                  <TableCell>{carrier.deliveredToday}</TableCell>
                  <TableCell>{carrier.delayedShipments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Carriers</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        {/* nav bar of tab */}
        <TabsList>
          <TabsTrigger value="all">All Carriers</TabsTrigger>
          <TabsTrigger value="fedex">FedEx</TabsTrigger>
          <TabsTrigger value="dhl">DHL</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* All Tab */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {renderCarrierPerformance()}
            {carriers.map(renderCarrierCard)}
          </div>
        </TabsContent>

        {/* fedEx Tab */}
        <TabsContent value="fedex" className="mt-4">
          {renderCarrierCard(carriers.find((c) => c.id === "fedex"))}
        </TabsContent>

        {/* Dhl Tab */}
        <TabsContent value="dhl" className="mt-4">
          {renderCarrierCard(carriers.find((c) => c.id === "dhl"))}
        </TabsContent>

        {/* Performence tab */}
        <TabsContent value="performance" className="mt-4">
          {renderCarrierPerformance()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
