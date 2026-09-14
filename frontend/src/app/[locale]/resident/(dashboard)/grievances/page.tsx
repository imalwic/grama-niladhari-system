"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, CheckCircle2, Search, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type GrievanceType = {
  id: string;
  subject: string;
  description: string;
  assignedTo: string;
  status: string;
  createdAt: string;
  identityType: string;
  identityNumber: string;
  reportedBy: string;
  contactInfo: string;
};

export default function ResidentGrievancesPage() {
  const [data, setData] = useState<GrievanceType[]>([]);
  const [isFormView, setIsFormView] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceType | null>(null);

  // Form State
  const [identityType, setIdentityType] = useState("NIC");
  const [identityNumber, setIdentityNumber] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("GN_OFFICER");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/grievances/my-grievances", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch grievances", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFormView]); // Refetch when going back to list

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        identityType,
        identityNumber,
        reportedBy,
        contactInfo,
        subject,
        description,
        assignedTo
      };

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/grievances/resident", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit grievance");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md text-center border-t-4 border-t-green-600 shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Grievance Submitted</CardTitle>
            <CardDescription>
              Your complaint has been recorded successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            Thank you for bringing this to our attention. The assigned officer will review the matter shortly.
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setIsSubmitted(false);
                setIsFormView(false);
                setSubject("");
                setDescription("");
              }}
            >
              Return to Inbox
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isFormView) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <Button variant="ghost" onClick={() => setIsFormView(false)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inbox
        </Button>
        <Card className="border-t-4 border-t-red-700 shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:border-t-red-600">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Submit a Grievance</CardTitle>
              <CardDescription>
                Report an issue to your Grama Niladhari or escalate it to the Global Admin.
              </CardDescription>
              {errorMsg && <div className="text-red-500 text-sm font-semibold mt-2">{errorMsg}</div>}
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none border-b pb-2 dark:border-slate-800">Who should review this?</h3>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select value={assignedTo} onValueChange={(val) => setAssignedTo(val || "")}>
                    <SelectTrigger id="assignedTo" className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectValue placeholder="Select Authority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GN_OFFICER">Grama Niladhari (Local)</SelectItem>
                      <SelectItem value="GLOBAL_ADMIN">Global Admin (Central)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {assignedTo === "GN_OFFICER" 
                      ? "This will be sent directly to your Grama Niladhari for resolution." 
                      : "This will be escalated to the central authorities. Your Grama Niladhari will not see this."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none border-b pb-2 dark:border-slate-800">Identity Verification</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="identityType">Identity Document Type</Label>
                    <Select value={identityType} onValueChange={(val) => setIdentityType(val || "")}>
                      <SelectTrigger id="identityType" className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NIC">National Identity Card (NIC)</SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="DRIVING_LICENSE">Driving License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="identityNumber">Document Number</Label>
                    <Input 
                      id="identityNumber" 
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      required 
                      className="dark:bg-slate-800 dark:border-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reportedBy">Your Full Name</Label>
                    <Input 
                      id="reportedBy" 
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                      required 
                      className="dark:bg-slate-800 dark:border-slate-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Phone / Email</Label>
                    <Input 
                      id="contactInfo" 
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      required 
                      className="dark:bg-slate-800 dark:border-slate-700" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none border-b pb-2 dark:border-slate-800">Complaint Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief summary of the issue" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Please explain what happened in detail..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                    className="min-h-[150px] dark:bg-slate-800 dark:border-slate-700 resize-y" 
                  />
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Grievance Securely"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">My Grievances</h1>
          <p className="text-muted-foreground">Track your reported issues and complaints</p>
        </div>
        <Button onClick={() => setIsFormView(true)} className="bg-[#003366] hover:bg-[#002244] text-white">
          <Plus className="mr-2 h-4 w-4" /> New Grievance
        </Button>
      </div>

      <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>History</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subject..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="text-sm">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{g.subject}</TableCell>
                    <TableCell>
                      {g.assignedTo === 'GN_OFFICER' ? 'Grama Niladhari' : 'Global Admin'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        g.status === 'PENDING' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        g.status === 'INVESTIGATING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {g.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedGrievance(g)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No grievances found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedGrievance} onOpenChange={(open) => !open && setSelectedGrievance(null)}>
        {selectedGrievance && (
          <DialogContent className="sm:max-w-[500px] dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl">Grievance Details</DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedGrievance.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Subject</h4>
                <p className="text-sm font-medium p-3 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                  {selectedGrievance.subject}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Detailed Description</h4>
                <div className="text-sm p-4 border rounded-md min-h-[100px] whitespace-pre-wrap dark:border-slate-700">
                  {selectedGrievance.description}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                Assigned Authority: <strong>{selectedGrievance.assignedTo === 'GN_OFFICER' ? 'Grama Niladhari' : 'Global Admin'}</strong>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
