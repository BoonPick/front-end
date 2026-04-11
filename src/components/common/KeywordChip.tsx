import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordChipProps {
  keyword: string;
  onRemove?: () => void;
  onClick?: () => void;
  variant?: "default" | "secondary" | "outline";
}

export function KeywordChip({
  keyword,
  onRemove,
  onClick,
  variant = "default",
}: KeywordChipProps) {
  return (
    <Badge
      variant={variant}
      className="cursor-pointer gap-1 px-3 py-1 text-sm"
      onClick={onClick}
    >
      {keyword}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="pointer-events-auto"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
