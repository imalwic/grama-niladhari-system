"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { PROVINCES, DISTRICTS, DIVISIONAL_SECS, GN_DIVISIONS } from "@/lib/location-data";

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

export default function ResidentRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [divisionalSec, setDivisionalSec] = useState("");
  const [wasama, setWasama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [householdNo, setHouseholdNo] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const t = useTranslations("Registration");
  const router = useRouter();

  const provinceOptions = PROVINCES.map(p => ({ value: p, label: p }));
  const districtOptions = (DISTRICTS[province] || []).map(d => ({ value: d, label: d }));
  
  const divisionalSecOptions: { value: string; label: string; disabled?: boolean }[] = (DIVISIONAL_SECS[district] || []).map(ds => ({ value: ds, label: ds }));
  if ((!DIVISIONAL_SECS[district] || DIVISIONAL_SECS[district].length === 0) && district) {
    divisionalSecOptions.push({ value: "unsupported_district", label: "Divisions not added yet", disabled: true });
  }

  const gnOptions = GN_DIVISIONS[divisionalSec] 
    ? GN_DIVISIONS[divisionalSec].map(gn => ({ value: gn.id, label: `${gn.id} ${gn.name}` }))
    : divisionalSec && divisionalSec !== "unsupported_district" 
      ? [{ value: "unsupported_ds", label: "GN divisions not added yet", disabled: true }] 
      : [];

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

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isStrongPassword = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  const isPasswordMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) return;
    if (!isStrongPassword || !isPasswordMatch) return;
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        nic,
        fullName,
        dob,
        phone,
        email,
        password,
        wasamaCode: wasama,
        householdNo,
        address,
        consentGiven
      };

      const res = await fetch("http://localhost:3001/auth/register/resident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
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
              {errorMsg && <div className="text-red-500 text-sm font-semibold mt-2">{errorMsg}</div>}
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
                  <Input id="fullName" placeholder={t("asPerNic")} value={fullName} onChange={(e) => setFullName(e.target.value)} required className="dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("mobileNumber")}</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="07XXXXXXXX" 
                    maxLength={10}
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <Combobox 
                      id="province"
                      value={province} 
                      onValueChange={(val) => { setProvince(val); setDistrict(""); setDivisionalSec(""); setWasama(""); }} 
                      options={provinceOptions}
                      placeholder="Select Province"
                      searchPlaceholder="Search Province..."
                      className="dark:bg-slate-800 dark:border-slate-700 bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Combobox 
                      id="district"
                      value={district} 
                      onValueChange={(val) => { setDistrict(val); setDivisionalSec(""); setWasama(""); }} 
                      disabled={!province}
                      options={districtOptions}
                      placeholder="Select District"
                      searchPlaceholder="Search District..."
                      className="dark:bg-slate-800 dark:border-slate-700 bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="divisionalSec">Divisional Secretariat</Label>
                    <Combobox 
                      id="divisionalSec"
                      value={divisionalSec} 
                      onValueChange={(val) => { setDivisionalSec(val); setWasama(""); }} 
                      disabled={!district}
                      options={divisionalSecOptions}
                      placeholder="Select Division"
                      searchPlaceholder="Search Division..."
                      className="dark:bg-slate-800 dark:border-slate-700 bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wasama">{t("gnDivision")}</Label>
                    <Combobox 
                      id="wasama"
                      value={wasama} 
                      onValueChange={setWasama} 
                      disabled={!divisionalSec}
                      options={gnOptions}
                      placeholder={t("selectWasama")}
                      searchPlaceholder="Search GN Division..."
                      className="dark:bg-slate-800 dark:border-slate-700 bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="householdNo">{t("householdNumber")}</Label>
                    <Input id="householdNo" value={householdNo} onChange={(e) => setHouseholdNo(e.target.value)} placeholder={t("ifKnown")} required className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">{t("permanentAddress")}</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("fullAddress")} required className="dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h3 className="text-sm font-medium leading-none">{t("accountSecurity")}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("createPassword")}</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="dark:bg-slate-800 dark:border-slate-700 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {password.length > 0 && !isStrongPassword && (
                      <div className="text-xs text-red-500 space-y-1 mt-1">
                        <p>Password must be strong. Please include:</p>
                        <ul className="list-disc pl-4">
                          {!hasMinLength && <li>At least 8 characters</li>}
                          {!hasUpperCase && <li>One uppercase letter</li>}
                          {!hasLowerCase && <li>One lowercase letter</li>}
                          {!hasNumber && <li>One number</li>}
                          {!hasSpecialChar && <li>One special character</li>}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        className="dark:bg-slate-800 dark:border-slate-700 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !isPasswordMatch && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
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
              <Button type="submit" className="w-full bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white" disabled={isLoading}>
                {isLoading ? "Registering..." : t("submitRegistration")}
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
