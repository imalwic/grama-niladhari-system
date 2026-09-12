"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, MapPin, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SuperAdminDashboard() {
  const t = useTranslations("SuperAdmin");
  
  const [stats, setStats] = useState<any>({
    totalResidents: 0,
    totalHouseholds: 0,
    gnDivisions: 0,
    pendingRequests: 0,
    recentActivity: []
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/admin/dashboard-stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalResidents")}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("fromLastMonth")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalHouseholds")}</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHouseholds.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t("newRegistrations")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-orange-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("gnDivisions")}</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gnDivisions}</div>
            <p className="text-xs text-muted-foreground">{t("allAssigned")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingRequests")}</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">{t("acrossDivisions")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("demographicsOverview")}</CardTitle>
            <CardDescription>
              {t("populationDistribution")}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700">
            {/* Chart Placeholder */}
            <p className="text-muted-foreground italic">{t("chartPlaceholder")}</p>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-y-auto max-h-[400px]">
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>
              {t("latestActions")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
