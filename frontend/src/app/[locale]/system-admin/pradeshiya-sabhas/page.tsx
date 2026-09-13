"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RefreshCw } from "lucide-react";
import { AddPradeshiyaSabhaModal } from "@/components/system-admin/AddPradeshiyaSabhaModal";

export default function PradeshiyaSabhasPage() {
  const t = useTranslations("Common");
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/system-admin/pradeshiya-sabhas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch Pradeshiya Sabhas", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">Pradeshiya Sabhas</h1>
          <p className="text-muted-foreground">Manage all Pradeshiya Sabhas across the country</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setModalOpen(true)} className="bg-[#003366] hover:bg-[#002244] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Pradeshiya Sabha
          </Button>
        </div>
      </div>

      <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>GN Divisions</TableHead>
                  <TableHead>PS Admins</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((ps) => (
                  <TableRow key={ps.id}>
                    <TableCell className="font-medium">{ps.name}</TableCell>
                    <TableCell>{ps.district}</TableCell>
                    <TableCell>{ps._count?.wasamas || 0}</TableCell>
                    <TableCell>{ps._count?.users || 0}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No Pradeshiya Sabhas found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPradeshiyaSabhaModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
