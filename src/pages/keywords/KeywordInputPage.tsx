import { useNavigate } from "react-router-dom";
import { KeywordForm } from "@/components/common/KeywordForm";
import { useKeywords } from "@/hooks/useKeywords";

export function KeywordInputPage() {
  const navigate = useNavigate();
  const { updateKeywords } = useKeywords();

  const handleSubmit = async (keywords: string[]) => {
    await updateKeywords(keywords);
    navigate("/board");
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <KeywordForm
        title="어떤 정보에 관심이 있으신가요?"
        submitLabel="시작하기"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
