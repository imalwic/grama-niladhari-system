"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gift, FileText } from "lucide-react";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function ResidentSubsidies() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
      const [progRes, appRes] = await Promise.all([
        fetch("http://localhost:3001/subsidies/programs/resident", { headers: getAuthHeaders() }),
        fetch("http://localhost:3001/subsidies/applications/resident", { headers: getAuthHeaders() })
      ]);
      
      if (progRes.ok) setPrograms(await progRes.json());
      if (appRes.ok) setApplications(await appRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = async (programId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/subsidies/programs/${programId}/apply`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        alert("Application submitted successfully!");
        fetchData();
      } else {
        alert("Failed to submit application. You might have already applied.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hasApplied = (programId: string) => {
    return applications.some(app => app.programId === programId);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400 flex items-center gap-2 mb-2">
          <Gift className="h-8 w-8" /> Subsidy Programs
        </h1>
        <p className="text-muted-foreground">Apply for government relief and financial assistance programs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map(program => {
          const applied = hasApplied(program.id);
          return (
            <div key={program.id} className="border rounded-xl p-5 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl text-[#003366] dark:text-blue-400 mb-2">{program.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{program.description}</p>
                {program.amount && (
                   <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold p-2 rounded-md mb-4 text-center">
                     LKR {program.amount.toFixed(2)}
                   </div>
                )}
              </div>
              <Button 
                onClick={() => handleApply(program.id)} 
                disabled={applied}
                className={`w-full ${applied ? 'bg-slate-100 text-slate-500' : 'bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 text-white'}`}
                variant={applied ? "outline" : "default"}
              >
                {applied ? "Already Applied" : "Apply Now"}
              </Button>
            </div>
          );
        })}
        {!loading && programs.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground bg-slate-50 dark:bg-slate-900">
            No active subsidy programs are currently available in your division.
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
           <FileText className="h-6 w-6 text-slate-500" /> My Applications
        </h2>
        <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800">
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.program?.name}</TableCell>
                  <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={app.status === 'APPROVED' ? 'default' : app.status === 'REJECTED' ? 'destructive' : 'secondary'}
                      className={app.status === 'APPROVED' ? 'bg-green-600' : ''}
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    You haven't applied to any subsidy programs yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
