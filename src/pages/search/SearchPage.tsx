import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryTabs } from "@/components/common/CategoryTabs";
import { BoardCard } from "@/components/common/BoardCard";
import { Pagination } from "@/components/common/Pagination";
import { useBoardItems } from "@/hooks/useBoardItems";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";
import { useRecommendationScores } from "@/hooks/useRecommendationScores";
import {
  sortAllItems,
  sortByCategoryView,
  sortByMatchScoreDesc,
} from "@/lib/sortBoardItems";
import { filterExpired } from "@/lib/filterBoardItems";
import { Search } from "lucide-react";
import type { Category } from "@/types";

const PAGE_SIZE = 10;

const DUTY_OPTIONS = [
  "경영지원", "인사", "전략/기획", "재무/회계", "구매", "금융사무직", "리서치",
  "(국내)영업(관리)", "마케팅", "해외영업", "물류/SCM", "광고/홍보", "MD",
  "CS(고객지원)", "방송/언론", "교사/공무원", "번역/통역", "비서", "(인문)전문직",
  "컨설턴트", "R&D(연구개발)", "SW엔지니어", "HW엔지니어", "기구설계", "품질관리",
  "생산관리", "공정설계/공정개발/공정관리", "기술영업", "개발(IT)", "데이터/머신러닝",
  "서비스기획(IT)", "UI/UX디자인", "법무", "기타", "요강참조",
];

const WORK_TYPE_OPTIONS = [
  "정규직", "계약직", "인턴직", "채용연계형인턴", "병역특례", "기타",
];

const selectClass =
  "flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring w-full max-w-xs";

export function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [duty, setDuty] = useState("");
  const [workType, setWorkType] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { keywords } = useKeywords();
  const { category: recommendCategory } = useRecommendCategory();

  const isRecommendTab = activeCategory === "recommendation";
  const showJobFilters = activeCategory === "all" || activeCategory === "job";
  const hasFilter = !!search || !!duty || !!workType;

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
    duty || undefined,
    workType || undefined,
  );

  const filteredItems = useMemo(() => filterExpired(items), [items]);

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
  useEffect(() => {
    setPage(1);
  }, [activeCategory, recommendCategory, search, duty, workType]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const pagedItems = useMemo(
    () => sortedItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sortedItems, page],
  );

  const handleSearch = () => setSearch(inputValue.trim());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">검색</h1>

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
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">직무</span>
            <select
              className={selectClass}
              value={duty}
              onChange={(e) => setDuty(e.target.value)}
            >
              <option value="">전체</option>
              {DUTY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">고용형태</span>
            <select
              className={selectClass}
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option value="">전체</option>
              {WORK_TYPE_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
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
