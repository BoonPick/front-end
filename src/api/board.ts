import type { BoardItem, Category } from "@/types";
import { mockBoardItems } from "@/mocks/boardItems";

// TODO: 백엔드 완성 시 apiClient로 교체
// import { apiClient } from "./client";

export async function getBoardItems(
  category?: Category,
  keywords?: string[],
): Promise<BoardItem[]> {
  await delay(200);

  let items = [...mockBoardItems];

  if (category) {
    items = items.filter((item) => item.category === category);
  }

  if (keywords && keywords.length > 0) {
    items = items.filter((item) =>
      item.keywords.some((k) =>
        keywords.some(
          (userK) =>
            k.toLowerCase().includes(userK.toLowerCase()) ||
            userK.toLowerCase().includes(k.toLowerCase()),
        ),
      ),
    );
  }

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // 실제 API:
  // const params = new URLSearchParams();
  // if (category) params.set("category", category);
  // if (keywords?.length) params.set("keywords", keywords.join(","));
  // return apiClient<BoardItem[]>(`/api/board?${params}`);
}

export async function getBoardItem(id: string): Promise<BoardItem> {
  await delay(200);

  const item = mockBoardItems.find((item) => item.id === id);
  if (!item) {
    throw new Error("게시글을 찾을 수 없습니다.");
  }
  return item;

  // 실제 API:
  // return apiClient<BoardItem>(`/api/board/${id}`);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
