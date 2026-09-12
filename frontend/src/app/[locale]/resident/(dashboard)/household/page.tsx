"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Loader2 } from "lucide-react";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export default function MyHouseholdPage() {
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  
  const [household, setHousehold] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        const res = await fetch("http://localhost:3001/households/resident/my-household", {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setHousehold(data);
        }
      } catch (err) {
        console.error("Failed to fetch household details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHousehold();
  }, []);

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

      {loading ? (
        <div className="flex items-center justify-center p-12">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : household ? (
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
                <div className="font-semibold text-slate-900 dark:text-white">{household.houseNumber}</div>
                <div className="font-medium text-slate-500 dark:text-slate-400">GN Division:</div>
                <div className="font-semibold text-slate-900 dark:text-white">{household.wasama?.name}</div>
                <div className="font-medium text-slate-500 dark:text-slate-400">Address:</div>
                <div className="font-semibold text-slate-900 dark:text-white">{household.address || "-"}</div>
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
                {household.residents?.map((member: any, index: number) => (
                  <div key={member.id} className={`flex items-center justify-between ${index !== household.residents.length - 1 ? 'border-b pb-4 dark:border-slate-800' : ''}`}>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.residentCategory} • NIC: {member.nic}</p>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${member.isVerified ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'}`}>
                      {member.isVerified ? common("verified") : common("pending")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center p-12 text-muted-foreground border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
           Could not load household details.
        </div>
      )}
    </div>
  );
}
