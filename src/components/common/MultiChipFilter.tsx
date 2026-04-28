import { cn } from "@/lib/utils";

interface Props {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiChipFilter({ options, value, onChange }: Props) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={selected}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md border transition-colors select-none",
              selected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border text-foreground/80",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
