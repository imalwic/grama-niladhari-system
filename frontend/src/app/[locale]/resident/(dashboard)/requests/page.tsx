"use client";

import { useState } from "react";
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

const MOCK_REQUESTS = [
  { id: "REQ-001", type: "Income Certificate", status: "PENDING", submittedDate: "2023-10-25", certificateUrl: null },
  { id: "REQ-002", type: "Character Certificate", status: "APPROVED", submittedDate: "2023-10-15", certificateUrl: "/cert-002.pdf" },
  { id: "REQ-003", type: "Residence Confirmation", status: "REJECTED", submittedDate: "2023-10-10", certificateUrl: null, reviewNotes: "Missing supporting documents." },
];

export default function ResidentRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("Resident");
  const c = useTranslations("Common");

  const filteredRequests = requests.filter(r => 
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("requestCertificate")}
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle>{t("newCertRequest")}</DialogTitle>
              <DialogDescription>
                {t("submitApplication")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t("certificateType")}</Label>
                <Select>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectValue placeholder={t("selectCertType")} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="income">{t("incomeCertificate")}</SelectItem>
                    <SelectItem value="character">{t("characterCertificate")}</SelectItem>
                    <SelectItem value="residence">{t("residenceConfirmation")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">{t("purposeReason")}</Label>
                <Textarea id="reason" placeholder={t("purposePlaceholder")} className="dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div className="space-y-2">
                <Label>{t("supportingDocs")}</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="text-xs text-slate-500">{t("fileFormats")}</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf, .jpg, .png" />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 w-full text-white">{t("submitRequest")}</Button>
            </DialogFooter>
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
                <TableCell className="font-medium font-mono text-xs">{req.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    {req.type}
                  </div>
                </TableCell>
                <TableCell>{req.submittedDate}</TableCell>
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
