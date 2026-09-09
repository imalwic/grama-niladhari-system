"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, MapPin, Activity } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366]">Pradeshiya Sabha Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all Grama Niladhari divisions under Weeraketiya Pradeshiya Sabha.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,231</div>
            <p className="text-xs text-muted-foreground">+201 from last month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Households</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,102</div>
            <p className="text-xs text-muted-foreground">+43 new registrations</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">GN Divisions (Wasamas)</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">All assigned</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Across all divisions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Demographics Overview</CardTitle>
            <CardDescription>
              Population distribution across top Wasamas.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50">
            {/* Chart Placeholder */}
            <p className="text-muted-foreground italic">Bar Chart will render here</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed by GN officers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Resident registered in Weeraketiya North
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By GN Officer Samantha • 2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
