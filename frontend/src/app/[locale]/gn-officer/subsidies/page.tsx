"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function GnOfficerSubsidies() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // New program state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:3001/subsidies/programs/gn", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/subsidies/programs", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description, amount: parseFloat(amount) }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setName("");
        setDescription("");
        setAmount("");
        await fetchPrograms();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const loadApplications = async (program: any) => {
    setSelectedProgram(program);
    try {
      const res = await fetch(`http://localhost:3001/subsidies/programs/${program.id}/applications`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:3001/subsidies/applications/${appId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Refresh applications
        loadApplications(selectedProgram);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400 flex items-center gap-2">
            <Gift className="h-6 w-6" /> Subsidies Programs
          </h1>
          <p className="text-muted-foreground">Manage relief and subsidy programs for your division.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Program
            </Button>
          } />
          <DialogContent>
            <form onSubmit={handleCreateProgram}>
              <DialogHeader>
                <DialogTitle>Create Subsidy Program</DialogTitle>
                <DialogDescription>Add a new government relief or subsidy program.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Program Name</Label>
                  <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Samurdhi, Fertilizer Subsidy" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea required value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amount (LKR) - Optional</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>Create Program</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map(program => (
          <div key={program.id} className="border rounded-lg p-4 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{program.name}</h3>
                <Badge variant={program.isActive ? "default" : "secondary"}>
                  {program.isActive ? "Active" : "Closed"}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{program.description}</p>
              {program.amount && <p className="font-mono font-semibold mb-2">LKR {program.amount.toFixed(2)}</p>}
            </div>
            
            <Dialog>
              <DialogTrigger render={
                <Button variant="outline" className="w-full mt-4" onClick={() => loadApplications(program)}>
                  View Applications ({program._count?.applications || 0})
                </Button>
              } />
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{program.name} Applications</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Household No</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono">{app.household?.houseNumber}</TableCell>
                        <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={app.status === 'APPROVED' ? 'default' : app.status === 'REJECTED' ? 'destructive' : 'secondary'}
                            className={app.status === 'APPROVED' ? 'bg-green-600' : ''}
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status === 'PENDING' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleUpdateStatus(app.id, 'REJECTED')}>
                                Reject
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(app.id, 'APPROVED')}>
                                Approve
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {applications.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No applications yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>
        ))}
        {!loading && programs.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
            No subsidy programs created yet.
          </div>
        )}
      </div>
    </div>
  );
}
