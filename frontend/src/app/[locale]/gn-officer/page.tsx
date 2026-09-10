"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function GnOfficerDashboard() {
  const t = useTranslations("GnOfficer");
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
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-muted-foreground">{t("addedThisWeek")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("households")}</CardTitle>
            <Home className="h-4 w-4 text-[#003366] dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">215</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingRequests")}</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">{t("needsApproval")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("certificatesIssued")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">{t("thisYear")}</p>
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
