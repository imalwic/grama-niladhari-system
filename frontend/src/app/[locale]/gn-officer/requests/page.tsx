"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import { useTranslations } from "next-intl";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function GnOfficerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/requests/gn-officer", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(r => 
    r.resident?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.resident?.nic?.includes(searchTerm) ||
    r.requestType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "APPROVED": return <Badge className="bg-green-600 dark:bg-green-700">{c("approved")}</Badge>;
      case "PENDING": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800">{t("needsReview")}</Badge>;
      case "REJECTED": return <Badge variant="destructive">{c("rejected")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/requests/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes: reviewNotes }),
      });
      if (res.ok) {
        setReviewNotes("");
        await fetchRequests();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewApplicationPdf = async (reqId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/requests/${reqId}/application`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error("Failed to fetch application PDF", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("certificateRequests")}</h1>
          <p className="text-muted-foreground">{t("reviewRequests")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchRequests")}
            className="pl-8 dark:bg-slate-900 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{c("resident")}</TableHead>
              <TableHead>{t("certificateType")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{c("status")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-medium">{req.resident?.fullName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{req.resident?.nic}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    {req.requestType}
                  </div>
                </TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  {req.status === "PENDING" && (
                    <Dialog onOpenChange={(open) => { if(!open) setReviewNotes(""); }}>
                      <DialogTrigger render={
                         <Button variant="outline" size="sm" className="h-8 border-[#003366] text-[#003366] hover:bg-slate-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300">
                           {t("review")}
                         </Button>
                      } />
                      <DialogContent className="dark:bg-slate-900 dark:border-slate-800 max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{t("reviewRequest")}: {req.requestType}</DialogTitle>
                          <DialogDescription>
                            {t("reviewRequestDesc")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-2 space-y-4">
                           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm border dark:border-slate-700">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p><strong>{c("resident")}:</strong> {req.resident?.fullName} ({req.resident?.nic})</p>
                                  <p><strong>Household No:</strong> {req.resident?.household?.houseNumber || "N/A"}</p>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => handleViewApplicationPdf(req.id)} className="h-8 text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 border-blue-200 dark:border-blue-800">
                                  <Download className="w-3 h-3 mr-2" /> Application PDF
                                </Button>
                              </div>
                              <div className="mt-3 p-3 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded text-xs whitespace-pre-wrap">
                                <strong>Reason / Details:</strong><br/>
                                {req.reason || "No details provided"}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label>{t("gnNotes")}</Label>
                              <Textarea 
                                placeholder={t("rejectExplanation")} 
                                value={reviewNotes} 
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-700" 
                              />
                           </div>
                        </div>
                        <DialogFooter className="flex-row sm:justify-between gap-2 pt-2">
                          <Button 
                            variant="destructive" 
                            disabled={submitting}
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            className="w-full sm:w-auto">
                            <XCircle className="w-4 h-4 mr-2"/> {t("reject")}
                          </Button>
                          <Button 
                            disabled={submitting}
                            onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white">
                            <CheckCircle2 className="w-4 h-4 mr-2"/> {t("approveGenerate")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {req.status === "APPROVED" && (
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500 dark:text-slate-400" disabled>
                      {t("processed")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {loading ? "Loading..." : t("noRequestsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
