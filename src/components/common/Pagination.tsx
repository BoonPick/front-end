import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function buildPageWindow(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const window = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...window]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }
  return result;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageWindow(page, totalPages);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav aria-label="페이지 네비게이션" className="flex items-center justify-center gap-1 pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={!canPrev}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "ghost"}
            size="sm"
            className="min-w-9"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={!canNext}
        aria-label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
