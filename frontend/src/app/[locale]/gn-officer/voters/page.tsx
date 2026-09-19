"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Search, UserCheck } from "lucide-react";

export default function VotersRegistry() {
  const t = useTranslations("GNOfficer");
  const [searchTerm, setSearchTerm] = useState("");
  const [voters, setVoters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/residents/voters", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setVoters(data);
        }
      } catch (err) {
        console.error("Failed to fetch voters", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const filteredVoters = voters.filter((v) =>
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.nic && v.nic.includes(searchTerm)) ||
    (v.household?.houseNumber && v.household.houseNumber.includes(searchTerm.toUpperCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003366] dark:text-blue-400 flex items-center gap-2">
            <UserCheck className="h-6 w-6" />
            {t("electoralRegisterTitle")}
          </h1>
          <p className="text-muted-foreground">{t("manageVotersDesc")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchVotersPlaceholder")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullNameCol")}</TableHead>
              <TableHead>{t("nationalIdCol")}</TableHead>
              <TableHead>{t("ageCol")}</TableHead>
              <TableHead>{t("householdNoCol")}</TableHead>
              <TableHead>{t("verificationStatusCol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t("loadingVoters")}
                </TableCell>
              </TableRow>
            ) : filteredVoters.map((voter) => {
              const age = new Date().getFullYear() - new Date(voter.dateOfBirth).getFullYear();
              
              return (
                <TableRow key={voter.id}>
                  <TableCell className="font-medium">{voter.fullName}</TableCell>
                  <TableCell>{voter.nic || "N/A"}</TableCell>
                  <TableCell>{age} {t("yearsSuffix")}</TableCell>
                  <TableCell className="font-mono">{voter.household?.houseNumber || "Pending"}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={voter.isVerified ? "default" : "secondary"} 
                      className={voter.isVerified ? "bg-green-600" : "bg-orange-500"}
                    >
                      {voter.isVerified ? t("verifiedStatus") : t("pendingStatus")}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && filteredVoters.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {t("noVotersFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
