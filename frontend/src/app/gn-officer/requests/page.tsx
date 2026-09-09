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

const MOCK_REQUESTS = [
  { id: "REQ-001", residentName: "Kamal Perera", nic: "198012345678", type: "Income Certificate", status: "PENDING", submittedDate: "2023-10-25" },
  { id: "REQ-002", residentName: "Saman Kumara", nic: "199298765432", type: "Character Certificate", status: "PENDING", submittedDate: "2023-10-24" },
  { id: "REQ-003", residentName: "Nimali Silva", nic: "198512345678", type: "Residence Confirmation", status: "APPROVED", submittedDate: "2023-10-20" },
];

export default function GnOfficerRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const filteredRequests = requests.filter(r => 
    r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.nic.includes(searchTerm) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "APPROVED": return <Badge className="bg-green-600">Approved</Badge>;
      case "PENDING": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Needs Review</Badge>;
      case "REJECTED": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366]">Certificate Requests</h1>
          <p className="text-muted-foreground">Review and approve resident requests to generate PDFs.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Resident Name, NIC, or Type..."
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
              <TableHead>Resident</TableHead>
              <TableHead>Certificate Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>
                  <div className="font-medium">{req.residentName}</div>
                  <div className="text-xs text-slate-500">{req.nic}</div>
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
                         <Button variant="outline" size="sm" className="h-8 border-[#003366] text-[#003366] hover:bg-slate-50">
                           Review
                         </Button>
                      } />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review Request: {req.type}</DialogTitle>
                          <DialogDescription>
                            Review the details and issue the certificate or reject the request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                           <div className="bg-slate-50 p-4 rounded-md text-sm">
                              <p><strong>Resident:</strong> {req.residentName} ({req.nic})</p>
                              <p className="mt-2"><strong>Reason for Request:</strong> Needs to submit to the bank for a housing loan.</p>
                           </div>
                           <div className="space-y-2">
                              <Label>GN Officer Notes (Visible on Rejection)</Label>
                              <Textarea placeholder="If rejecting, explain why..." />
                           </div>
                        </div>
                        <DialogFooter className="flex-row sm:justify-between gap-2">
                          <Button variant="destructive" className="w-full sm:w-auto">
                            <XCircle className="w-4 h-4 mr-2"/> Reject
                          </Button>
                          <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="w-4 h-4 mr-2"/> Approve & Generate PDF
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {req.status === "APPROVED" && (
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500" disabled>
                      Processed
                    </Button>
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
