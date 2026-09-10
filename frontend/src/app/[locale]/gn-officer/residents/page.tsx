"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const MOCK_RESIDENTS = [
  { id: 1, name: "Kamal Perera", nic: "198012345678", household: "H-001", status: "Verified", category: "Gov Employee" },
  { id: 2, name: "Saman Kumara", nic: "199298765432", household: "H-002", status: "Pending", category: "Self Employed" },
  { id: 3, name: "Nimali Silva", nic: "198512345678", household: "H-003", status: "Verified", category: "Private Sector" },
];

export default function ResidentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("GnOfficer");
  const c = useTranslations("Common");

  const filteredResidents = MOCK_RESIDENTS.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.nic.includes(searchTerm) ||
    r.household.includes(searchTerm.toUpperCase())
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
          <Dialog>
            <DialogTrigger render={
              <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> {t("addResidentBtn")}
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("registerNewResident")}</DialogTitle>
                <DialogDescription>
                  {t("addResidentDesc")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">{t("fullName")}</Label>
                  <Input id="fullName" className="col-span-3" placeholder={t("residentFullName")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nic" className="text-right">{t("nationalId")}</Label>
                  <Input id="nic" className="col-span-3" placeholder={t("nationalId")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="household" className="text-right">{t("householdNo")}</Label>
                  <Input id="household" className="col-span-3" placeholder={t("householdNo")} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">{t("category")}</Label>
                  <div className="col-span-3">
                    <Select>
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
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">{t("saveResident")}</Button>
              </DialogFooter>
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
            {filteredResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell className="font-medium">{resident.name}</TableCell>
                <TableCell>{resident.nic}</TableCell>
                <TableCell className="font-mono">{resident.household}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800">
                    {resident.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={resident.status === "Verified" ? "default" : "secondary"} 
                    className={resident.status === "Verified" ? "bg-green-600" : "bg-orange-500"}
                  >
                    {resident.status === "Verified" ? c("verified") : c("pending")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {resident.status === "Pending" && (
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-950 mr-1" title={t("verifyResident")}>
                       <ShieldCheck className="h-4 w-4" />
                     </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredResidents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {t("noResidentsFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
