"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

function parseJwt (token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({ name: "Loading...", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({ name: decoded.name, email: decoded.email || "" });
      }
    }
  }, []);

  return (
    <DashboardLayout role="PS_ADMIN" user={user}>
      {children}
    </DashboardLayout>
  );
}
