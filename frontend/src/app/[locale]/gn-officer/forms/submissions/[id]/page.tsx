"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("GNOfficer");
  const formId = params.id as string;
  const locale = params.locale as string;

  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchForm();
    fetchSubmissions();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/pdf-forms/${formId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setForm(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/pdf-forms/${formId}/submissions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setSubmissions(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-500">
            {form.title} - Submissions
          </h1>
          <p className="text-muted-foreground">View filled PDF forms submitted by residents.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Forms</CardTitle>
          <CardDescription>Total submissions: {submissions.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident Name</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No submissions yet.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.resident?.fullName || 'Unknown Resident'}
                      {sub.resident?.nic && <span className="block text-xs text-muted-foreground">{sub.resident.nic}</span>}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(sub.filledPdfUrl, '_blank')}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
