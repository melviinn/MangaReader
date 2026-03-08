import { Card, CardContent } from "@/components/ui/card";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({
  message = "An unexpected error occurred. Please try again later.",
}: ErrorMessageProps) {
  return (
    <Card className="mt-12 border-destructive">
      <CardContent className="flex items-center gap-3 py-6 text-destructive">
        <HugeiconsIcon icon={Alert02Icon} />
        <span className="text-sm">{message}</span>
      </CardContent>
    </Card>
  );
}
