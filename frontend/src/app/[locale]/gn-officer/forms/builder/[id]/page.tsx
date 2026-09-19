"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, PlusSquare, ArrowLeft, Trash2, CheckSquare } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  const locale = params.locale as string;

  const [form, setForm] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const pdfScale = 1.2;

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/pdf-forms/${formId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setForm(data);
        if (data.fields) {
          setFields(data.fields.map((f: any) => ({
            ...f,
            x: f.x * pdfScale,
            y: f.y * pdfScale,
            width: f.width * pdfScale,
            height: f.height * pdfScale,
          })));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const addField = (type: "TEXT" | "CHECKBOX") => {
    const newField = {
      id: `new-${Date.now()}`,
      type,
      label: type === "TEXT" ? "Text Field" : "Checkbox",
      x: 100,
      y: 100,
      width: type === "TEXT" ? 200 : 20,
      height: 20,
      page: currentPage,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const saveLayout = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const normalizedFields = fields.map(f => ({
        label: f.label,
        type: f.type,
        x: f.x / pdfScale,
        y: f.y / pdfScale,
        width: f.width / pdfScale,
        height: f.height / pdfScale,
        page: f.page
      }));

      await fetch(`http://localhost:3001/pdf-forms/${formId}/fields`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields: normalizedFields })
      });

      if (form.status === 'DRAFT') {
        await fetch(`http://localhost:3001/pdf-forms/${formId}/status`, {
          method: "PATCH",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status: "PUBLISHED" })
        });
      }

      alert("Layout saved successfully! Form is now active.");
      router.push(`/${locale}/gn-officer/forms`);
    } catch (err) {
      console.error(err);
      alert("Failed to save layout.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <div className="w-80 border-r bg-white dark:bg-slate-950 p-4 flex flex-col gap-6 overflow-y-auto z-10 shadow-lg">
        <div>
          <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forms
          </Button>
          <h2 className="text-xl font-bold">{form.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop fields over the PDF to create the fillable layout.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Add Fields</h3>
          <Button variant="outline" className="w-full justify-start" onClick={() => addField("TEXT")}>
            <PlusSquare className="mr-2 h-4 w-4 text-blue-500" /> Add Text Field
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addField("CHECKBOX")}>
            <CheckSquare className="mr-2 h-4 w-4 text-emerald-500" /> Add Checkbox
          </Button>
        </div>

        <div className="space-y-4 flex-1">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Field Settings</h3>
          {fields.filter(f => f.page === currentPage).length === 0 ? (
            <p className="text-sm text-muted-foreground">No fields on this page.</p>
          ) : (
            fields.filter(f => f.page === currentPage).map((field, idx) => (
              <Card key={field.id} className="p-3 shadow-sm border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold">{field.type} FIELD</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-red-500" onClick={() => removeField(field.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Label (Optional)</Label>
                  <Input 
                    size={1}
                    className="h-7 text-xs" 
                    value={field.label} 
                    onChange={(e) => updateField(field.id, { label: e.target.value })} 
                    placeholder="e.g. Full Name"
                  />
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="pt-4 border-t mt-auto">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={saveLayout} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save & Publish Layout"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-800 p-8 flex justify-center relative">
        <div className="relative shadow-2xl bg-white" style={{ width: 'fit-content', height: 'fit-content' }}>
          <Document file={form.pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="Loading PDF...">
            <Page 
              pageNumber={currentPage} 
              scale={pdfScale} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              className="border border-slate-300"
            />
          </Document>

          {fields.filter(f => f.page === currentPage).map((field) => (
            <Rnd
              key={field.id}
              size={{ width: field.width, height: field.height }}
              position={{ x: field.x, y: field.y }}
              onDragStop={(e, d) => updateField(field.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateField(field.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position
                });
              }}
              bounds="parent"
              className={`border-2 ${field.type === 'CHECKBOX' ? 'border-emerald-500 bg-emerald-500/20' : 'border-blue-500 bg-blue-500/20'} flex items-center justify-center relative group cursor-move`}
            >
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 absolute -top-4 left-0 bg-black text-white px-1 rounded whitespace-nowrap z-50">
                {field.label}
              </span>
            </Rnd>
          ))}
        </div>

        {numPages && numPages > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-lg border flex items-center gap-4 z-20">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
            <span className="text-sm font-medium">Page {currentPage} of {numPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
