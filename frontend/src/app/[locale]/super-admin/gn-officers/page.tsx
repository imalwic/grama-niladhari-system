"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const MOCK_OFFICERS = [
  { id: 1, name: "Samantha Perera", division: "Weeraketiya North (WN-102)", phone: "0712345678", status: "Active" },
  { id: 2, name: "Nimali Fernando", division: "Weeraketiya South (WS-103)", phone: "0771234567", status: "Active" },
  { id: 3, name: "Kamal Addaraarachchi", division: "Middeniya (MD-201)", phone: "0751234567", status: "Inactive" },
];

export default function GnManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOfficers = MOCK_OFFICERS.filter((officer) =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366]">GN Officers Management</h1>
          <p className="text-muted-foreground">Manage all Grama Niladhari officers in the Pradeshiya Sabha.</p>
        </div>
        <Dialog>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244]">
              <Plus className="mr-2 h-4 w-4" /> Add New Officer
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New GN Officer</DialogTitle>
              <DialogDescription>
                Create a new account for a Grama Niladhari. They will receive an email to set their password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nic" className="text-right">NIC</Label>
                <Input id="nic" className="col-span-3" placeholder="National ID" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="division" className="text-right">Wasama</Label>
                <Input id="division" className="col-span-3" placeholder="e.g. WN-102" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" className="col-span-3" placeholder="Official Email" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#003366] hover:bg-[#002244]">Save Officer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search officers or divisions..."
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
              <TableHead>Name</TableHead>
              <TableHead>Division (Wasama)</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    {officer.status}
                  </Badge>
                </TableCell>
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
            {filteredOfficers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No officers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
