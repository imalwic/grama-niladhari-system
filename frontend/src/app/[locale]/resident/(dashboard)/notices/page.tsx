"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Construction, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function ResidentNotices() {
  const t = useTranslations("Resident");
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://localhost:3001/notices/resident", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const getTypeIconAndColor = (type: string) => {
    switch (type) {
      case "ALERT":
        return { icon: <AlertTriangle className="h-5 w-5 text-red-600" />, badge: <Badge variant="destructive">{t("urgent")}</Badge>, border: "border-l-4 border-red-500" };
      case "DEVELOPMENT":
        return { icon: <Construction className="h-5 w-5 text-green-600" />, badge: <Badge className="bg-green-600 dark:bg-green-700">{t("development")}</Badge>, border: "border-l-4 border-green-500" };
      default:
        return { icon: <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />, badge: <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{t("general")}</Badge>, border: "border-l-4 border-[#003366] dark:border-blue-500" };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("noticeBoardTitle")}</h1>
        <p className="text-muted-foreground">{t("stayUpdatedDesc")}</p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notices.length > 0 ? (
          notices.map((notice) => {
            const style = getTypeIconAndColor(notice.type);
            return (
              <Card key={notice.id} className={`shadow-sm ${style.border} dark:bg-slate-900 dark:border-y-slate-800 dark:border-r-slate-800`}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {style.icon}
                      <CardTitle className="text-lg">{notice.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {style.badge}
                </CardHeader>
                <CardContent className="pt-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {notice.content}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center p-12 text-muted-foreground border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
            No notices available.
          </div>
        )}
      </div>
    </div>
  );
}
