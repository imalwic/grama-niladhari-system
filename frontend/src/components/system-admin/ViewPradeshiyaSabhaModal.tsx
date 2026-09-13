"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KeyRound, Download, CheckCircle2 } from "lucide-react";
import QRCode from "react-qr-code";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sabha: any;
  onSuccess: () => void;
}

export function ViewPradeshiyaSabhaModal({ open, onOpenChange, sabha, onSuccess }: Props) {
  const [resetting, setResetting] = useState(false);
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);

  const handleResetPassword = async () => {
    if (!sabha || !sabha.users || sabha.users.length === 0) {
      alert("No PS Admin found for this Sabha");
      return;
    }

    const adminId = sabha.users[0].id; // Assuming the first user is the admin
    if (!confirm("Are you sure you want to reset the password for this PS Admin?")) return;

    setResetting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/system-admin/ps-admins/${adminId}/reset-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCredentials({ email: data.email, password: data.temporaryPassword });
        onSuccess();
      } else {
        alert("Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setResetting(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("reset-admin-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PS-Admin-Reset-QR-${credentials?.email}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setCredentials(null);
    }, 300);
  };

  if (!sabha) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }}>
      <DialogContent className="sm:max-w-[450px]">
        {!credentials ? (
          <>
            <DialogHeader>
              <DialogTitle>{sabha.name}</DialogTitle>
              <DialogDescription>
                {sabha.district} District
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground mb-1">GN Divisions</p>
                  <p>{sabha._count?.wasamas || 0}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground mb-1">PS Admins</p>
                  <p>{sabha._count?.users || 0}</p>
                </div>
              </div>
              
              {sabha.users && sabha.users.length > 0 && (
                <div className="border-t pt-4 mt-2">
                  <p className="font-semibold text-muted-foreground mb-2 text-sm">Admin Details</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {sabha.users[0].name}</p>
                    <p><span className="font-medium">Email:</span> {sabha.users[0].email}</p>
                    <p><span className="font-medium">NIC:</span> {sabha.users[0].nic}</p>
                    <p><span className="font-medium">Phone:</span> {sabha.users[0].phone || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>Close</Button>
              <Button 
                variant="destructive" 
                onClick={handleResetPassword} 
                disabled={resetting || !sabha.users || sabha.users.length === 0}
              >
                <KeyRound className="mr-2 h-4 w-4" /> 
                {resetting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Password Reset Successful
              </DialogTitle>
              <DialogDescription>
                Scan or download the new QR code below to retrieve the new temporary password.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border relative group">
                <QRCode id="reset-admin-qr-code" value={`Email: ${credentials.email}\nPassword: ${credentials.password}`} size={200} />
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={downloadQR}
                  title="Download QR Code"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Email: {credentials?.email}</p>
                <p className="text-xs text-muted-foreground">The PS Admin can scan this code to login.</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={downloadQR} className="w-1/2">
                  <Download className="mr-2 h-4 w-4" /> Download QR
                </Button>
                <Button onClick={handleClose} className="w-1/2 bg-[#003366] hover:bg-[#002244] text-white">Done</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
