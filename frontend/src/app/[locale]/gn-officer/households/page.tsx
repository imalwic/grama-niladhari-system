"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function HouseholdsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [households, setHouseholds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null);
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      const res = await fetch("http://localhost:3001/households", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setHouseholds(data);
      }
    } catch (error) {
      console.error("Failed to fetch households:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this household?")) return;
    try {
      const res = await fetch(`http://localhost:3001/households/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchHouseholds();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete household");
      }
    } catch (error) {
      console.error("Failed to delete household:", error);
      alert("An error occurred while deleting");
    }
  };

  const handleCreateHousehold = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      houseNumber: formData.get("houseNo") as string,
      address: formData.get("address") as string,
    };

    try {
      const res = await fetch("http://localhost:3001/households", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsDialogOpen(false);
        fetchHouseholds();
      }
    } catch (error) {
      console.error("Failed to create household:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHouseholds = households.filter((h) =>
    (h.houseNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("householdsTitle")}</h1>
          <p className="text-muted-foreground">{t("manageHouseholds")}</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger render={
              <Button variant="outline" className="border-[#003366] text-[#003366] dark:border-blue-500 dark:text-blue-400">
                <UploadCloud className="mr-2 h-4 w-4" /> {t("bulkImport")}
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("bulkImportTitle")}</DialogTitle>
                <DialogDescription>{t("bulkImportDesc")}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center w-full mt-4">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">{t("clickToUpload")}</span> {t("orDragDrop")}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t("csvXlsx")}</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".csv, .xlsx" />
                </label>
              </div>
              <DialogFooter className="mt-4">
                <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 w-full">{t("uploadProcess")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> {t("addHousehold")}
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateHousehold}>
                <DialogHeader>
                  <DialogTitle>{t("registerNewHousehold")}</DialogTitle>
                  <DialogDescription>{t("createNewHousehold")}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="houseNo" className="text-right">{t("householdNo")}</Label>
                    <Input id="houseNo" name="houseNo" required className="col-span-3" placeholder={t("householdNo")} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">{t("address")}</Label>
                    <Input id="address" name="address" required className="col-span-3" placeholder={t("address")} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("saveHousehold")}
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
          <Input placeholder={t("searchHouseholds")} className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("householdNo")}</TableHead>
              <TableHead>{t("address")}</TableHead>
              <TableHead>{t("registeredMembers")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredHouseholds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">{t("noHouseholdsFound")}</TableCell>
              </TableRow>
            ) : filteredHouseholds.map((household) => (
              <TableRow 
                key={household.id} 
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                onClick={() => setSelectedHousehold(household)}
              >
                <TableCell className="font-medium font-mono">{household.houseNumber}</TableCell>
                <TableCell>{household.address}</TableCell>
                <TableCell>{household.residents?.length || 0} {t("members")}</TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(household.id, e)} className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950" title="Delete Household">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Members Modal */}
      <Dialog open={!!selectedHousehold} onOpenChange={(open) => !open && setSelectedHousehold(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("householdMembers")}</DialogTitle>
            <DialogDescription>
              {selectedHousehold?.houseNumber} - {selectedHousehold?.address}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedHousehold?.residents && selectedHousehold.residents.length > 0 ? (
              <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedHousehold.residents.map((resident: any) => (
                      <TableRow key={resident.id}>
                        <TableCell className="font-medium">{resident.fullName}</TableCell>
                        <TableCell>{resident.nic || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            resident.isVerified ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {resident.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No members registered for this household yet.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedHousehold(null)} className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
