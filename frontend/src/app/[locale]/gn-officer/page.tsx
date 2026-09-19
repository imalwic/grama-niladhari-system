"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, CheckCircle, UserCheck, Download, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Reusable animated StatCard
const StatCard = ({ title, value, icon: Icon, desc, color }: any) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 group">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${colorMap[color].split(' ')[0]}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{value}</div>
        {desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{desc}</p>}
      </CardContent>
    </Card>
  );
};

export default function GnOfficerDashboard() {
  const t = useTranslations("GnOfficer");
  const [stats, setStats] = useState({
    totalHouseholds: 0,
    totalResidents: 0,
    pendingRequests: 0,
    issuedCertificates: 0,
    newVoters: 0,
    ageDemographics: [],
    relationships: []
  });
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.wasamaName) {
              setSubtitle(`Welcome back. Here is the overview for ${payload.wasamaName}.`);
            }
          } catch (e) {}
        }
        const res = await fetch("http://localhost:3001/wasamas/dashboard-stats", {
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

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/wasamas/dashboard-report", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none" />
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{t("title")}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            {subtitle || t("subtitle")}
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="relative z-10 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:bg-slate-800 dark:text-blue-400 dark:border-slate-700 dark:hover:bg-slate-700 shadow-sm transition-all">
          <Download className="w-4 h-4 mr-2" /> Download Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title={t("myResidents")} value={stats.totalResidents} icon={Users} desc={t("addedThisWeek")} color="blue" />
        <StatCard title={t("households")} value={stats.totalHouseholds} icon={Home} color="emerald" />
        <StatCard title={t("pendingRequests")} value={stats.pendingRequests} icon={FileText} desc={t("needsApproval")} color="orange" />
        <StatCard title={t("certificatesIssued")} value={stats.issuedCertificates} icon={CheckCircle} desc={t("thisYear")} color="green" />
        <StatCard title="Eligible Voters" value={stats.newVoters} icon={UserCheck} desc="18+ in your Wasama" color="indigo" />
      </div>

      {/* Demographics Row */}
      <Card className="border-0 shadow-md bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Demographics Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-around gap-8 md:gap-12 min-h-[350px] lg:h-[350px]">
            {stats.ageDemographics && stats.ageDemographics.length > 0 ? (
              <div className="w-full lg:w-1/2 h-[250px] lg:h-full flex flex-col items-center">
                <p className="text-sm text-slate-500 font-medium mb-4">Age Distribution</p>
                <div className="w-full h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.ageDemographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.ageDemographics.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-1/2 h-full flex items-center justify-center text-slate-400">No age data available</div>
            )}
            
            {stats.relationships && stats.relationships.length > 0 ? (
              <div className="w-full lg:w-1/2 h-[250px] lg:h-full flex flex-col items-center mt-6 lg:mt-0">
                <p className="text-sm text-slate-500 font-medium mb-4">Household Relationships</p>
                <div className="w-full h-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.relationships}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.relationships.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-1/2 h-full flex items-center justify-center text-slate-400">No relationship data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
            <CardDescription>{t("frequentTasks")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="w-full justify-between bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-12 px-4 rounded-xl">
              <span className="flex items-center"><Home className="w-4 h-4 mr-2" /> {t("registerHousehold")}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Button>
            <Button className="w-full justify-between bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-12 px-4 rounded-xl">
              <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> {t("addResident")}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Button>
            <Button variant="outline" className="w-full justify-between h-12 px-4 rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <span className="flex items-center"><FileText className="w-4 h-4 mr-2" /> {t("publishNotice")}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{t("recentRequests")}</CardTitle>
            <CardDescription>{t("requestsWaiting")}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="space-y-3 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                        {t("characterCertReq")}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("requestedBy")}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">{t("review")}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
