"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Search, FileText, Checkbox } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SharedDocument = {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  pradeshiyaSabhas: {
    pradeshiyaSabha: {
      id: string;
      name: string;
    }
  }[];
};

type PradeshiyaSabha = {
  id: string;
  name: string;
};

export default function GlobalAdminDocumentsPage() {
  const [data, setData] = useState<SharedDocument[]>([]);
  const [psList, setPsList] = useState<PradeshiyaSabha[]>([]);
  const [isFormView, setIsFormView] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<SharedDocument | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [selectedPsIds, setSelectedPsIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/documents", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const fetchPsList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/pradeshiya-sabhas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setPsList(await res.json());
    } catch (err) {
      console.error("Failed to fetch PS list", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPsList();
  }, [isFormView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPsIds.length === 0) {
      setErrorMsg("Please select at least one Pradeshiya Sabha.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/documents", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          title,
          fileUrl,
          pradeshiyaSabhaIds: selectedPsIds
        }),
      });

      if (!res.ok) throw new Error("Failed to share document");

      setIsFormView(false);
      setTitle("");
      setFileUrl("");
      setSelectedPsIds([]);
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePsSelection = (id: string) => {
    setSelectedPsIds(prev => 
      prev.includes(id) ? prev.filter(psId => psId !== id) : [...prev, id]
    );
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isFormView) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <Button variant="ghost" onClick={() => setIsFormView(false)} className="w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shared Documents
        </Button>
        <Card className="shadow-lg dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Share New Document</CardTitle>
              <CardDescription>
                Upload a document (via link) and select which Pradeshiya Sabhas should receive it.
              </CardDescription>
              {errorMsg && <div className="text-red-500 text-sm font-semibold mt-2">{errorMsg}</div>}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Updated Circular 2026" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileUrl">File URL (Google Drive, PDF Link, etc.)</Label>
                  <Input 
                    id="fileUrl" 
                    type="url"
                    placeholder="https://..." 
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-semibold">Select Target Pradeshiya Sabhas</h3>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                  <span className="text-sm text-muted-foreground">{selectedPsIds.length} selected</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    if (selectedPsIds.length === psList.length) setSelectedPsIds([]);
                    else setSelectedPsIds(psList.map(ps => ps.id));
                  }}>
                    {selectedPsIds.length === psList.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                  {psList.map(ps => (
                    <label key={ps.id} className="flex items-center space-x-3 p-2 rounded border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 dark:border-slate-700 transition-colors">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                        checked={selectedPsIds.includes(ps.id)}
                        onChange={() => togglePsSelection(ps.id)}
                      />
                      <span className="text-sm font-medium">{ps.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Sharing..." : "Share Document"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">Shared Documents</h1>
          <p className="text-muted-foreground">Manage and distribute forms to Pradeshiya Sabhas</p>
        </div>
        <Button onClick={() => setIsFormView(true)} className="bg-[#003366] hover:bg-[#002244] text-white">
          <Plus className="mr-2 h-4 w-4" /> Share New Document
        </Button>
      </div>

      <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Distributed Files</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border dark:border-slate-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Shared</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-sm">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {doc.pradeshiyaSabhas.length} Pradeshiya Sabha(s)
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                          View File
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(doc)}>
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No shared documents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        {selectedDoc && (
          <DialogContent className="sm:max-w-[500px] dark:bg-slate-900 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl">Document Details</DialogTitle>
              <DialogDescription>
                Shared on {new Date(selectedDoc.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-semibold mb-2">Title</h4>
                <p className="text-sm font-medium p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                  {selectedDoc.title}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Targeted Pradeshiya Sabhas</h4>
                <div className="text-sm p-3 border rounded-md max-h-48 overflow-y-auto dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedDoc.pradeshiyaSabhas.map(ps => (
                      <li key={ps.pradeshiyaSabha.id}>{ps.pradeshiyaSabha.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
