"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users } from "lucide-react";

export default function MyHouseholdPage() {
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">
          {t("myHousehold")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          View your registered household details and members.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-t-4 border-t-[#003366] shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-t-blue-500">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Home className="h-6 w-6 text-[#003366] dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Household Information</CardTitle>
              <CardDescription>Primary details</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t dark:border-slate-800">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium text-slate-500 dark:text-slate-400">Household No:</div>
              <div className="font-semibold text-slate-900 dark:text-white">H-001</div>
              <div className="font-medium text-slate-500 dark:text-slate-400">GN Division:</div>
              <div className="font-semibold text-slate-900 dark:text-white">WN-102 Weeraketiya North</div>
              <div className="font-medium text-slate-500 dark:text-slate-400">Address:</div>
              <div className="font-semibold text-slate-900 dark:text-white">No 15, Temple Road, Weeraketiya</div>
              <div className="font-medium text-slate-500 dark:text-slate-400">Status:</div>
              <div className="font-semibold text-green-600 dark:text-green-400">Verified</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#003366] shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-t-blue-500">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Users className="h-6 w-6 text-[#003366] dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Registered Members</CardTitle>
              <CardDescription>People living in this household</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t dark:border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Mr. Kamal Perera</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Head of Household • NIC: 198012345678</p>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  Verified
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Mrs. Nimali Perera</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Spouse • NIC: 198212345678</p>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  Verified
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
