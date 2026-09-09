import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// In a real app, you would fetch the current user's profile from the session
const MOCK_USER = {
  name: "Mrs. Nimali Fernando",
  email: "nimali.gn@weeraketiya.ps.gov.lk",
};

export default function GnOfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="GN_OFFICER" user={MOCK_USER}>
      {children}
    </DashboardLayout>
  );
}
