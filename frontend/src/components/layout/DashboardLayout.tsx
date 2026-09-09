"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  FileText
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "SUPER_ADMIN" | "GN_OFFICER" | "RESIDENT";
  user: { name: string; email: string };
}

export function DashboardLayout({ children, role, user }: DashboardLayoutProps) {
  const pathname = usePathname();

  const superAdminNav: SidebarItem[] = [
    { name: "Overview", href: "/super-admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "GN Officers", href: "/super-admin/gn-officers", icon: <Users className="h-5 w-5" /> },
    { name: "Settings", href: "/super-admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const gnOfficerNav: SidebarItem[] = [
    { name: "Dashboard", href: "/gn-officer", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Households", href: "/gn-officer/households", icon: <Home className="h-5 w-5" /> },
    { name: "Residents", href: "/gn-officer/residents", icon: <Users className="h-5 w-5" /> },
    { name: "Notices", href: "/gn-officer/notices", icon: <Bell className="h-5 w-5" /> },
    { name: "Settings", href: "/gn-officer/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const residentNav: SidebarItem[] = [
    { name: "Dashboard", href: "/resident", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "My Household", href: "/resident/household", icon: <Home className="h-5 w-5" /> },
    { name: "Certificates", href: "/resident/requests", icon: <FileText className="h-5 w-5" /> },
    { name: "Notices", href: "/resident/notices", icon: <Bell className="h-5 w-5" /> },
  ];

  const navigation = role === "SUPER_ADMIN" ? superAdminNav : role === "GN_OFFICER" ? gnOfficerNav : residentNav;

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white sm:flex">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src="/emblem.svg" alt="Sri Lanka Emblem" width={32} height={32} className="object-contain" />
            <span className="text-sm leading-tight text-[#003366] font-bold">
              Grama Niladhari<br/>System
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-[#003366] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm sm:shadow-none">
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-end gap-4">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-none text-[#003366]">{user.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {role === "SUPER_ADMIN" ? "Pradeshiya Sabha Admin" : role === "GN_OFFICER" ? "Grama Niladhari" : "Resident"}
                </p>
             </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full shadow-sm">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#003366] text-white">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
