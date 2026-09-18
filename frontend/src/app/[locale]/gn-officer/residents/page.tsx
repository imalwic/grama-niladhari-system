"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function ResidentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await fetch("http://localhost:3001/residents", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setResidents(data);
      }
    } catch (error) {
      console.error("Failed to fetch residents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResident = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName") as string,
      nic: formData.get("nic") as string,
      householdNo: formData.get("household") as string, // Might need adjust backend
      category: formData.get("category") as string,
      gender: formData.get("gender") as string,
      maritalStatus: formData.get("maritalStatus") as string,
      occupation: formData.get("occupation") as string,
      highestEducation: formData.get("highestEducation") as string,
      religion: formData.get("religion") as string,
    };

    try {
      const res = await fetch("http://localhost:3001/residents", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        fetchResidents();
      }
    } catch (error) {
      console.error("Failed to create resident:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to verify this resident?")) return;
    try {
      const res = await fetch(`http://localhost:3001/residents/${id}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchResidents();
      }
    } catch (error) {
      console.error("Failed to verify resident:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;
    try {
      const res = await fetch(`http://localhost:3001/residents/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchResidents();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete resident");
      }
    } catch (error) {
      console.error("Failed to delete resident:", error);
      alert("An error occurred while deleting");
    }
  };

  const filteredResidents = residents.filter((r) =>
    (r.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.nic || "").includes(searchTerm) ||
    (r.household?.houseNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("residentsTitle")}</h1>
          <p className="text-muted-foreground">{t("manageResidents")}</p>
        </div>
        <div className="flex gap-2">
          {/* Add New Component */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> {t("addResidentBtn")}
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateResident}>
                <DialogHeader>
                  <DialogTitle>{t("registerNewResident")}</DialogTitle>
                  <DialogDescription>
                    {t("addResidentDesc")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullName" className="text-right">{t("fullName")}</Label>
                    <Input id="fullName" name="fullName" required className="col-span-3" placeholder={t("residentFullName")} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nic" className="text-right">{t("nationalId")}</Label>
                    <Input id="nic" name="nic" required className="col-span-3" placeholder={t("nationalId")} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="household" className="text-right">{t("householdNo")}</Label>
                    <Input id="household" name="household" className="col-span-3" placeholder={t("householdNo")} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">{t("category")}</Label>
                    <div className="col-span-3">
                      <Select name="category">
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectCategory")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gov">{t("govEmployee")}</SelectItem>
                          <SelectItem value="private">{t("privateSector")}</SelectItem>
                          <SelectItem value="self">{t("selfEmployed")}</SelectItem>
                          <SelectItem value="student">{t("student")}</SelectItem>
                          <SelectItem value="senior">{t("seniorCitizen")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">{t("gender")}</Label>
                    <div className="col-span-3">
                      <Select name="gender">
                        <SelectTrigger><SelectValue placeholder={t("gender")} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">{t("male")}</SelectItem>
                          <SelectItem value="Female">{t("female")}</SelectItem>
                          <SelectItem value="Other">{t("otherGender")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maritalStatus" className="text-right">{t("maritalStatus")}</Label>
                    <div className="col-span-3">
                      <Select name="maritalStatus">
                        <SelectTrigger><SelectValue placeholder={t("maritalStatus")} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unmarried">{t("unmarried")}</SelectItem>
                          <SelectItem value="Married">{t("married")}</SelectItem>
                          <SelectItem value="Divorced">{t("divorced")}</SelectItem>
                          <SelectItem value="Widowed">{t("widowed")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="occupation" className="text-right">{t("occupation")}</Label>
                    <Input id="occupation" name="occupation" className="col-span-3" placeholder="E.g. Teacher, Engineer" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="highestEducation" className="text-right">{t("highestEducation")}</Label>
                    <Input id="highestEducation" name="highestEducation" className="col-span-3" placeholder="E.g. O/L, Degree" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="religion" className="text-right">{t("religion")}</Label>
                    <Input id="religion" name="religion" className="col-span-3" placeholder="E.g. Buddhism, Islam" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("saveResident")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchResidents")}
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
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("nationalId")}</TableHead>
              <TableHead>{t("households")}</TableHead>
              <TableHead>{t("categoryTag")}</TableHead>
              <TableHead>{t("verification")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredResidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t("noResidentsFound")}
                </TableCell>
              </TableRow>
            ) : filteredResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.fullName}</TableCell>
                <TableCell>{resident.nic}</TableCell>
                <TableCell className="font-mono">{resident.household?.houseNumber || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
                    {resident.categoryTags && resident.categoryTags.length > 0 ? resident.categoryTags[0]?.category?.name : "General"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={resident.isVerified ? "default" : "secondary"} 
                    className={resident.isVerified ? "bg-green-600" : "bg-orange-500"}
                  >
                    {resident.isVerified ? c("verified") : c("pending")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {!resident.isVerified && (
                     <Button variant="ghost" size="icon" onClick={() => handleApprove(resident.id)} className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-950 mr-1" title={t("verifyResident")}>
                       <ShieldCheck className="h-4 w-4" />
                     </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(resident.id)} className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950" title="Delete Resident">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
