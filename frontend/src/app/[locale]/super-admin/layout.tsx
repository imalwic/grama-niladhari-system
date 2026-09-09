import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// In a real app, you would fetch the current user's profile from the session
const MOCK_USER = {
  name: "Mr. Samantha Perera",
  email: "admin@weeraketiya.ps.gov.lk",
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="SUPER_ADMIN" user={MOCK_USER}>
      {children}
    </DashboardLayout>
  );
}
