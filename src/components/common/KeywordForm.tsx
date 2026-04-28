import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeywordChip } from "./KeywordChip";
import { getSuggestedKeywords } from "@/api/keywords";

interface KeywordFormProps {
  initialKeywords?: string[];
  onSubmit?: (keywords: string[]) => void;
  submitLabel?: string;
  title: string;
  onCancel?: () => void;
  hideActions?: boolean;
  onKeywordsChange?: (keywords: string[]) => void;
}

export function KeywordForm({
  initialKeywords = [],
  onSubmit,
  submitLabel,
  title,
  onCancel,
  hideActions = false,
  onKeywordsChange,
}: KeywordFormProps) {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputValue, setInputValue] = useState("");
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  useEffect(() => {
    getSuggestedKeywords().then(setSuggestedKeywords).catch(() => {});
  }, []);

  useEffect(() => {
    onKeywordsChange?.(keywords);
  }, [keywords, onKeywordsChange]);

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setInputValue("");
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(inputValue);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-2">
        <Input
          placeholder="관심 키워드를 입력하세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={() => addKeyword(inputValue)} disabled={!inputValue.trim()}>
          추가
        </Button>
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            선택된 키워드
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <KeywordChip
                key={keyword}
                keyword={keyword}
                onRemove={() => removeKeyword(keyword)}
              />
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          추천 키워드
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedKeywords
            .filter((k) => !keywords.includes(k))
            .map((keyword) => (
              <KeywordChip
                key={keyword}
                keyword={keyword}
                variant="outline"
                onClick={() => addKeyword(keyword)}
              />
            ))}
        </div>
      </div>

      {!hideActions && onSubmit && (
        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="flex-1">
              취소
            </Button>
          )}
          <Button onClick={() => onSubmit(keywords)} className="flex-1">
            {submitLabel ?? "저장"}
          </Button>
        </div>
      )}
    </div>
  );
}
