"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResidentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366]">Welcome, Kamal!</h1>
        <p className="text-muted-foreground">
          Weeraketiya North (WN-102) • Household H-001
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-xs text-muted-foreground">Waiting for GN approval</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Certificates</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Ready to download</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Notices</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">From your GN Officer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
         <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Request a Certificate</CardTitle>
            <CardDescription>
              Apply for official documents online without visiting the office.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244]">
               <FileText className="mr-2 h-4 w-4" /> Character Certificate
             </Button>
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244]">
               <FileText className="mr-2 h-4 w-4" /> Income Certificate
             </Button>
             <Button variant="outline" className="w-full justify-start border-[#003366] text-[#003366]">
               View All Certificate Types
             </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle>GN Officer Notices</CardTitle>
            <CardDescription>
              Important announcements for your area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 border-b pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#003366]">Dengue Eradication Program</p>
                  <span className="text-xs text-slate-500">Today</span>
                </div>
                <p className="text-xs text-slate-600">Please keep your premises clean. Inspection tomorrow morning.</p>
              </div>
              <div className="flex flex-col gap-1 border-b pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#003366]">Aswesuma Registration</p>
                  <span className="text-xs text-slate-500">2 days ago</span>
                </div>
                <p className="text-xs text-slate-600">Submit your appeals before Friday.</p>
              </div>
            </div>
            <Button variant="link" className="px-0 text-[#003366] mt-2">View all notices &rarr;</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
