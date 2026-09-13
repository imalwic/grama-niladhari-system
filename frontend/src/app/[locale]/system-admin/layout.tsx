import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// In a real app, you would fetch the current user's profile from the session
const MOCK_USER = {
  name: "Global System Admin",
  email: "system@gov.lk",
};

export default function SystemAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="SUPER_ADMIN" user={MOCK_USER}>
      {children}
    </DashboardLayout>
  );
}
