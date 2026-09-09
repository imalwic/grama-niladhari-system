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

const MOCK_REQUESTS = [
  { id: "REQ-001", type: "Income Certificate", status: "PENDING", submittedDate: "2023-10-25", certificateUrl: null },
  { id: "REQ-002", type: "Character Certificate", status: "APPROVED", submittedDate: "2023-10-15", certificateUrl: "/cert-002.pdf" },
  { id: "REQ-003", type: "Residence Confirmation", status: "REJECTED", submittedDate: "2023-10-10", certificateUrl: null, reviewNotes: "Missing supporting documents." },
];

export default function ResidentRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = requests.filter(r => 
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "APPROVED": return <Badge className="bg-green-600">Approved</Badge>;
      case "PENDING": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Pending Review</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366]">My Requests</h1>
          <p className="text-muted-foreground">Request certificates and track their status.</p>
        </div>

        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244]">
              <Plus className="mr-2 h-4 w-4" /> Request Certificate
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Certificate Request</DialogTitle>
              <DialogDescription>
                Submit an application for a certificate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="type">Certificate Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income Certificate</SelectItem>
                    <SelectItem value="character">Character Certificate</SelectItem>
                    <SelectItem value="residence">Residence Confirmation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Purpose / Reason</Label>
                <Textarea id="reason" placeholder="e.g. Bank loan, Job application..." />
              </div>
              <div className="space-y-2">
                <Label>Supporting Documents (Optional)</Label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="text-xs text-slate-500">PDF, JPG or PNG (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf, .jpg, .png" />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#003366] hover:bg-[#002244] w-full">Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Certificate Type</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    <Button variant="outline" size="sm" className="h-8 text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
                      <Download className="mr-2 h-3 w-3" /> Download PDF
                    </Button>
                  )}
                  {req.status === "REJECTED" && req.reviewNotes && (
                    <Dialog>
                      <DialogTrigger render={
                         <Button variant="ghost" size="sm" className="h-8 text-red-600">
                           <Eye className="mr-2 h-3 w-3" /> View Reason
                         </Button>
                      } />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Rejection Reason</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-slate-700 py-4">{req.reviewNotes}</p>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
