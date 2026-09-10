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
import { useTranslations } from "next-intl";

function extractDobFromNic(nic: string): string {
  let year = "";
  let days = 0;
  
  if (nic.length === 10 && /[vVxX]$/i.test(nic)) {
    year = "19" + nic.substring(0, 2);
    days = parseInt(nic.substring(2, 5));
  } else if (nic.length === 12 && /^\d+$/.test(nic)) {
    year = nic.substring(0, 4);
    days = parseInt(nic.substring(4, 7));
  } else {
    return "";
  }
  
  if (days > 500) {
    days -= 500;
  }
  
  if (days < 1 || days > 366) return "";
  
  const d = new Date(1992, 0, days);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const date = d.getDate().toString().padStart(2, "0");
  
  return `${year}-${month}-${date}`;
}

const PROVINCES = ["Southern Province", "Western Province", "Central Province"];

const DISTRICTS: Record<string, string[]> = {
  "Southern Province": ["Hambantota", "Galle", "Matara"],
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"]
};

const DIVISIONAL_SECS: Record<string, string[]> = {
  "Hambantota": ["Weeraketiya", "Tangalle", "Beliatta", "Walasmulla", "Katuwana"],
  "Colombo": ["Colombo", "Dehiwala", "Homagama"]
};

const GN_DIVISIONS: Record<string, {id: string, name: string}[]> = {
  "Weeraketiya": [
    { id: "WN-102", name: "Weeraketiya North" },
    { id: "WS-103", name: "Weeraketiya South" },
    { id: "MD-201", name: "Medamulana" }
  ]
};

export default function ResidentRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [wasama, setWasama] = useState("");
  const t = useTranslations("Registration");

  const handleNicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setNic(value);
    
    if (value.length === 10 || value.length === 12) {
      const dobStr = extractDobFromNic(value);
      if (dobStr) {
        setDob(dobStr);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    // In a real app, API call happens here
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md text-center border-t-4 border-t-green-600 shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:border-t-green-600">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{t("submittedTitle")}</CardTitle>
            <CardDescription>
              {t("submittedDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            {t("submittedInfo")}
          </CardContent>
          <CardFooter>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">{t("returnHome")}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/emblem.svg"
            alt="Sri Lanka National Emblem"
            width={60}
            height={60}
            className="mb-2"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        <Card className="border-t-4 border-t-[#003366] shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:border-t-blue-500">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t("personalDetails")}</CardTitle>
              <CardDescription>
                {t("personalDetailsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Personal Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nic">{t("nicNumber")}</Label>
                  <Input 
                    id="nic" 
                    placeholder={t("nicPlaceholder")} 
                    value={nic}
                    onChange={handleNicChange}
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input id="fullName" placeholder={t("asPerNic")} required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("mobileNumber")}</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="07XXXXXXXX" 
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">{t("dateOfBirth")}</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required 
                    className="dark:bg-slate-800 dark:border-slate-700" 
                  />
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-medium leading-none">{t("residentialInfo")}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Select value={province} onValueChange={(val) => { setProvince(val); setDistrict(""); setDivisionalSec(""); setWasama(""); }} required>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {PROVINCES.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select value={district} onValueChange={(val) => { setDistrict(val); setDivisionalSec(""); setWasama(""); }} disabled={!province} required>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {(DISTRICTS[province] || []).map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="divisionalSec">Divisional Secretariat</Label>
                    <Select value={divisionalSec} onValueChange={(val) => { setDivisionalSec(val); setWasama(""); }} disabled={!district} required>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {(DIVISIONAL_SECS[district] || []).map(ds => (
                          <SelectItem key={ds} value={ds}>{ds}</SelectItem>
                        ))}
                        {(!DIVISIONAL_SECS[district] || DIVISIONAL_SECS[district].length === 0) && district && (
                           <SelectItem value="unsupported_district" disabled>Divisions not added yet</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wasama">{t("gnDivision")}</Label>
                    <Select value={wasama} onValueChange={setWasama} disabled={!divisionalSec} required>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder={t("selectWasama")} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        {GN_DIVISIONS[divisionalSec] ? (
                          GN_DIVISIONS[divisionalSec].map(gn => (
                            <SelectItem key={gn.id} value={gn.id}>{gn.id} {gn.name}</SelectItem>
                          ))
                        ) : divisionalSec && divisionalSec !== "unsupported_district" ? (
                          <SelectItem value="unsupported_ds" disabled>GN divisions not added yet</SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="householdNo">{t("householdNumber")}</Label>
                    <Input id="householdNo" placeholder={t("ifKnown")} className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">{t("permanentAddress")}</Label>
                    <Input id="address" placeholder={t("fullAddress")} required className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-medium leading-none">{t("accountSecurity")}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("createPassword")}</Label>
                    <Input id="password" type="password" required className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <Input id="confirmPassword" type="password" required className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                </div>
              </div>

              {/* PDPA Consent */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-medium leading-none">{t("pdpaConsent")}</h3>
                <ScrollArea className="h-32 rounded-md border p-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <p className="mb-2"><strong>{t("pdpaTitle")}</strong></p>
                  <p className="mb-2">
                    {t("pdpaBody")}
                  </p>
                  <p className="mb-2">
                    {t("pdpaUnderstand")}
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{t("pdpaSecure")}</li>
                    <li>{t("pdpaAccess")}</li>
                    <li>{t("pdpaRight")}</li>
                    <li>{t("pdpaNotify")}</li>
                  </ul>
                </ScrollArea>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={consentGiven} 
                    onCheckedChange={(checked) => setConsentGiven(checked === true)}
                    required 
                    className="dark:border-slate-500"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="consent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {t("agreeConsent")}
                    </label>
                  </div>
                </div>
              </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 text-white" 
                disabled={!consentGiven}
              >
                {t("submitRegistration")}
              </Button>
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                {t("alreadyRegistered")}{" "}
                <Link href="/" className="font-semibold text-[#003366] dark:text-blue-400 hover:underline">
                  {t("signInHere")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
