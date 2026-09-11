"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Bell, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

function getUserFromToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function ResidentDashboard() {
  const t = useTranslations("Resident");
  const [userData, setUserData] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [notices, setNotices] = useState<any[]>([]);
  const [totalNoticesCount, setTotalNoticesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserFromToken();
    setUserData(user);

    const fetchData = async () => {
      try {
        // Fetch requests
        const reqRes = await fetch("http://localhost:3001/requests/resident", {
          headers: getAuthHeaders(),
        });
        if (reqRes.ok) {
          const requests = await reqRes.json();
          setPendingCount(requests.filter((r: any) => r.status === "PENDING" || r.status === "UNDER_REVIEW").length);
          setApprovedCount(requests.filter((r: any) => r.status === "APPROVED" || r.status === "READY_FOR_COLLECTION").length);
        }

        // Fetch notices
        const noticeRes = await fetch("http://localhost:3001/notices/resident", {
          headers: getAuthHeaders(),
        });
        if (noticeRes.ok) {
          const noticeData = await noticeRes.json();
          setTotalNoticesCount(noticeData.length);
          setNotices(noticeData.slice(0, 3)); // Show latest 3
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const welcomeName = userData?.name || "Resident";
  const wasamaName = userData?.wasamaName || "";
  const householdNo = userData?.householdNo || "";
  const isVerified = userData?.isVerified || false;

  const wasamaInfo = [
    wasamaName && `${wasamaName}`,
    householdNo && `Household ${householdNo}`,
  ].filter(Boolean).join(" • ");

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">
          Welcome, {welcomeName}!
        </h1>
        {wasamaInfo && (
          <p className="text-muted-foreground">
            {wasamaInfo} {!isVerified && `• ${t("wasamaInfo")}`}
          </p>
        )}
        {!wasamaInfo && !isVerified && (
          <p className="text-muted-foreground">{t("wasamaInfo")}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingRequests")}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">{t("waitingForGN")}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("approvedCertificates")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{approvedCount}</div>
                <p className="text-xs text-muted-foreground">{t("readyToDownload")}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("unreadNotices")}</CardTitle>
            <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalNoticesCount}</div>
                <p className="text-xs text-muted-foreground">{t("fromGNOfficer")}</p>
              </>
            )}
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
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="flex flex-col gap-1 border-b dark:border-slate-700 pb-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#003366] dark:text-blue-400">{notice.title}</p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{timeAgo(notice.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{notice.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No notices yet.</p>
            )}
            <Button variant="link" className="px-0 text-[#003366] dark:text-blue-400 mt-2">{t("viewAllNotices")}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
