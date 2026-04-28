import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeywordForm } from "@/components/common/KeywordForm";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";
import { useKeywords } from "@/hooks/useKeywords";
import { useRecommendCategory } from "@/hooks/useRecommendCategory";
import { useRecommendFilter } from "@/hooks/useRecommendFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DUTY_OPTIONS, WORK_TYPE_OPTIONS } from "@/lib/jobOptions";
import type { Category } from "@/types";

const categoryOptions: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "job", label: "채용" },
  { value: "announcement", label: "공지" },
  { value: "scholarship", label: "장학금" },
];

export function KeywordEditPage() {
  const navigate = useNavigate();
  const { keywords: storedKeywords, updateKeywords, isLoading } = useKeywords();
  const { category: recommendCategory, updateCategory } = useRecommendCategory();
  const { filter, setFilter } = useRecommendFilter();

  const [editKeywords, setEditKeywords] = useState<string[]>(storedKeywords);
  const [search, setSearch] = useState(filter.search);
  const [duties, setDuties] = useState<string[]>(filter.duties);
  const [workTypes, setWorkTypes] = useState<string[]>(filter.workTypes);
  const [saving, setSaving] = useState(false);

  const showJobFilters =
    recommendCategory === "all" || recommendCategory === "job";

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateKeywords(editKeywords);
      setFilter({
        search: search.trim(),
        duties: showJobFilters ? duties : [],
        workTypes: showJobFilters ? workTypes : [],
      });
      navigate("/board");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">로딩 중...</div>;
  }

  return (
    <>
      <KeywordForm
        title="키워드 수정"
        initialKeywords={storedKeywords}
        hideActions
        onKeywordsChange={setEditKeywords}
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
            추천 탭에 적용할 필터입니다. 키워드와 AND로 결합돼요.
          </p>

          <div className="space-y-1.5">
            <p className="text-sm">제목 검색</p>
            <Input
              placeholder="제목으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {showJobFilters && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm">직무 (OR 검색)</p>
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
                <MultiChipFilter
                  options={DUTY_OPTIONS}
                  value={duties}
                  onChange={setDuties}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm">고용형태 (OR 검색)</p>
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
                <MultiChipFilter
                  options={WORK_TYPE_OPTIONS}
                  value={workTypes}
                  onChange={setWorkTypes}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/board")}
            disabled={saving}
          >
            취소
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </>
  );
}
