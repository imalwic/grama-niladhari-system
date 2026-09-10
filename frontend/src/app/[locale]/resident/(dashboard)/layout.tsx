import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// MOCK USER for Resident
const MOCK_USER = {
  name: "Mr. Kamal Perera",
  email: "kamal@example.com",
};

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="RESIDENT" user={MOCK_USER}>
      {children}
    </DashboardLayout>
  );
}
