import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { shipments } from "@/Data/shipments";
import { ChartOfPerfomence } from "../PerfomenceChart/PerfomenceChart";
import { ModeToggle } from "../ModeToggle";
import axios from "axios";
import { useEffect, useState } from "react";

export function DashboardContent() {
  const [recentShipments, setRecentShipments] = useState([]);
  const [metricsData, setMetricsData] = useState({});

  // call get all shipment api end point
  const fetchShipments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/shipments`
      );
      console.log("Shipments:", response.data);
      setRecentShipments(response.data);
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
    fetchShipments();
    fetchMetrics();
  }, []);

  const clickShipmnt = (shipment) => {
    console.log(shipment);
  };

  const totalShipments = metricsData.total_shipments; //   all shipments
  const deliveredShipments = metricsData.delivered; // delevered shipments
  const failedShipments = metricsData.failed; //   faild shipments

  //   All Carrer delevery success rate
  const successRate = Math.round((deliveredShipments / totalShipments) * 100);

  const fedExShipments = metricsData.feedEx_count; //FedEx shipments
  const dhlShipments = metricsData.dhl_count; // DHL shipments

  //all develevry success count (DHL & FedEx)
  const fedExDelivered = metricsData.fedExDelivered_count;
  const dhlDelivered = metricsData.dhlDelivered_count;

  //   FedEx Carrer delevery success rate
  const fedExSuccessRate = Math.round((fedExDelivered / fedExShipments) * 100);
  //   Dhl Carrer delevery success rate
  const dhlSuccessRate = Math.round((dhlDelivered / dhlShipments) * 100);

  return (
    <>
      {/* header of dashboard */}
      <div className="flex items-center justify-between">
        {/* Dashboard topic */}
        <h2 className="text-3xl font-bold tracking-tight">
          Logistics Dashboard
        </h2>
        {/* toggle icon darkMode */}
        <ModeToggle />
      </div>

      {/* Perfomence Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* All Carriers Delivery Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {/* Card title */}
            <CardTitle className="text-sm font-medium">
              Delivery Success Rate
            </CardTitle>
            {/* check icon */}
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          {/* Card Content */}
          <CardContent>
            {/* reprecent presentage */}
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
            {/* represent count  */}
            <p className="mt-2 text-xs text-muted-foreground">
              {deliveredShipments} of {totalShipments} shipments delivered
              successfully
            </p>
            <p className="mt-2 text-xs  text-red-900">
              {failedShipments} of {totalShipments} shipments delivered Failed.
            </p>
          </CardContent>
        </Card>

        {/* FedEx Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              FedEx Performance
            </CardTitle>
            <CarrierLogo carrier="FedEx" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fedExSuccessRate}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${fedExSuccessRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {fedExDelivered} of {fedExShipments} shipments delivered
              successfully
            </p>
          </CardContent>
        </Card>

        {/* DHL Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DHL Performance
            </CardTitle>
            <CarrierLogo carrier="DHL" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dhlSuccessRate}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-yellow-500"
                style={{ width: `${dhlSuccessRate}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {dhlDelivered} of {dhlShipments} shipments delivered successfully
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Carrier Performance Comparison Card & recent table*/}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Carrier Performance Comparison Card */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Carrier Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {/* Cart of Performence comparism */}
            <ChartOfPerfomence />
          </CardContent>
        </Card>

        {/* Recent ShipmentsTable */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* filter latest shipments */}
                {recentShipments.slice(0, 10).map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    onClick={() => clickShipmnt(shipment)}
                  >
                    <TableCell className="font-medium">
                      {shipment.trackingNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CarrierLogo carrier={shipment.carrier} size="sm" />
                        <span className="hidden md:inline">
                          {shipment.carrier}
                        </span>
                      </div>
                    </TableCell>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
