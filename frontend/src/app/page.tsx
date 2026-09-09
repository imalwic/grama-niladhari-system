"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/emblem.svg"
            alt="Sri Lanka National Emblem"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#003366]">
            Grama Niladhari System
          </h1>
          <p className="text-sm text-slate-500">
            Secure portal for Pradeshiya Sabha and Grama Niladhari Officers
          </p>
        </div>

        <Card className="border-t-4 border-t-[#003366] shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or NIC</Label>
              <Input id="email" type="text" placeholder="e.g., admin@gov.lk" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-[#003366] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {/* For demo purposes, we link directly to the dashboard */}
            <Link href="/super-admin" className="w-full">
              <Button className="w-full bg-[#003366] hover:bg-[#002244]">
                Sign In
              </Button>
            </Link>
            <div className="text-center text-sm text-slate-500">
              Are you a resident?{" "}
              <Link href="/resident/register" className="font-semibold text-[#003366] hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
