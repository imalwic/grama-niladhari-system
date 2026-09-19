"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, MapPin, Activity, UserCheck, MessageSquare, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#f43f5e', '#a855f7'];

export default function SystemAdminDashboard() {
  const t = useTranslations("SuperAdmin");
  
  const [stats, setStats] = useState<any>({
    totalPradeshiyaSabhas: 0,
    totalGnDivisions: 0,
    totalResidents: 0,
    totalPsAdmins: 0,
    recentActivity: [],
    demographics: [],
    categoryStats: [],
    bottlenecks: [],
    newVoters: 0,
    pendingGrievances: 0,
    anomalies: []
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/system-admin/dashboard-stats", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#003366] dark:text-blue-400">{t("globalSystemOverview")}</h1>
        <p className="text-muted-foreground">
          {t("monitorSystem")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalPradeshiyaSabhas")}</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPradeshiyaSabhas.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalPsAdmins")}</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPsAdmins.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-orange-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalGnDivisions")}</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGnDivisions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("totalResidentsSystem")}</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResidents.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("openPublicGrievances")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingGrievances.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("requiresAdminAttention")}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("fraudDataAnomalies")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.anomalies ? stats.anomalies.length : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("flaggedHouseholds")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("systemDemographics")}</CardTitle>
            <CardDescription>
              {t("populationDistributionPs")}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] md:h-[350px] flex items-center justify-center border-t bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 p-4">
            {stats.demographics && stats.demographics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.demographics}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="population" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground italic">{t("noDemographics")}</p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm dark:bg-slate-900 dark:border-slate-800 overflow-y-auto max-h-[400px]">
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>
              {t("recentActivityPs")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentActivity && stats.recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                <p className="text-sm text-muted-foreground">{t("noRecentActivity")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-3 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("categoryInsights")}</CardTitle>
            <CardDescription>{t("residentDist")}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] md:h-[350px] flex items-center justify-center border-t bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 p-4">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {stats.categoryStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground italic">{t("noCategoryData")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t("slaBottleneck")}</CardTitle>
            <CardDescription>{t("top5Ps")}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] md:h-[350px] flex items-center justify-center border-t bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 p-4">
            {stats.bottlenecks && stats.bottlenecks.length > 0 && stats.bottlenecks.some((b: any) => b.pendingRequests > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.bottlenecks.filter((b: any) => b.pendingRequests > 0)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="pendingRequests" name={t("pendingRequestsGraph")} fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground italic">{t("noBottleneck")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fraud Detection Table */}
      <div className="grid gap-4 mt-4">
        <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-amber-600 dark:text-amber-500 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t("systemAnomalies")}
            </CardTitle>
            <CardDescription>{t("householdsFlagged")}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.anomalies && stats.anomalies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3">{t("householdNoLabel")}</th>
                      <th className="px-4 py-3">{t("gnDivisionLabel")}</th>
                      <th className="px-4 py-3">{t("pradeshiyaSabhaLabel")}</th>
                      <th className="px-4 py-3 text-right">{t("residentCount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.anomalies.map((anomaly: any, i: number) => (
                      <tr key={i} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 font-medium text-amber-600">{anomaly.householdNo}</td>
                        <td className="px-4 py-3">{anomaly.wasamaName}</td>
                        <td className="px-4 py-3">{anomaly.pradeshiyaSabhaName}</td>
                        <td className="px-4 py-3 text-right font-bold text-red-600">{anomaly.residentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-muted-foreground border border-dashed rounded-lg">
                <p>{t("noAnomalies")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
