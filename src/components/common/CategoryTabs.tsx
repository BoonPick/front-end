import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  value: string;
  onChange: (value: string) => void;
}

const categories: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "job", label: "채용" },
  { value: "announcement", label: "공지" },
  { value: "scholarship", label: "장학금" },
];

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        {categories.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
