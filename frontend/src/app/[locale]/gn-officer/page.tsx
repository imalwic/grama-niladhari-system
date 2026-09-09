"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GnOfficerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366]">Wasama Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here is the overview for Weeraketiya North (Division Code: WN-102).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Residents</CardTitle>
            <Users className="h-4 w-4 text-[#003366]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-muted-foreground">12 added this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Households</CardTitle>
            <Home className="h-4 w-4 text-[#003366]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">215</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">Needs your approval</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
         <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244]">
               + Register New Household
             </Button>
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244]">
               + Add Resident to Household
             </Button>
             <Button variant="outline" className="w-full justify-start">
               Publish a Notice
             </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>
              Resident certificate requests waiting for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Character Certificate Request
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested by Kamal Perera • 1 day ago
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8">Review</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
