"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FillFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;
  
  const [form, setForm] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setForm(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/pdf-forms/${formId}/submit`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Form submitted successfully!");
        router.back();
      } else {
        alert("Failed to submit form.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-950 border-b p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-xl font-bold">{form.title}</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={submitForm} disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit Form"}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center relative">
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

          {/* Render Input Fields Overlay */}
          {form.fields?.filter((f: any) => f.page === currentPage).map((field: any) => (
            <div
              key={field.id}
              style={{
                position: 'absolute',
                left: field.x * pdfScale,
                top: field.y * pdfScale,
                width: field.width * pdfScale,
                height: field.height * pdfScale,
                zIndex: 20
              }}
              className="group"
            >
              {field.label && (
                <div className="absolute -top-5 left-0 text-[10px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-sm whitespace-nowrap">
                  {field.label}
                </div>
              )}
              {field.type === 'CHECKBOX' ? (
                <input
                  type="checkbox"
                  checked={formData[field.id] === 'true'}
                  onChange={(e) => handleInputChange(field.id, e.target.checked ? 'true' : 'false')}
                  className="w-full h-full cursor-pointer accent-blue-600 border-blue-400"
                />
              ) : (
                <input
                  type="text"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full h-full bg-blue-50/50 border border-blue-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none px-1 text-sm text-slate-800 transition-colors"
                  placeholder=""
                />
              )}
            </div>
          ))}
        </div>

        {numPages && numPages > 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-lg border flex items-center gap-4 z-30">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1}>Prev</Button>
            <span className="text-sm font-medium">Page {currentPage} of {numPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
