"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "@/i18n/routing";

function getUserFromToken(): { name: string; email: string; role: string; wasamaId?: string; wasamaName?: string } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      name: payload.name || "GN Officer",
      email: payload.email || "",
      role: payload.role,
      wasamaId: payload.wasamaId,
      wasamaName: payload.wasamaName,
    };
  } catch {
    return null;
  }
}

export default function GnOfficerLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const u = getUserFromToken();
    if (!u || u.role !== "GN_OFFICER") {
      router.push("/");
      return;
    }
    setUser({ name: u.name, email: u.email });
  }, [router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout role="GN_OFFICER" user={user}>
      {children}
    </DashboardLayout>
  );
}
