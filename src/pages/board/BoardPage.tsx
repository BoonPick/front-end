import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/common/CategoryTabs";
import { BoardCard } from "@/components/common/BoardCard";
import { KeywordChip } from "@/components/common/KeywordChip";
import { useBoardItems } from "@/hooks/useBoardItems";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";
import type { Category } from "@/types";
import { Settings } from "lucide-react";

export function BoardPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { keywords } = useKeywords();
  const { category: recommendCategory } = useRecommendCategory();

  const isRecommendTab = activeCategory === "recommendation";
  const hasKeywords = keywords.length > 0;

  const apiCategory = isRecommendTab
    ? (recommendCategory === "all" ? undefined : (recommendCategory as Category))
    : (activeCategory === "all" ? undefined : (activeCategory as Category));

  const apiKeywords = isRecommendTab ? keywords : undefined;

  const { data: items = [], isLoading } = useBoardItems(
    apiCategory,
    apiKeywords,
    !isRecommendTab || hasKeywords,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">맞춤 정보</h1>
        <Button variant="outline" size="sm" render={<Link to="/keywords/edit" />}>
          <Settings className="mr-1 h-4 w-4" />
          키워드 관리
        </Button>
      </div>

      {isRecommendTab && hasKeywords && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <KeywordChip key={k} keyword={k} variant="secondary" />
          ))}
        </div>
      )}

      {isRecommendTab && !hasKeywords && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">
            키워드를 설정하면 맞춤 추천을 받아볼 수 있어요.
          </p>
          <Button variant="link" className="mt-2" render={<Link to="/keywords/edit" />}>
            키워드 설정하기
          </Button>
        </div>
      )}

      <CategoryTabs value={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : isRecommendTab && !hasKeywords ? null : items.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <BoardCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
