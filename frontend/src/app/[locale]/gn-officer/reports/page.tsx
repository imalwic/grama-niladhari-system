"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, Eye } from "lucide-react";

export default function GNOfficerReportsPage() {
  const t = useTranslations("GNOfficer");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [previewingId, setPreviewingId] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/reports/gn", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setReports(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/reports/${id}/${action}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId("");
    }
  };

  const handlePreview = async (id: string) => {
    setPreviewingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/reports/${id}/preview`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.pdfUrl) {
          window.open(data.pdfUrl, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewingId("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("psReportRequestsTitle")}</h1>
        <p className="text-muted-foreground">{t("approveRejectDesc")}</p>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("requestedDateCol")}</TableHead>
              <TableHead>{t("requestedByCol")}</TableHead>
              <TableHead>{t("typeCol")}</TableHead>
              <TableHead>{t("statusCol")}</TableHead>
              <TableHead className="text-right">{t("actionCol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="font-medium">{report.requestedBy?.name}</div>
                  <div className="text-xs text-muted-foreground">{t("psAdminRole")}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{report.reportType.replace(/_/g, ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={report.status === 'APPROVED' ? 'default' : report.status === 'REJECTED' ? 'destructive' : 'secondary'}
                         className={report.status === 'APPROVED' ? 'bg-green-600' : ''}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {report.status === 'PENDING' && (
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        disabled={previewingId === report.id || processingId === report.id}
                        onClick={() => handlePreview(report.id)}
                      >
                        <Eye className="mr-1 h-4 w-4" /> {previewingId === report.id ? t("loadingBtnText") : t("previewBtn")}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={processingId === report.id || previewingId === report.id}
                        onClick={() => handleAction(report.id, 'reject')}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> {t("rejectBtn")}
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={processingId === report.id || previewingId === report.id}
                        onClick={() => handleAction(report.id, 'approve')}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" /> 
                        {processingId === report.id ? t("generatingBtnText") : t("approveBtn")}
                      </Button>
                    </div>
                  )}
                  {report.status === 'APPROVED' && report.pdfUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(report.pdfUrl, '_blank')}>
                      {t("viewSentPdfBtn")}
                    </Button>
                  )}
                  {report.status === 'REJECTED' && (
                    <span className="text-sm text-muted-foreground">{t("noActionReq")}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {loading ? t("loadingBtnText") : t("noReportReqsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
