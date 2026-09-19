"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResidentFormsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/pdf-forms/resident/available", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-800 dark:text-blue-500">
            Fill Forms
          </h1>
          <p className="text-muted-foreground">Select a form to fill out and submit to your Grama Niladhari.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No forms are currently available in your division.
            </CardContent>
          </Card>
        ) : (
          categories.map(category => (
            category.forms && category.forms.length > 0 && (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {category.forms.map((form: any) => (
                      <div 
                        key={form.id} 
                        className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/${currentLocale}/resident/forms/fill/${form.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{form.title}</h3>
                            <p className="text-sm text-muted-foreground">{form.fields?.length || 0} fields to fill</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ))
        )}
      </div>
    </div>
  );
}
