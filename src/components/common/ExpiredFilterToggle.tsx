interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ExpiredFilterToggle({ checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
      <input
        type="checkbox"
        className="h-3.5 w-3.5 cursor-pointer accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      마감·오래된 게시물 포함
    </label>
  );
}
