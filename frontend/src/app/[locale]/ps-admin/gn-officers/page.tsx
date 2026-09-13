"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GnManagement() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [wasamas, setWasamas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", nic: "", division: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("SuperAdmin");
  const c = useTranslations("Common");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchOfficersAndWasamas = async () => {
    try {
      const headers = getAuthHeaders();
      const [officersRes, wasamasRes] = await Promise.all([
        fetch("http://localhost:3001/users/gn-officers", { headers }),
        fetch("http://localhost:3001/wasamas", { headers })
      ]);
      
      if (officersRes.ok) {
        const data = await officersRes.json();
        setOfficers(data);
      }
      
      if (wasamasRes.ok) {
        const wData = await wasamasRes.json();
        setWasamas(wData);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficersAndWasamas();
  }, []);

  const filteredOfficers = officers.filter((officer) =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.wasama?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/users/gn-officers", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          nic: formData.nic,
          email: formData.email,
          wasamaCode: formData.division, // We expect name or code here
        }),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        setFormData({ name: "", nic: "", division: "", email: "" });
        await fetchOfficersAndWasamas();
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to add GN Officer");
      }
    } catch (err) {
      setError("Failed to communicate with server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this GN Officer?")) return;
    try {
      const res = await fetch(`http://localhost:3001/users/gn-officers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await fetchOfficersAndWasamas();
      }
    } catch (err) {
      console.error("Failed to delete officer", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("gnOfficersManagement")}</h1>
          <p className="text-muted-foreground">{t("manageOfficers")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("addNewOfficer")}
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{t("registerNewOfficer")}</DialogTitle>
                <DialogDescription>
                  {t("registerOfficerDesc")} (Default password: password123)
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{t("name")}</Label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="col-span-3" placeholder={t("name")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nic" className="text-right">{t("nic")}</Label>
                  <Input id="nic" required value={formData.nic} onChange={e => setFormData({...formData, nic: e.target.value})} className="col-span-3" placeholder={t("nic")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="division" className="text-right">{t("wasama")}</Label>
                  <div className="col-span-3">
                    <Select value={formData.division} onValueChange={(val) => setFormData({...formData, division: val || ""})}>
                      <SelectTrigger id="division">
                        <SelectValue placeholder="Select a Wasama" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasamas.map((w: any) => (
                          <SelectItem key={w.id} value={w.name}>
                            {w.name} ({w.code})
                          </SelectItem>
                        ))}
                        {wasamas.length === 0 && (
                          <SelectItem value="none" disabled>No Wasamas found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">{t("email")}</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="col-span-3" placeholder={t("email")} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                  {submitting ? "Saving..." : t("saveOfficer")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchOfficers")}
            className="pl-8 dark:bg-slate-900 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("divisionWasama")}</TableHead>
              <TableHead>Email / NIC</TableHead>
              <TableHead>{c("status")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOfficers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell className="font-medium">{officer.name}</TableCell>
                <TableCell>{officer.wasama?.name || "Unassigned"}</TableCell>
                <TableCell>
                  <div className="text-sm">{officer.email}</div>
                  <div className="text-xs text-muted-foreground">{officer.nic}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    {c("active")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(officer.id)} className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOfficers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {loading ? "Loading..." : t("noOfficersFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
