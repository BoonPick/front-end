import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeywordForm } from "@/components/common/KeywordForm";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";
import { useRecommendFilter } from "@/hooks/useRecommendFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types";

const categoryOptions: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "job", label: "채용" },
  { value: "announcement", label: "공지" },
  { value: "scholarship", label: "장학금" },
];

export function KeywordEditPage() {
  const navigate = useNavigate();
  const { keywords, updateKeywords, isLoading } = useKeywords();
  const { category: recommendCategory, updateCategory } = useRecommendCategory();
  const { filter, setFilter } = useRecommendFilter();

  const [search, setSearch] = useState(filter.search);

  const handleSubmit = async (newKeywords: string[]) => {
    await updateKeywords(newKeywords);
    setFilter({ search: search.trim() });
    navigate("/board");
  };

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">로딩 중...</div>;
  }

  return (
    <>
      <KeywordForm
        title="키워드 수정"
        submitLabel="저장"
        initialKeywords={keywords}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/board")}
      />

      <div className="mx-auto w-full max-w-2xl space-y-3 pt-2">
        <Separator />
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">추천 카테고리</p>
          <p className="text-xs text-muted-foreground">
            추천 탭에서 볼 카테고리를 선택하세요.
          </p>
          <div className="flex gap-2 flex-wrap">
            {categoryOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={recommendCategory === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateCategory(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">필터</p>
          <p className="text-xs text-muted-foreground">
            추천 탭에 적용할 제목 검색입니다. 키워드와 AND로 결합돼요.
          </p>
          <Input
            placeholder="제목으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
