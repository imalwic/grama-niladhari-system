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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SRI_LANKA_DATA } from "@/lib/sl-data";
import QRCode from "react-qr-code";
import { CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddPradeshiyaSabhaModal({ open, onOpenChange, onSuccess }: Props) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  
  // Location State
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sabha, setSabha] = useState("");

  // Admin State
  const [adminName, setAdminName] = useState("");
  const [adminNic, setAdminNic] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Response State
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);

  const selectedProvince = SRI_LANKA_DATA.provinces.find(p => p.id === province);
  const selectedDistrict = selectedProvince?.districts.find(d => d.id === district);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sabha || !adminName || !adminNic || !adminEmail) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/system-admin/pradeshiya-sabhas/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          district,
          sabhaName: sabha,
          adminName,
          adminNic,
          adminPhone,
          adminEmail
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCredentials({ email: data.admin.email, password: data.temporaryPassword });
        setStep("success");
        onSuccess();
      } else {
        alert("Failed to register. Please check the details.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after a short delay
    setTimeout(() => {
      setStep("form");
      setProvince("");
      setDistrict("");
      setSabha("");
      setAdminName("");
      setAdminNic("");
      setAdminPhone("");
      setAdminEmail("");
      setCredentials(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Register Pradeshiya Sabha</DialogTitle>
              <DialogDescription>
                Select the location and provide details for the new PS Admin.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Select value={province} onValueChange={(v) => { setProvince(v || ""); setDistrict(""); setSabha(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                    <SelectContent>
                      {SRI_LANKA_DATA.provinces.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={district} onValueChange={(v) => { setDistrict(v || ""); setSabha(""); }} disabled={!province}>
                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>
                      {selectedProvince?.districts.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pradeshiya Sabha / Local Authority</Label>
                <Select value={sabha} onValueChange={(v) => setSabha(v || "")} disabled={!district}>
                  <SelectTrigger><SelectValue placeholder="Select local authority" /></SelectTrigger>
                  <SelectContent>
                    {selectedDistrict?.localAuthorities.map(la => (
                      <SelectItem key={la} value={la}>{la}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Admin Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>NIC Number</Label>
                    <Input value={adminNic} onChange={(e) => setAdminNic(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-[#003366] hover:bg-[#002244] text-white">
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Registration Successful
              </DialogTitle>
              <DialogDescription>
                Scan the QR code below to retrieve the auto-generated temporary password for the PS Admin.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              {credentials && (
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <QRCode value={`Email: ${credentials.email}\nPassword: ${credentials.password}`} size={200} />
                </div>
              )}
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Email: {credentials?.email}</p>
                <p className="text-xs text-muted-foreground">The PS Admin can scan this code to login.</p>
              </div>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
