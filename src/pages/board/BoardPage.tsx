import { useMemo, useState } from "react";
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
import { useRecommendFilter } from "@/hooks/useRecommendFilter";
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
  const { keywords } = useKeywords();
  const { category: recommendCategory } = useRecommendCategory();
  const { filter, hasFilter } = useRecommendFilter();
  const { showExpired, setShowExpired } = useExpiredFilter();

  const hasKeywords = keywords.length > 0;
  // 키워드 또는 필터가 있으면 진입 시 추천 탭이 기본
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    hasKeywords || hasFilter ? "recommendation" : "all",
  );

  const isRecommendTab = activeCategory === "recommendation";
  const showJobFiltersInRecommend =
    recommendCategory === "all" || recommendCategory === "job";

  const apiCategory = isRecommendTab
    ? (recommendCategory === "all" ? undefined : (recommendCategory as Category))
    : (activeCategory === "all" ? undefined : (activeCategory as Category));

  const apiKeywords = isRecommendTab && hasKeywords ? keywords : undefined;
  const apiSearch = isRecommendTab && filter.search ? filter.search : undefined;
  const apiDuty =
    isRecommendTab && showJobFiltersInRecommend && filter.duties.length > 0
      ? filter.duties.join(",")
      : undefined;
  const apiWorkType =
    isRecommendTab && showJobFiltersInRecommend && filter.workTypes.length > 0
      ? filter.workTypes.join(",")
      : undefined;

  const { data: items = [], isLoading } = useBoardItems(
    apiCategory,
    apiKeywords,
    !isRecommendTab || hasKeywords || hasFilter,
    apiSearch,
    apiDuty,
    apiWorkType,
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
    if (isRecommendTab) {
      // 키워드 없이 필터만 있을 땐 매칭 점수 의미 없음 → 등록일 기준
      return hasKeywords
        ? sortByMatchScoreDesc(filteredItems, scoreById)
        : sortAllItems(filteredItems);
    }
    if (activeCategory === "all") return sortAllItems(filteredItems);
    if (activeCategory === "job" || activeCategory === "announcement" || activeCategory === "scholarship") {
      return sortByCategoryView(filteredItems, activeCategory);
    }
    return filteredItems;
  }, [filteredItems, isRecommendTab, scoreById, activeCategory, hasKeywords]);

  const [page, setPage] = useState(1);
  const filterKey = `${activeCategory}|${recommendCategory}|${keywords.join(",")}|${JSON.stringify(filter)}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const pagedItems = useMemo(
    () => sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedItems, page],
  );

  const showInfoPanel = hasKeywords || hasFilter;

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

      {showInfoPanel && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground shrink-0">추천 카테고리</span>
            <Badge variant="secondary">
              {RECOMMEND_CATEGORY_LABELS[recommendCategory] ?? recommendCategory}
            </Badge>
          </div>
          {hasKeywords && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground shrink-0">키워드</span>
              {keywords.map((k) => (
                <KeywordChip key={k} keyword={k} variant="secondary" />
              ))}
            </div>
          )}
          {filter.search && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground shrink-0">제목 검색</span>
              <Badge variant="outline">{filter.search}</Badge>
            </div>
          )}
          {filter.duties.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground shrink-0">직무</span>
              {filter.duties.map((d) => (
                <Badge key={d} variant="outline">{d}</Badge>
              ))}
            </div>
          )}
          {filter.workTypes.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground shrink-0">고용형태</span>
              {filter.workTypes.map((w) => (
                <Badge key={w} variant="outline">{w}</Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {isRecommendTab && !hasKeywords && !hasFilter && (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground">
            키워드 또는 필터를 설정하면 맞춤 추천을 받아볼 수 있어요.
          </p>
          <Button variant="link" className="mt-2" render={<Link to="/keywords/edit" />}>
            키워드 / 필터 설정하기
          </Button>
        </div>
      )}

      <CategoryTabs value={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : isRecommendTab && !hasKeywords && !hasFilter ? null : sortedItems.length === 0 ? (
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
