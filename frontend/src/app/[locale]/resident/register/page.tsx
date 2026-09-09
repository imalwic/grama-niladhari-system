"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";

export default function ResidentRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    // In a real app, API call happens here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center border-t-4 border-t-green-600 shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Submitted</CardTitle>
            <CardDescription>
              Your registration request has been successfully submitted to your Grama Niladhari Officer.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Please wait for the GN Officer to verify your details. Once approved, you will be able to log in to the Resident Portal and request certificates.
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/emblem.svg"
            alt="Sri Lanka National Emblem"
            width={60}
            height={60}
            className="mb-2"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#003366]">
            Resident Registration
          </h1>
          <p className="text-sm text-slate-500">
            Create your digital account for the Grama Niladhari System
          </p>
        </div>

        <Card className="border-t-4 border-t-[#003366] shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>
                Please enter your information exactly as it appears on your National Identity Card (NIC).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number</Label>
                  <Input id="nic" placeholder="e.g., 198012345678" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="As per NIC" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" type="tel" placeholder="07XXXXXXXX" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" required />
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium leading-none">Residential Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wasama">Grama Niladhari Division (Wasama)</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your Wasama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WN-102">Weeraketiya North (WN-102)</SelectItem>
                        <SelectItem value="WS-103">Weeraketiya South (WS-103)</SelectItem>
                        <SelectItem value="MD-201">Middeniya (MD-201)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="householdNo">Household Number (Optional)</Label>
                    <Input id="householdNo" placeholder="If known (e.g., H-001)" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Permanent Address</Label>
                    <Input id="address" placeholder="Full residential address" required />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium leading-none">Account Security</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                </div>
              </div>

              {/* PDPA Consent */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-medium leading-none">Data Protection Consent (PDPA)</h3>
                <ScrollArea className="h-32 rounded-md border p-4 bg-slate-50 text-xs text-slate-600">
                  <p className="mb-2"><strong>Personal Data Protection Act (PDPA) Declaration:</strong></p>
                  <p className="mb-2">
                    By submitting this form, I hereby consent to the collection, processing, and storage of my personal data by the Pradeshiya Sabha and the relevant Grama Niladhari division for the purpose of maintaining digital residential records and issuing official certificates.
                  </p>
                  <p className="mb-2">
                    I understand that:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>My data will be securely stored in the government database.</li>
                    <li>My data will only be accessed by authorized government officials.</li>
                    <li>I have the right to request access to or correction of my personal data.</li>
                    <li>My mobile number may be used to send official notifications regarding my requests.</li>
                  </ul>
                </ScrollArea>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={consentGiven} 
                    onCheckedChange={(checked) => setConsentGiven(checked === true)}
                    required 
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I have read and agree to the Data Protection Consent.
                    </label>
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#003366] hover:bg-[#002244]" 
                disabled={!consentGiven}
              >
                Submit Registration Request
              </Button>
              <div className="text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link href="/" className="font-semibold text-[#003366] hover:underline">
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
