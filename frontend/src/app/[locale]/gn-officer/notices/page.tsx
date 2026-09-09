"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Bell, Trash2 } from "lucide-react";

// MOCK DATA
const MOCK_NOTICES = [
  {
    id: "1",
    title: "Dengue Eradication Program",
    content: "Please keep your premises clean. Health inspectors will visit tomorrow morning.",
    type: "ALERT",
    createdAt: "2023-10-25T10:00:00Z",
    expiresAt: "2023-10-27T10:00:00Z",
  },
  {
    id: "2",
    title: "Aswesuma Registration",
    content: "Submit your appeals before Friday at the GN office.",
    type: "GENERAL",
    createdAt: "2023-10-23T14:30:00Z",
    expiresAt: "2023-10-30T17:00:00Z",
  },
];

export default function GnOfficerNotices() {
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateNotice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNotice = {
      id: Math.random().toString(),
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      type: formData.get("type") as string,
      createdAt: new Date().toISOString(),
      expiresAt: (formData.get("expiresAt") as string) || "",
    };
    setNotices([newNotice, ...notices]);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ALERT":
        return <Badge variant="destructive">Alert</Badge>;
      case "DEVELOPMENT":
        return <Badge className="bg-green-600">Development</Badge>;
      default:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">General</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003366]">Notice Board</h1>
          <p className="text-muted-foreground">Publish announcements to the residents in your Wasama.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-[#003366] hover:bg-[#002244]">
              <Plus className="mr-2 h-4 w-4" /> Publish Notice
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateNotice}>
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
                <DialogDescription>
                  This notice will be visible to all registered residents in your division.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notice Title</Label>
                  <Input id="title" name="title" required placeholder="e.g., Water Cut Scheduled" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Notice Type</Label>
                  <Select name="type" defaultValue="GENERAL">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General Announcement</SelectItem>
                      <SelectItem value="ALERT">Alert / Urgent</SelectItem>
                      <SelectItem value="DEVELOPMENT">Development Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" required placeholder="Detailed information..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                  <Input id="expiresAt" name="expiresAt" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#003366] hover:bg-[#002244]">Publish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notices.map((notice) => (
          <Card key={notice.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                {getTypeBadge(notice.type)}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(notice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-2 text-lg">{notice.title}</CardTitle>
              <CardDescription>
                Published: {new Date(notice.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-slate-700 whitespace-pre-wrap">
              {notice.content}
            </CardContent>
            {notice.expiresAt && (
              <div className="px-6 pb-4 text-xs text-slate-500 flex items-center">
                <Bell className="h-3 w-3 mr-1" /> Valid until: {new Date(notice.expiresAt).toLocaleDateString()}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
