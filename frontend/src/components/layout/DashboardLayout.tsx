"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const nav = useTranslations("Navigation");
  const common = useTranslations("Common");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const superAdminNav: SidebarItem[] = [
    { name: nav("overview"), href: "/super-admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: nav("gnOfficers"), href: "/super-admin/gn-officers", icon: <Users className="h-5 w-5" /> },
    { name: nav("settings"), href: "/super-admin/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const gnOfficerNav: SidebarItem[] = [
    { name: nav("dashboard"), href: "/gn-officer", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: nav("households"), href: "/gn-officer/households", icon: <Home className="h-5 w-5" /> },
    { name: nav("residents"), href: "/gn-officer/residents", icon: <Users className="h-5 w-5" /> },
    { name: nav("requests"), href: "/gn-officer/requests", icon: <FileText className="h-5 w-5" /> },
    { name: nav("notices"), href: "/gn-officer/notices", icon: <Bell className="h-5 w-5" /> },
    { name: nav("settings"), href: "/gn-officer/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const residentNav: SidebarItem[] = [
    { name: nav("dashboard"), href: "/resident", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: nav("myHousehold"), href: "/resident/household", icon: <Home className="h-5 w-5" /> },
    { name: nav("certificates"), href: "/resident/requests", icon: <FileText className="h-5 w-5" /> },
    { name: nav("notices"), href: "/resident/notices", icon: <Bell className="h-5 w-5" /> },
  ];

  const navigation = role === "SUPER_ADMIN" ? superAdminNav : role === "GN_OFFICER" ? gnOfficerNav : residentNav;

  const roleLabel = role === "SUPER_ADMIN" ? common("pradeshiyaSabhaAdmin") : role === "GN_OFFICER" ? common("gramaNiladhari") : common("resident");

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white dark:bg-slate-900 dark:border-slate-800 sm:flex transition-colors">
        <div className="flex h-16 items-center border-b dark:border-slate-800 px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <Image src="/emblem.svg" alt="Sri Lanka Emblem" width={32} height={32} className="object-contain" />
            <span className="text-sm leading-tight text-[#003366] dark:text-blue-400 font-bold">
              {common("gramaNiladhariSystem").split(" ").slice(0, 2).join(" ")}<br/>{common("gramaNiladhariSystem").split(" ").slice(2).join(" ") || "System"}
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-[#003366] dark:bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-900 dark:border-slate-800 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm sm:shadow-none transition-colors">
          <Button size="icon" variant="outline" className="sm:hidden dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
            <Menu className="h-5 w-5 dark:text-slate-200" />
            <span className="sr-only">{common("toggleMenu")}</span>
          </Button>
          <div className="flex flex-1 items-center justify-end gap-4">
             <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-none text-[#003366] dark:text-blue-400">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {roleLabel}
                </p>
             </div>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="secondary" size="icon" className="rounded-full shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[#003366] dark:bg-blue-600 text-white">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">{common("toggleUserMenu")}</span>
                </Button>
              } />
              <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800">
                <DropdownMenuLabel className="dark:text-slate-200">{common("myAccount")}</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <DropdownMenuItem className="dark:text-slate-300 dark:focus:bg-slate-800">{nav("settings")}</DropdownMenuItem>
                <DropdownMenuItem className="dark:text-slate-300 dark:focus:bg-slate-800">{common("support")}</DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-slate-800" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 dark:focus:bg-slate-800 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  {common("logout")}
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
