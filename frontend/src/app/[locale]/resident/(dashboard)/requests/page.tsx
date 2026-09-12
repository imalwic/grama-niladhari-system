"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Download, Eye, FileText, Search, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import Tesseract from 'tesseract.js';

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function ResidentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // OCR State
  const [ocrText, setOcrText] = useState("");
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // We only process images for OCR (PDFs require pdf.js first)
    if (file.type.startsWith('image/')) {
      setIsOcrProcessing(true);
      setOcrText("");
      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: m => console.log(m)
        });
        
        const text = result.data.text;
        // Regex to find Old NIC (9 digits + V/X) or New NIC (12 digits)
        const nicRegex = /\b\d{9}[vVxX]|\d{12}\b/g;
        const foundNics = text.match(nicRegex);
        
        if (foundNics) {
          setOcrText(`NIC detected: ${foundNics[0].toUpperCase()}`);
        } else {
          setOcrText("Processed successfully but no NIC detected.");
        }
      } catch (err) {
        console.error("OCR failed", err);
        setOcrText("Failed to process image.");
      } finally {
        setIsOcrProcessing(false);
      }
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/requests/resident", {
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
  const t = useTranslations("Resident");
  const c = useTranslations("Common");

  const filteredRequests = requests.filter(r => 
    r.requestType?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestType || !reason) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/requests", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ requestType, reason }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setRequestType("");
        setReason("");
        await fetchRequests(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to submit request", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "APPROVED": return <Badge className="bg-green-600 dark:bg-green-700">{c("approved")}</Badge>;
      case "PENDING": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800">{t("pendingReview")}</Badge>;
      case "REJECTED": return <Badge variant="destructive">{c("rejected")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("myRequests")}</h1>
          <p className="text-muted-foreground">{t("requestAndTrack")}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("requestCertificate")}
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{t("newCertRequest")}</DialogTitle>
                <DialogDescription>
                  {t("submitApplication")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("certificateType")}</Label>
                  <Select value={requestType} onValueChange={(v) => setRequestType(v || "")} required>
                    <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectValue placeholder={t("selectCertType")} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="Income Certificate">{t("incomeCertificate")}</SelectItem>
                      <SelectItem value="Character Certificate">{t("characterCertificate")}</SelectItem>
                      <SelectItem value="Residence Confirmation">{t("residenceConfirmation")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">{t("purposeReason")}</Label>
                  <Textarea id="reason" required value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("purposePlaceholder")} className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label>{t("supportingDocs")}</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800 relative">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="text-xs text-slate-500">{t("fileFormats")}</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf, .jpg, .png" onChange={handleFileUpload} />
                    {isOcrProcessing && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center rounded-lg">
                        <span className="text-sm font-medium animate-pulse text-blue-600">Scanning Document with AI...</span>
                      </div>
                    )}
                  </label>
                  {ocrText && (
                     <div className="text-xs p-2 mt-2 bg-blue-50 text-blue-700 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                       <span className="font-semibold">AI Verification: </span>
                       {ocrText}
                     </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 w-full text-white">
                  {submitting ? "Submitting..." : t("submitRequest")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              <TableHead>{t("requestId")}</TableHead>
              <TableHead>{t("certificateType")}</TableHead>
              <TableHead>{t("dateSubmitted")}</TableHead>
              <TableHead>{c("status")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium font-mono text-xs">{req.id.substring(0, 8).toUpperCase()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    {req.requestType}
                  </div>
                </TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  {req.status === "APPROVED" && (
                    <Button variant="outline" size="sm" className="h-8 text-green-700 border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-800">
                      <Download className="mr-2 h-3 w-3" /> {t("downloadPdf")}
                    </Button>
                  )}
                  {req.status === "REJECTED" && req.reviewNotes && (
                    <Dialog>
                      <DialogTrigger render={
                         <Button variant="ghost" size="sm" className="h-8 text-red-600 dark:text-red-400">
                           <Eye className="mr-2 h-3 w-3" /> {t("viewReason")}
                         </Button>
                      } />
                      <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
                        <DialogHeader>
                          <DialogTitle>{t("rejectionReason")}</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-slate-700 dark:text-slate-300 py-4">{req.reviewNotes}</p>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t("noRequestsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
