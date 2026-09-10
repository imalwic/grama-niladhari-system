"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Construction } from "lucide-react";
import { useTranslations } from "next-intl";

// MOCK DATA
const MOCK_NOTICES = [
  {
    id: "1",
    title: "Dengue Eradication Program",
    content: "Please keep your premises clean. Health inspectors will visit tomorrow morning starting from 8:00 AM.",
    type: "ALERT",
    createdAt: "2023-10-25T10:00:00Z",
    publishedBy: "R.M. Perera (GN Officer)",
  },
  {
    id: "2",
    title: "New Community Center Construction",
    content: "The foundation laying ceremony for the new community center will be held this Sunday at 9:00 AM. All are welcome.",
    type: "DEVELOPMENT",
    createdAt: "2023-10-24T08:00:00Z",
    publishedBy: "R.M. Perera (GN Officer)",
  },
  {
    id: "3",
    title: "Aswesuma Registration Updates",
    content: "Submit your appeals before Friday at the GN office. Please bring your NIC and relevant documents.",
    type: "GENERAL",
    createdAt: "2023-10-23T14:30:00Z",
    publishedBy: "R.M. Perera (GN Officer)",
  },
];

export default function ResidentNotices() {
  const t = useTranslations("Resident");

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
        {MOCK_NOTICES.map((notice) => {
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
                    {t("publishedBy")} {notice.publishedBy} • {new Date(notice.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {style.badge}
              </CardHeader>
              <CardContent className="pt-2 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {notice.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
