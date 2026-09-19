"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FileText, Plus, Upload, Edit, Eye, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function DynamicFormsPage() {
  const t = useTranslations("GNOfficer");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const [categories, setCategories] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategoryId, setUploadCategoryId] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/pdf-forms/categories", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/pdf-forms", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setForms(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchForms();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/pdf-forms/categories", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      if (res.ok) {
        setIsCategoryModalOpen(false);
        setNewCategoryName("");
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadForm = async () => {
    if (!uploadFile || !uploadTitle) return;
    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", uploadTitle);
      // We will pass title as categoryName so backend can create it automatically
      formData.append("categoryName", uploadTitle);
      formData.append("file", uploadFile);

      const res = await fetch("http://localhost:3001/pdf-forms", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setIsUploadModalOpen(false);
        setUploadTitle("");
        setUploadFile(null);
        fetchForms();
        fetchCategories(); // Refresh categories as well
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-500">
            {t("pdfFormsTitle")}
          </h1>
          <p className="text-muted-foreground">{t("pdfFormsDesc")}</p>
        </div>
      </div>

      <Tabs defaultValue="forms" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="forms">{t("formsTab")}</TabsTrigger>
          <TabsTrigger value="categories">{t("categoriesTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("formsTab")}</CardTitle>
              <Button onClick={() => setIsUploadModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Upload className="mr-2 h-4 w-4" /> {t("uploadFormBtn")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("formTitleLabel")}</TableHead>
                    <TableHead>{t("categoryLabel")}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        {t("noFormsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    forms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell>{form.category?.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            form.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {form.status === 'PUBLISHED' ? t("publishedBadge") : t("draftBadge")}
                          </span>
                        </TableCell>
                        <TableCell>{form.fields?.length || 0}</TableCell>
                        <TableCell>{form._count?.submissions || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/${currentLocale}/gn-officer/forms/builder/${form.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> {t("editLayoutBtn")}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/${currentLocale}/gn-officer/forms/submissions/${form.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" /> {t("submissionsBtn")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("categoriesTab")}</CardTitle>
              <Button onClick={() => setIsCategoryModalOpen(true)} variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" /> {t("newCategoryBtn")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("categoryNameLabel")}</TableHead>
                    <TableHead>{t("formsTab")} Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{cat.forms?.length || 0}</TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Form Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("uploadFormBtn")}</DialogTitle>
            <DialogDescription>Upload a blank PDF form for residents to fill.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("formTitleLabel")}</Label>
              <Input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. Income Certificate Form" />
            </div>
            <div className="space-y-2">
              <Label>{t("pdfFileLabel")}</Label>
              <Input type="file" accept="application/pdf" onChange={(e: any) => setUploadFile(e.target.files[0])} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadForm} disabled={isUploading || !uploadFile || !uploadTitle}>
              {isUploading ? "Uploading..." : t("uploadBtn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("createCategoryModal")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("categoryNameLabel")}</Label>
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Subsidies, Land" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={!newCategoryName}>{t("saveCategoryBtn")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
