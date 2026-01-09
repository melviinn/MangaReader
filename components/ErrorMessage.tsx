import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message = "Une erreur est survenue." }: ErrorMessageProps) {
  return (
    <Card className="mt-12 border-red-500 bg-red-50">
      <CardContent className="flex items-center gap-3 py-6 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm">{message}</span>
      </CardContent>
    </Card>
  );
}
