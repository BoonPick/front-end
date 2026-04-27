import { useState } from "react";
import type { Category } from "@/types";

type RecommendCategory = Category | "all";

export function useRecommendCategory() {
  const [category, setCategory] = useState<RecommendCategory>(() => {
    return (localStorage.getItem("recommendCategory") as RecommendCategory) || "all";
  });

  const updateCategory = (cat: RecommendCategory) => {
    localStorage.setItem("recommendCategory", cat);
    setCategory(cat);
  };

  return { category, updateCategory };
}
