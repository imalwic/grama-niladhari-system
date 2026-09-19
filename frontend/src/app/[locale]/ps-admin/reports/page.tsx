"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PSAdminReportsPage() {
  const t = useTranslations("Reports");
  const [reports, setReports] = useState<any[]>([]);
  const [wasamas, setWasamas] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWasama, setSelectedWasama] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      
      const [reportsRes, wasamasRes] = await Promise.all([
        fetch("http://localhost:3001/reports/ps", { headers }),
        fetch("http://localhost:3001/wasamas", { headers })
      ]);
      
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (wasamasRes.ok) setWasamas(await wasamasRes.json());
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWasama) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/reports/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ wasamaId: selectedWasama })
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setSelectedWasama("");
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" /> {t("requestReport")}
            </Button>
          } />
          <DialogContent>
            <form onSubmit={handleRequest}>
              <DialogHeader>
                <DialogTitle>{t("requestWasamaReport")}</DialogTitle>
                <DialogDescription>
                  {t("requestDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">{t("wasamaLabel")}</Label>
                  <Select value={selectedWasama} onValueChange={(val) => setSelectedWasama(val || "")} required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("selectWasama")} />
                    </SelectTrigger>
                    <SelectContent>
                      {wasamas.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.name || w.code || t("unnamedWasama")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting || !selectedWasama}>
                  {submitting ? t("requesting") : t("sendRequest")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("requestedDate")}</TableHead>
              <TableHead>{t("wasamaLabel")}</TableHead>
              <TableHead>{t("statusLabel")}</TableHead>
              <TableHead className="text-right">{t("actionCol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{report.wasama?.name}</TableCell>
                <TableCell>
                  <Badge variant={report.status === 'APPROVED' ? 'default' : report.status === 'REJECTED' ? 'destructive' : 'secondary'}
                         className={report.status === 'APPROVED' ? 'bg-green-600' : ''}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {report.status === 'APPROVED' && report.pdfUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(report.pdfUrl, '_blank')}>
                      <Download className="mr-2 h-4 w-4" /> {t("downloadPdf")}
                    </Button>
                  )}
                  {report.status === 'PENDING' && (
                    <span className="text-sm text-muted-foreground italic">{t("waitingForGn")}</span>
                  )}
                  {report.status === 'REJECTED' && (
                    <span className="text-sm text-red-500 italic">{t("rejectedLabel")}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  {loading ? "Loading..." : t("noReports")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
