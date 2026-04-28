import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { KeywordChip } from "@/components/common/KeywordChip";
import { MultiChipFilter } from "@/components/common/MultiChipFilter";
import { useAuth } from "@/hooks/useAuth";
import { useKeywords } from "@/hooks/useKeywords";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { DUTY_OPTIONS, WORK_TYPE_OPTIONS } from "@/lib/jobOptions";
import type { NotificationCategory, NotificationSettings } from "@/types";

const CATEGORY_OPTIONS: { value: NotificationCategory; label: string }[] = [
  { value: "announcement", label: "학사공지" },
  { value: "scholarship", label: "장학금공지" },
  { value: "job", label: "채용공고" },
];

export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { keywords: currentKeywords } = useKeywords();
  const { settings, isLoading, save, isSaving } = useNotificationSettings(user?.id);

  const [categories, setCategories] = useState<NotificationCategory[]>([]);
  const [duties, setDuties] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 서버 설정 로드 시 폼 초기화
  useEffect(() => {
    if (!settings) return;
    setCategories(settings.categories);
    setDuties(settings.duties);
    setWorkTypes(settings.work_types);
    setSearch(settings.search ?? "");
    setKeywords(settings.keywords);
  }, [settings]);

  const toggleCategory = (cat: NotificationCategory) => {
    setError(null);
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const addKeyword = (raw: string) => {
    const k = raw.trim();
    if (!k || keywords.includes(k)) return;
    setKeywords([...keywords, k]);
    setKeywordInput("");
  };

  const removeKeyword = (k: string) => {
    setKeywords(keywords.filter((x) => x !== k));
  };

  const overwriteWithCurrentKeywords = () => {
    setKeywords([...currentKeywords]);
  };

  const handleSave = async () => {
    setError(null);
    if (categories.length === 0) {
      setError("최소 1개 카테고리를 선택해주세요.");
      return;
    }
    const hasJob = categories.includes("job");
    if (!hasJob && (duties.length > 0 || workTypes.length > 0)) {
      setError(
        "직무 또는 고용형태를 설정하려면 채용공고를 함께 선택해야 합니다.",
      );
      return;
    }
    const payload: NotificationSettings = {
      categories,
      duties: hasJob ? duties : [],
      work_types: hasJob ? workTypes : [],
      search: search.trim(),
      keywords,
    };
    try {
      await save(payload);
      navigate("/board");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
    );
  }

  const hasJob = categories.includes("job");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">이메일 알림 설정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          새로 올라온 게시물 중 조건과 일치하는 항목을 이메일로 받아볼 수 있어요.
        </p>
      </div>

      {/* 카테고리 (필수) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">받을 카테고리 (1개 이상)</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => {
            const selected = categories.includes(c.value);
            return (
              <Button
                key={c.value}
                type="button"
                variant={selected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCategory(c.value)}
              >
                {c.label}
              </Button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* 필터 (제목 검색 + 직무/고용형태 — 채용공고 선택 시) */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">필터</h2>
        <p className="text-xs text-muted-foreground">
          키워드 매칭과 AND로 결합돼요. 비워두면 적용 안 됩니다.
        </p>

        <div className="space-y-1.5">
          <p className="text-sm">제목 검색</p>
          <Input
            placeholder="제목으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {hasJob && (
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
      </section>

      <Separator />

      {/* 키워드 (선택) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">키워드 (선택)</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={overwriteWithCurrentKeywords}
            disabled={currentKeywords.length === 0}
          >
            현재 키워드로 덮어쓰기
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="키워드를 입력하고 Enter"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword(keywordInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addKeyword(keywordInput)}
            disabled={!keywordInput.trim()}
          >
            추가
          </Button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <KeywordChip
                key={k}
                keyword={k}
                onRemove={() => removeKeyword(k)}
              />
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          키워드를 설정하면 매칭 점수가 10%를 넘는 항목만 메일로 받습니다.
          비워두면 카테고리/필터에 맞는 모든 새 항목을 받습니다.
        </p>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => navigate("/board")}
        >
          취소
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
