"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const t = useTranslations("Login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const isEmail = identifier.includes("@");
      const payload = isEmail ? { email: identifier, password } : { nic: identifier, password };

      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      
      // Basic jwt decode to get role (in production, use a library)
      const tokenParts = data.access_token.split('.');
      if (tokenParts.length === 3) {
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        if (tokenPayload.role === "SUPER_ADMIN") router.push("/super-admin");
        else if (tokenPayload.role === "GN_OFFICER") router.push("/gn-officer");
        else router.push("/resident");
      } else {
        router.push("/resident"); // Fallback
      }

    } catch (error: any) {
      setErrorMsg(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/emblem.svg"
            alt="Sri Lanka National Emblem"
            width={80}
            height={80}
            className="mb-4 drop-shadow-md"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        <Card className="border-t-4 border-t-[#003366] shadow-lg dark:bg-slate-900 dark:border-slate-800 dark:border-t-blue-500">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="dark:text-white">{t("signIn")}</CardTitle>
              <CardDescription className="dark:text-slate-400">
                {t("credentialsHint")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg && <div className="text-red-500 text-sm font-semibold">{errorMsg}</div>}
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-slate-200">{t("emailLabel")}</Label>
                <Input 
                  id="email" 
                  type="text" 
                  placeholder={t("emailPlaceholder")} 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="dark:text-slate-200">{t("passwordLabel")}</Label>
                  <Link href="#" className="text-sm text-[#003366] dark:text-blue-400 hover:underline">
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required 
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" disabled={loading} className="w-full bg-[#003366] hover:bg-[#002244] dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                {loading ? t("signingIn") : t("signIn")}
              </Button>
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                {t("residentPrompt")}{" "}
                <Link href="/resident/register" className="font-semibold text-[#003366] dark:text-blue-400 hover:underline">
                  {t("registerHere")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
