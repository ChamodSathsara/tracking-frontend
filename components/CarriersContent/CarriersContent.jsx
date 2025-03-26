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
import { Button } from "@/components/ui/button";

export function CarriersContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [shipments, setShipments] = useState({});
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

  useEffect(() => {
    fetchShipments();
  }, []);

  // all active shipments of FeedEx
  const activeFedExShipments = shipments.filter(
    (s) => s.carrier === "FedEx" && s.status !== "Failed"
  ).length;

  // all active shipments of DHL
  const activeDhlShipments = shipments.filter(
    (s) => s.carrier === "DHL" && s.status !== "Failed"
  ).length;

  // Today shipments of FedEx
  const deliveredFedExToday = shipments.filter(
    (s) => s.createdAt === Date.now() && s.carrier === "FedEx"
  ).length;

  // Today shipments of DHL
  const deliveredDhlToday = shipments.filter(
    (s) => s.createdAt === Date.now() && s.carrier === "DHL"
  ).length;

  // delay shipments of FedEx
  const delayFedEx = shipments.filter(
    (s) => s.status === "Delay" && s.carrier === "FedEx"
  ).length;

  // delay shipments of DHL
  const delayDhl = shipments.filter(
    (s) => s.status === "Delay" && s.carrier === "DHL"
  ).length;

  // success shipments of FedEx
  const successFedEx = shipments.filter(
    (s) => s.status === "Delivered" && s.carrier === "FedEx"
  ).length;

  // success shipments of DHL
  const successDhl = shipments.filter(
    (s) => s.status === "Delivered" && s.carrier === "DHL"
  ).length;

  // all shipments of FeedEx
  const feedExAll = shipments.filter((s) => s.carrier === "FedEx").length;

  const dhlAll = shipments.filter((s) => s.carrier === "DHL").length;

  // success delevered shipments
  const successRate = Math.round((successFedEx / feedExAll) * 100);

  // success delevered shipments
  const successRateDhl = Math.round((successDhl / dhlAll) * 100);

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
  const avgFedExDevilevyTime = (fedExTotalDeleveryTime / feedExAll).toFixed(1);

  // avg delivery time of FedEx
  const avgDhlDevilevyTime = (dhlTotalDeleveryTime / dhlAll).toFixed(1);

  // Sample data for carriers
  const carriers = [
    {
      id: "fedex",
      name: "FedEx",
      logo: "FX",
      color: "blue",
      activeShipments: activeFedExShipments,
      deliveredToday: deliveredFedExToday,
      delayedShipments: delayFedEx,
      onTimePercentage: successRate,
      avgDeliveryTime: `${avgFedExDevilevyTime} days`,
      contactInfo: {
        phone: "1-800-463-3339",
        email: "support@fedex.com",
        website: "www.fedex.com",
      },
      serviceAreas: ["North America", "Europe", "Asia", "Australia"],
      shipments: shipments.filter((s) => s.carrier === "FedEx"),
    },
    {
      id: "dhl",
      name: "DHL",
      logo: "DH",
      color: "yellow",
      activeShipments: activeDhlShipments,
      deliveredToday: deliveredDhlToday,
      delayedShipments: delayDhl,
      onTimePercentage: successRateDhl,
      avgDeliveryTime: `${avgDhlDevilevyTime} days`,
      contactInfo: {
        phone: "1-800-225-5345",
        email: "support@dhl.com",
        website: "www.dhl.com",
      },
      serviceAreas: [
        "Europe",
        "Asia",
        "Africa",
        "South America",
        "North America",
      ],
      shipments: shipments.filter((s) => s.carrier === "DHL"),
    },
  ];

  // carrier cards
  const renderCarrierCard = (carrier) => {
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
                Delivered Today
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
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Carriers</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Carriers</TabsTrigger>
          <TabsTrigger value="fedex">FedEx</TabsTrigger>
          <TabsTrigger value="dhl">DHL</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {renderCarrierPerformance()}
            {carriers.map(renderCarrierCard)}
          </div>
        </TabsContent>

        <TabsContent value="fedex" className="mt-4">
          {renderCarrierCard(carriers.find((c) => c.id === "fedex"))}
        </TabsContent>

        <TabsContent value="dhl" className="mt-4">
          {renderCarrierCard(carriers.find((c) => c.id === "dhl"))}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {renderCarrierPerformance()}
        </TabsContent>
      </Tabs>
    </>
  );
}
