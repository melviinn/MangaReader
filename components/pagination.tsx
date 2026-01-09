"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type MangaPaginationProps = {
  page: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
};

export function MangaPagination({
  page,
  total = 0,
  limit = 25,
  onPageChange,
}: MangaPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const maxPages = 5;

  const getPages = () => {
    const pages: number[] = [];

    let startPage = Math.max(1, page - 2);
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
      {/* Previous */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Pages */}
      {getPages().map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
