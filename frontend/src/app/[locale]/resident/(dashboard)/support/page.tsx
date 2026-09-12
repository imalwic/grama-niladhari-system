"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function SupportPage() {
  const t = useTranslations("Common");
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:3001/support", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/support", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setSubject("");
        setMessage("");
        await fetchTickets();
      }
    } catch (err) {
      console.error("Failed to submit ticket", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Open</Badge>;
      case "IN_PROGRESS": return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">In Progress</Badge>;
      case "RESOLVED": return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Resolved</Badge>;
      case "CLOSED": return <Badge variant="outline">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">
            {t("support")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Need help? Contact the GN officer or system administrators.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> New Ticket
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Contact Support</DialogTitle>
                <DialogDescription>
                  Please describe your issue in detail.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief summary of the issue" 
                    required 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your problem here..." 
                    required 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 w-full text-white">
                  {submitting ? "Sending..." : "Submit Ticket"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-12 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="dark:bg-slate-900 dark:border-slate-800 shadow-sm border-l-4 border-l-blue-500">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                  </div>
                  <CardDescription>
                    Ticket #{ticket.id.substring(0, 8).toUpperCase()} • {new Date(ticket.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                {getStatusBadge(ticket.status)}
              </CardHeader>
              <CardContent className="text-slate-700 dark:text-slate-300">
                <p className="whitespace-pre-wrap text-sm">{ticket.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 text-muted-foreground border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
            You don't have any support tickets yet.
          </div>
        )}
      </div>
    </div>
  );
}
