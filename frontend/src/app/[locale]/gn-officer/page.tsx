"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, CheckCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function GnOfficerDashboard() {
  const t = useTranslations("GnOfficer");
  const [stats, setStats] = useState({
    totalHouseholds: 0,
    totalResidents: 0,
    pendingRequests: 0,
    issuedCertificates: 0,
    newVoters: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/wasamas/dashboard-stats", {
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
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("myResidents")}</CardTitle>
            <Users className="h-4 w-4 text-[#003366] dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents}</div>
            <p className="text-xs text-muted-foreground">{t("addedThisWeek")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("households")}</CardTitle>
            <Home className="h-4 w-4 text-[#003366] dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHouseholds}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingRequests")}</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">{t("needsApproval")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("certificatesIssued")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issuedCertificates}</div>
            <p className="text-xs text-muted-foreground">{t("thisYear")}</p>
          </CardContent>
        </Card>
      </div>

      {/* New Row for Electoral Register */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 mt-4">
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Eligible Voters (18+)</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newVoters}</div>
            <p className="text-xs text-muted-foreground mt-1">Within your Wasama</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
         <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>
              {t("frequentTasks")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
               {t("registerHousehold")}
             </Button>
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
               {t("addResident")}
             </Button>
             <Button variant="outline" className="w-full justify-start dark:border-slate-700 dark:text-slate-300">
               {t("publishNotice")}
             </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("recentRequests")}</CardTitle>
            <CardDescription>
              {t("requestsWaiting")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b dark:border-slate-700 pb-2 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("characterCertReq")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("requestedBy")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 dark:border-slate-700">{t("review")}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
