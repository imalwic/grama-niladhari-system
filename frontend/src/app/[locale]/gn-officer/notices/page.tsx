"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Bell, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

// MOCK DATA
const MOCK_NOTICES = [
  {
    id: "1",
    title: "Dengue Eradication Program",
    content: "Please keep your premises clean. Health inspectors will visit tomorrow morning.",
    type: "ALERT",
    createdAt: "2023-10-25T10:00:00Z",
    expiresAt: "2023-10-27T10:00:00Z",
  },
  {
    id: "2",
    title: "Aswesuma Registration",
    content: "Submit your appeals before Friday at the GN office.",
    type: "GENERAL",
    createdAt: "2023-10-23T14:30:00Z",
    expiresAt: "2023-10-30T17:00:00Z",
  },
];

export default function GnOfficerNotices() {
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("GnOfficer");

  const handleCreateNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNotice = {
      id: Math.random().toString(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      type: formData.get("type") as string,
      createdAt: new Date().toISOString(),
      expiresAt: (formData.get("expiresAt") as string) || "",
    };
    setNotices([newNotice, ...notices]);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ALERT":
        return <Badge variant="destructive">{t("alert")}</Badge>;
      case "DEVELOPMENT":
        return <Badge className="bg-green-600 dark:bg-green-700">{t("development")}</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{t("general")}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("noticeBoardTitle")}</h1>
          <p className="text-muted-foreground">{t("publishAnnouncements")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("publishNoticeBtn")}
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
            <form onSubmit={handleCreateNotice}>
              <DialogHeader>
                <DialogTitle>{t("createNewNotice")}</DialogTitle>
                <DialogDescription>
                  {t("createNoticeDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("noticeTitle")}</Label>
                  <Input id="title" name="title" required placeholder={t("noticeTitlePlaceholder")} className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t("noticeType")}</Label>
                  <Select name="type" defaultValue="GENERAL">
                    <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="GENERAL">{t("generalAnnouncement")}</SelectItem>
                      <SelectItem value="ALERT">{t("alertUrgent")}</SelectItem>
                      <SelectItem value="DEVELOPMENT">{t("developmentProject")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">{t("content")}</Label>
                  <Textarea id="content" name="content" required placeholder={t("detailedInfo")} className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">{t("expiryDate")}</Label>
                  <Input id="expiresAt" name="expiresAt" type="date" className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">{t("publish")}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notices.map((notice) => (
          <Card key={notice.id} className="flex flex-col dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                {getTypeBadge(notice.type)}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(notice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-2 text-lg">{notice.title}</CardTitle>
              <CardDescription>
                {t("published")}: {new Date(notice.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {notice.content}
            </CardContent>
            {notice.expiresAt && (
              <div className="px-6 pb-4 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                <Bell className="h-3 w-3 mr-1" /> {t("validUntil")}: {new Date(notice.expiresAt).toLocaleDateString()}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
