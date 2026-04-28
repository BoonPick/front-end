import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryTabs } from "@/components/common/CategoryTabs";
import { BoardCard } from "@/components/common/BoardCard";
import { KeywordChip } from "@/components/common/KeywordChip";
import { Pagination } from "@/components/common/Pagination";
import { ExpiredFilterToggle } from "@/components/common/ExpiredFilterToggle";
import { useBoardItems } from "@/hooks/useBoardItems";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import { useExpiredFilter } from "@/hooks/useExpiredFilter";
import {
  sortAllItems,
  sortByCategoryView,
  sortByMatchScoreDesc,
} from "@/lib/sortBoardItems";
import { filterExpired } from "@/lib/filterBoardItems";
import type { Category } from "@/types";
import { Settings } from "lucide-react";

const PAGE_SIZE = 10;

const RECOMMEND_CATEGORY_LABELS: Record<string, string> = {
  all: "전체",
  job: "채용",
  announcement: "공지",
  scholarship: "장학금",
};

export function BoardPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { keywords } = useKeywords();
  const { category: recommendCategory } = useRecommendCategory();
  const { showExpired, setShowExpired } = useExpiredFilter();

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

  const filteredItems = useMemo(
    () => (showExpired ? items : filterExpired(items)),
    [items, showExpired],
  );

  const itemIds = useMemo(() => filteredItems.map((i) => i.id), [filteredItems]);
  const { scoreById } = useRecommendationScores(
    itemIds,
    isRecommendTab && hasKeywords && filteredItems.length > 0,
  );

  const sortedItems = useMemo(() => {
    if (isRecommendTab) return sortByMatchScoreDesc(filteredItems, scoreById);
    if (activeCategory === "all") return sortAllItems(filteredItems);
    if (activeCategory === "job" || activeCategory === "announcement" || activeCategory === "scholarship") {
      return sortByCategoryView(filteredItems, activeCategory);
    }
    return filteredItems;
  }, [filteredItems, isRecommendTab, scoreById, activeCategory]);

  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [activeCategory, recommendCategory, keywords]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const pagedItems = useMemo(
    () => sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedItems, page],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">맞춤 정보</h1>
        <div className="flex flex-col items-end gap-1.5">
          <Button variant="outline" size="sm" render={<Link to="/keywords/edit" />}>
            <Settings className="mr-1 h-4 w-4" />
            키워드 관리
          </Button>
          <ExpiredFilterToggle checked={showExpired} onChange={setShowExpired} />
        </div>
      </div>

      {hasKeywords && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground shrink-0">추천 카테고리</span>
            <Badge variant="secondary">
              {RECOMMEND_CATEGORY_LABELS[recommendCategory] ?? recommendCategory}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground shrink-0">키워드</span>
            {keywords.map((k) => (
              <KeywordChip key={k} keyword={k} variant="secondary" />
            ))}
          </div>
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
      ) : isRecommendTab && !hasKeywords ? null : sortedItems.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {pagedItems.map((item) => (
              <BoardCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
