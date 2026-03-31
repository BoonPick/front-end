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
}

export interface Recommendation {
  itemId: string;
  matchScore: number;
  matchReason: string;
  preparationTips: string[];
}
