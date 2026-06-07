export type Category = "job" | "announcement" | "scholarship";

export interface User {
  id: string;
  email: string;
  name: string;
  keywords: string[];
}

export interface BoardItem {
  id: string;
  category: Category;
  title: string;
  summary: string;
  body: string;
  source: string;
  sourceUrl: string;
  date: string;
  keywords: string[];
  employment?: string | null;
  workType?: string | null;
  duty?: string | null;
  deadline?: string | null;
  isAlwaysOpen?: boolean | null;
}

export interface ScoreBreakdownItem {
  label: string;
  score: number;
  comment?: string;
}

export interface Recommendation {
  itemId: string;
  matchScore: number;
  matchReason: string;
  preparationTips: string[];
  // 확장 필드 (백엔드가 채워주면 표시, 구버전/목 데이터는 없을 수 있어 optional)
  matchLevel?: string;
  scoreBreakdown?: ScoreBreakdownItem[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recommendedActions?: string[];
  deadlineNote?: string | null;
}

export type NotificationCategory = "announcement" | "scholarship" | "job";

export interface NotificationSettings {
  categories: NotificationCategory[];
  duties: string[];
  work_types: string[];
  search: string;
  keywords: string[];
}
