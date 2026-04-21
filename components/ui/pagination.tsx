import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface MangaPaginationProps {
  currentPage: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
}

export function MangaPagination({
  currentPage,
  total = 0,
  limit = 25,
  onPageChange,
}: MangaPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const maxPages = 5;

  const getPages = () => {
    const pages: number[] = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
      </Button>

      {getPages().map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} />
      </Button>
    </div>
  );
}
