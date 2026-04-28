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
import type { NotificationCategory, NotificationSettings } from "@/types";

const CATEGORY_OPTIONS: { value: NotificationCategory; label: string }[] = [
  { value: "announcement", label: "학사공지" },
  { value: "scholarship", label: "장학금공지" },
  { value: "job", label: "채용공고" },
];

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

export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { keywords: currentKeywords } = useKeywords();
  const { settings, isLoading, save, isSaving } = useNotificationSettings(user?.id);

  const [categories, setCategories] = useState<NotificationCategory[]>([]);
  const [duties, setDuties] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 서버 설정 로드 시 폼 초기화
  useEffect(() => {
    if (!settings) return;
    setCategories(settings.categories);
    setDuties(settings.duties);
    setWorkTypes(settings.work_types);
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

      {/* 직무·고용형태 — 채용공고 선택 시에만 노출 */}
      {hasJob && (
        <>
          <Separator />
          <section className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">직무 (OR 검색)</h2>
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
                <h2 className="text-sm font-medium">고용형태 (OR 검색)</h2>
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
          </section>
        </>
      )}

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
