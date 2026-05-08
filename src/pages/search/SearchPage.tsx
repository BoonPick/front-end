import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/common/CategoryTabs";
import { BoardCard } from "@/components/common/BoardCard";
import { Pagination } from "@/components/common/Pagination";
import { ExpiredFilterToggle } from "@/components/common/ExpiredFilterToggle";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";
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
import { DUTY_OPTIONS, WORK_TYPE_OPTIONS } from "@/lib/jobOptions";
import { Search } from "lucide-react";
import type { Category } from "@/types";

const PAGE_SIZE = 10;

export function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [duties, setDuties] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const { keywords } = useKeywords();
  const { category: recommendCategory } = useRecommendCategory();
  const { showExpired, setShowExpired } = useExpiredFilter();

  const isRecommendTab = activeCategory === "recommendation";
  const showJobFilters = activeCategory === "all" || activeCategory === "job";
  const dutyParam = duties.join(",");
  const workTypeParam = workTypes.join(",");
  const hasFilter = !!search || duties.length > 0 || workTypes.length > 0;

  const apiCategory = isRecommendTab
    ? (recommendCategory === "all" ? undefined : (recommendCategory as Category))
    : (activeCategory === "all" ? undefined : (activeCategory as Category));

  const apiKeywords = isRecommendTab ? keywords : undefined;
  const shouldFetch = hasFilter && (!isRecommendTab || keywords.length > 0);

  const { data: items = [], isLoading } = useBoardItems(
    apiCategory,
    apiKeywords,
    shouldFetch,
    search || undefined,
    dutyParam || undefined,
    workTypeParam || undefined,
  );

  const filteredItems = useMemo(
    () => (showExpired ? items : filterExpired(items)),
    [items, showExpired],
  );

  const itemIds = useMemo(() => filteredItems.map((i) => i.id), [filteredItems]);
  const { scoreById } = useRecommendationScores(
    itemIds,
    isRecommendTab && keywords.length > 0 && filteredItems.length > 0,
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
  const filterKey = `${activeCategory}|${recommendCategory}|${search}|${dutyParam}|${workTypeParam}`;
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

  const handleSearch = () => setSearch(inputValue.trim());

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">검색</h1>
        <ExpiredFilterToggle checked={showExpired} onChange={setShowExpired} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="제목으로 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showJobFilters && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">직무</span>
              {duties.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setDuties([])}
                >
                  초기화
                </button>
              )}
            </div>
            <MultiChipFilter options={DUTY_OPTIONS} value={duties} onChange={setDuties} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">고용형태</span>
              {workTypes.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setWorkTypes([])}
                >
                  초기화
                </button>
              )}
            </div>
            <MultiChipFilter options={WORK_TYPE_OPTIONS} value={workTypes} onChange={setWorkTypes} />
          </div>
        </div>
      )}

      <CategoryTabs value={activeCategory} onChange={setActiveCategory} />

      {!hasFilter ? (
        <div className="py-8 text-center text-muted-foreground">
          검색어를 입력하거나 필터를 선택하세요.
        </div>
      ) : isLoading ? (
        <div className="py-8 text-center text-muted-foreground">검색 중...</div>
      ) : sortedItems.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">검색 결과가 없습니다.</div>
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
