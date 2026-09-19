"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Search, Eye, AlertCircle, CheckCircle2 } from "lucide-react";

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

export default function GrievancesManagementPage() {
  const t = useTranslations("SuperAdmin");
  const [data, setData] = useState<GrievanceType[]>([]);
  const [search, setSearch] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceType | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/grievances", {
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
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/grievances/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (selectedGrievance) setSelectedGrievance({ ...selectedGrievance, status });
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredData = data.filter(item => 
    item.subject.toLowerCase().includes(search.toLowerCase()) || 
    item.identityNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.reportedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-700 dark:text-red-500">{t("publicGrievancesTitle")}</h1>
          <p className="text-muted-foreground">{t("monitorGrievancesDesc")}</p>
        </div>
      </div>

      <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{t("grievanceInboxTitle")}</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="{t("searchGrievancePlaceholder")}"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dateCol")}</TableHead>
                  <TableHead>{t("citizenCol")}</TableHead>
                  <TableHead>{t("subjectCol")}</TableHead>
                  <TableHead>{t("statusCol")}</TableHead>
                  <TableHead>{t("actionsCol")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="text-sm">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{g.reportedBy}</div>
                      <div className="text-xs text-muted-foreground">{g.identityType}: {g.identityNumber}</div>
                    </TableCell>
                    <TableCell className="font-medium">{g.subject}</TableCell>
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
                        <Eye className="mr-2 h-4 w-4" /> {t("viewBtn")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {t("noGrievancesFound")}
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
          <DialogContent className="sm:max-w-[600px] dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl">{t("reviewGrievanceTitle")}</DialogTitle>
              <DialogDescription>
                {t("submittedOn")} {new Date(selectedGrievance.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div>
                  <span className="text-muted-foreground block mb-1">{t("reportedByLabel")}</span>
                  <span className="font-medium">{selectedGrievance.reportedBy}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">{t("identityDocLabel")}</span>
                  <span className="font-medium">{selectedGrievance.identityType}: {selectedGrievance.identityNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-1">{t("contactInfoLabel")}</span>
                  <span className="font-medium">{selectedGrievance.contactInfo || "N/A"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("subjectCol")}</h4>
                <p className="text-sm font-medium p-3 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                  {selectedGrievance.subject}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{t("detailedDescLabel")}</h4>
                <div className="text-sm p-4 border rounded-md min-h-[100px] whitespace-pre-wrap dark:border-slate-700">
                  {selectedGrievance.description}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4 dark:border-slate-800">
                <span className="text-sm font-medium">{t("updateStatusLabel")}</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedGrievance.status === 'INVESTIGATING' ? 'default' : 'outline'}
                    className={selectedGrievance.status === 'INVESTIGATING' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    onClick={() => updateStatus(selectedGrievance.id, 'INVESTIGATING')}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" /> {t("investigatingBtn")}
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedGrievance.status === 'RESOLVED' ? 'default' : 'outline'}
                    className={selectedGrievance.status === 'RESOLVED' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => updateStatus(selectedGrievance.id, 'RESOLVED')}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> {t("resolvedBtn")}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
