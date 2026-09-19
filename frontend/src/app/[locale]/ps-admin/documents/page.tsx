"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { Search, FileText, Download } from "lucide-react";

type SharedDocument = {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
};

export default function PSAdminDocumentsPage() {
  const t = useTranslations("SuperAdmin");
  const [data, setData] = useState<SharedDocument[]>([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/documents/ps", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("receivedDocsTitle")}</h1>
          <p className="text-muted-foreground">{t("receivedDocsDesc")}</p>
        </div>
      </div>

      <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{t("inboxTitle")}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchDocsPlaceholder")}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dateReceivedCol")}</TableHead>
                  <TableHead>{t("titleCol")}</TableHead>
                  <TableHead className="text-right">{t("actionCol")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-sm">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                        <Download className="mr-2 h-4 w-4" /> {t("viewDownloadBtn")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                      {t("noPsDocsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
