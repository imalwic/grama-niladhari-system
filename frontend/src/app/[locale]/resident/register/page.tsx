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

export default function ResidentRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const t = useTranslations("Resident");

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
            <CardTitle className="text-2xl">{t("registrationSubmitted")}</CardTitle>
            <CardDescription>
              {t("regSubmitDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">
            {t("regWaitMsg")}
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
            {t("residentRegistration")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("createDigitalAccount")}
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
                  <Input id="nic" placeholder={t("nicPlaceholder")} required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input id="fullName" placeholder={t("asPerNic")} required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("mobileNumber")}</Label>
                  <Input id="phone" type="tel" placeholder="07XXXXXXXX" required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">{t("dateOfBirth")}</Label>
                  <Input id="dob" type="date" required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-medium leading-none">{t("residentialInformation")}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wasama">{t("gnDivision")}</Label>
                    <Select required>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectValue placeholder={t("selectWasama")} />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                        <SelectItem value="WN-102">{t("wasama1")}</SelectItem>
                        <SelectItem value="WS-103">{t("wasama2")}</SelectItem>
                        <SelectItem value="MD-201">{t("wasama3")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="householdNo">{t("householdNoOpt")}</Label>
                    <Input id="householdNo" placeholder={t("ifKnownH001")} className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">{t("permanentAddress")}</Label>
                    <Input id="address" placeholder={t("fullResAddress")} required className="dark:bg-slate-800 dark:border-slate-700" />
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
                    {t("pdpaDesc1")}
                  </p>
                  <p className="mb-2">
                    {t("iUnderstandThat")}
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>{t("pdpaPoint1")}</li>
                    <li>{t("pdpaPoint2")}</li>
                    <li>{t("pdpaPoint3")}</li>
                    <li>{t("pdpaPoint4")}</li>
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
                      {t("iAgreePdpa")}
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
