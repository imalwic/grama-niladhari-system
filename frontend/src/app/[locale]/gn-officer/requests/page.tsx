"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, FileText, CheckCircle2, XCircle, FileSignature } from "lucide-react";
import { useTranslations } from "next-intl";

const MOCK_REQUESTS = [
  { id: "REQ-001", residentName: "Kamal Perera", nic: "198012345678", type: "Income Certificate", status: "PENDING", submittedDate: "2023-10-25" },
  { id: "REQ-002", residentName: "Saman Kumara", nic: "199298765432", type: "Character Certificate", status: "PENDING", submittedDate: "2023-10-24" },
  { id: "REQ-003", residentName: "Nimali Silva", nic: "198512345678", type: "Residence Confirmation", status: "APPROVED", submittedDate: "2023-10-20" },
];

export default function GnOfficerRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  const filteredRequests = requests.filter(r => 
    r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.nic.includes(searchTerm) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "APPROVED": return <Badge className="bg-green-600 dark:bg-green-700">{c("approved")}</Badge>;
      case "PENDING": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800">{t("needsReview")}</Badge>;
      case "REJECTED": return <Badge variant="destructive">{c("rejected")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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
            className="pl-8"
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
                  <div className="font-medium">{req.residentName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{req.nic}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-slate-400" />
                    {req.type}
                  </div>
                </TableCell>
                <TableCell>{req.submittedDate}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  {req.status === "PENDING" && (
                    <Dialog>
                      <DialogTrigger render={
                         <Button variant="outline" size="sm" className="h-8 border-[#003366] text-[#003366] hover:bg-slate-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-slate-800 dark:hover:text-blue-300">
                           {t("review")}
                         </Button>
                      } />
                      <DialogContent className="dark:bg-slate-900 dark:border-slate-800">
                        <DialogHeader>
                          <DialogTitle>{t("reviewRequest")}: {req.type}</DialogTitle>
                          <DialogDescription>
                            {t("reviewRequestDesc")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md text-sm">
                              <p><strong>{c("resident")}:</strong> {req.residentName} ({req.nic})</p>
                              <p className="mt-2"><strong>{t("reasonForRequest")}:</strong> {t("bankLoanReason")}</p>
                           </div>
                           <div className="space-y-2">
                              <Label>{t("gnNotes")}</Label>
                              <Textarea placeholder={t("rejectExplanation")} className="dark:bg-slate-800 dark:border-slate-700" />
                           </div>
                        </div>
                        <DialogFooter className="flex-row sm:justify-between gap-2">
                          <Button variant="destructive" className="w-full sm:w-auto">
                            <XCircle className="w-4 h-4 mr-2"/> {t("reject")}
                          </Button>
                          <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white">
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
