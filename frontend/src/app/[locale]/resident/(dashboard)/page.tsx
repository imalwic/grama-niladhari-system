"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ResidentDashboard() {
  const t = useTranslations("Resident");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("welcomeUser")}</h1>
        <p className="text-muted-foreground">
          {t("wasamaInfo")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingRequests")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-xs text-muted-foreground">{t("waitingForGN")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("approvedCertificates")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">{t("readyToDownload")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("unreadNotices")}</CardTitle>
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">{t("fromGNOfficer")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
         <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("requestCertificate")}</CardTitle>
            <CardDescription>
              {t("applyOnline")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
               <FileText className="mr-2 h-4 w-4" /> {t("characterCertificate")}
             </Button>
             <Button className="w-full justify-start bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
               <FileText className="mr-2 h-4 w-4" /> {t("incomeCertificate")}
             </Button>
             <Button variant="outline" className="w-full justify-start border-[#003366] text-[#003366] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-800">
               {t("viewAllCertTypes")}
             </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:border-l-blue-500">
          <CardHeader>
            <CardTitle>{t("gnNotices")}</CardTitle>
            <CardDescription>
              {t("importantAnnouncements")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 border-b dark:border-slate-700 pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#003366] dark:text-blue-400">{t("dengueProgram")}</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("today")}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{t("dengueDesc")}</p>
              </div>
              <div className="flex flex-col gap-1 border-b dark:border-slate-700 pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#003366] dark:text-blue-400">{t("aswesuma")}</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("daysAgo")}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{t("aswesumaDesc")}</p>
              </div>
            </div>
            <Button variant="link" className="px-0 text-[#003366] dark:text-blue-400 mt-2">{t("viewAllNotices")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
