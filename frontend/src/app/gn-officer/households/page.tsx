"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, UploadCloud } from "lucide-react";

const MOCK_HOUSEHOLDS = [
  { id: 1, householdNo: "H-001", address: "No 12, Main Street, Weeraketiya", membersCount: 4 },
  { id: 2, householdNo: "H-002", address: "No 45, Temple Road, Weeraketiya", membersCount: 2 },
  { id: 3, householdNo: "H-003", address: "No 8, School Lane, Weeraketiya", membersCount: 5 },
];

export default function HouseholdsManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHouseholds = MOCK_HOUSEHOLDS.filter((h) =>
    h.householdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366]">Households</h1>
          <p className="text-muted-foreground">Manage households in your Wasama.</p>
        </div>
        <div className="flex gap-2">
          {/* Bulk Upload Component */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#003366] text-[#003366]">
                <UploadCloud className="mr-2 h-4 w-4" /> Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Bulk Import Households</DialogTitle>
                <DialogDescription>
                  Upload a CSV or Excel file containing legacy household records.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center w-full mt-4">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">CSV or XLSX (MAX. 10MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".csv, .xlsx" />
                </label>
              </div>
              <DialogFooter className="mt-4">
                <Button className="bg-[#003366] hover:bg-[#002244] w-full">Upload and Process</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add New Component */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#003366] hover:bg-[#002244]">
                <Plus className="mr-2 h-4 w-4" /> Add Household
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Register New Household</DialogTitle>
                <DialogDescription>
                  Create a new physical address record in your Wasama.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="houseNo" className="text-right">Household No</Label>
                  <Input id="houseNo" className="col-span-3" placeholder="e.g. H-102" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Address</Label>
                  <Input id="address" className="col-span-3" placeholder="Full physical address" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#003366] hover:bg-[#002244]">Save Household</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Household No or Address..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Household No</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Registered Members</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHouseholds.map((household) => (
              <TableRow key={household.id}>
                <TableCell className="font-medium font-mono">{household.householdNo}</TableCell>
                <TableCell>{household.address}</TableCell>
                <TableCell>{household.membersCount} Members</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredHouseholds.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No households found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
