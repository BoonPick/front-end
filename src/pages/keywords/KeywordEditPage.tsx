import { useNavigate } from "react-router-dom";
import { KeywordForm } from "@/components/common/KeywordForm";
import { useKeywords } from "@/hooks/useKeywords";

export function KeywordEditPage() {
  const navigate = useNavigate();
  const { keywords, updateKeywords, isLoading } = useKeywords();

  const handleSubmit = async (newKeywords: string[]) => {
    await updateKeywords(newKeywords);
    navigate("/board");
  };

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">로딩 중...</div>;
  }

  return (
    <KeywordForm
      title="키워드 수정"
      submitLabel="저장"
      initialKeywords={keywords}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/board")}
    />
  );
}
