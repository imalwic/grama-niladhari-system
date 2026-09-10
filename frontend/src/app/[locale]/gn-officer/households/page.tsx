"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";

const MOCK_HOUSEHOLDS = [
  { id: 1, householdNo: "H-001", address: "No 12, Main Street, Weeraketiya", membersCount: 4 },
  { id: 2, householdNo: "H-002", address: "No 45, Temple Road, Weeraketiya", membersCount: 2 },
  { id: 3, householdNo: "H-003", address: "No 8, School Lane, Weeraketiya", membersCount: 5 },
];

export default function HouseholdsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  const filteredHouseholds = MOCK_HOUSEHOLDS.filter((h) =>
    h.householdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
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

          <Dialog>
            <DialogTrigger render={
              <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> {t("addHousehold")}
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("registerNewHousehold")}</DialogTitle>
                <DialogDescription>{t("createNewHousehold")}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="houseNo" className="text-right">{t("householdNo")}</Label>
                  <Input id="houseNo" className="col-span-3" placeholder={t("householdNo")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">{t("address")}</Label>
                  <Input id="address" className="col-span-3" placeholder={t("address")} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">{t("saveHousehold")}</Button>
              </DialogFooter>
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
            {filteredHouseholds.map((household) => (
              <TableRow key={household.id}>
                <TableCell className="font-medium font-mono">{household.householdNo}</TableCell>
                <TableCell>{household.address}</TableCell>
                <TableCell>{household.membersCount} {t("members")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredHouseholds.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">{t("noHouseholdsFound")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
