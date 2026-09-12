import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheckIcon, XCircleIcon } from "lucide-react";

// Since this is a server component, we can fetch the data directly
async function getVerificationData(token: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/verify/${token}`, {
      // Don't cache verification results
      cache: "no-store", 
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch");
    }

    return res.json();
  } catch (error) {
    console.error("Verification error:", error);
    return null;
  }
}

export default async function VerifyPage({ params }: { params: { token: string; locale: string } }) {
  const data = await getVerificationData(params.token);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full shadow-lg border-red-200 dark:border-red-900">
          <CardHeader className="text-center">
            <XCircleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <CardTitle className="text-2xl text-red-700 dark:text-red-500">Invalid Certificate</CardTitle>
            <CardDescription className="text-lg mt-2">
              The certificate you are trying to verify could not be found or is not authentic.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="max-w-md w-full shadow-lg border-green-200 dark:border-green-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        <CardHeader className="text-center pb-2">
          <ShieldCheckIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <CardTitle className="text-2xl text-green-700 dark:text-green-500">Verified Authentic</CardTitle>
          <CardDescription className="text-lg mt-2 font-medium">
            This certificate is a valid document issued by the Grama Niladhari.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 border-b dark:border-slate-800 pb-3">
              <span className="text-muted-foreground font-medium col-span-1">Type</span>
              <span className="font-semibold col-span-2">{data.requestType}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b dark:border-slate-800 pb-3">
              <span className="text-muted-foreground font-medium col-span-1">Name</span>
              <span className="font-semibold col-span-2">{data.residentName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 border-b dark:border-slate-800 pb-3">
              <span className="text-muted-foreground font-medium col-span-1">NIC</span>
              <span className="font-semibold col-span-2">{data.residentNic || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground font-medium col-span-1">Issued</span>
              <span className="font-semibold col-span-2">{new Date(data.dateOfIssue).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t dark:border-slate-800 text-center text-sm text-muted-foreground">
            Digital Verification System <br/>
            Grama Niladhari Division
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
