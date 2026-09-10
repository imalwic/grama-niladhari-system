"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const MOCK_OFFICERS = [
  { id: 1, name: "Samantha Perera", division: "Weeraketiya North (WN-102)", phone: "0712345678", status: "Active" },
  { id: 2, name: "Nimali Fernando", division: "Weeraketiya South (WS-103)", phone: "0771234567", status: "Active" },
  { id: 3, name: "Kamal Addaraarachchi", division: "Middeniya (MD-201)", phone: "0751234567", status: "Inactive" },
];

export default function GnManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations("SuperAdmin");
  const c = useTranslations("Common");

  const filteredOfficers = MOCK_OFFICERS.filter((officer) =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("gnOfficersManagement")}</h1>
          <p className="text-muted-foreground">{t("manageOfficers")}</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> {t("addNewOfficer")}
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("registerNewOfficer")}</DialogTitle>
              <DialogDescription>
                {t("registerOfficerDesc")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t("name")}</Label>
                <Input id="name" className="col-span-3" placeholder={t("name")} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nic" className="text-right">{t("nic")}</Label>
                <Input id="nic" className="col-span-3" placeholder={t("nic")} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="division" className="text-right">{t("wasama")}</Label>
                <Input id="division" className="col-span-3" placeholder={t("wasama")} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">{t("email")}</Label>
                <Input id="email" type="email" className="col-span-3" placeholder={t("email")} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700">{t("saveOfficer")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchOfficers")}
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
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("divisionWasama")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{c("status")}</TableHead>
              <TableHead className="text-right">{c("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOfficers.map((officer) => (
              <TableRow key={officer.id}>
                <TableCell className="font-medium">{officer.name}</TableCell>
                <TableCell>{officer.division}</TableCell>
                <TableCell>{officer.phone}</TableCell>
                <TableCell>
                  <Badge variant={officer.status === "Active" ? "default" : "secondary"} className={officer.status === "Active" ? "bg-green-600" : ""}>
                    {officer.status === "Active" ? c("active") : c("inactive")}
                  </Badge>
                </TableCell>
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
            {filteredOfficers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t("noOfficersFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
