import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AuthPage } from "@/pages/auth/AuthPage";
import { KeywordInputPage } from "@/pages/keywords/KeywordInputPage";
import { KeywordEditPage } from "@/pages/keywords/KeywordEditPage";
import { BoardPage } from "@/pages/board/BoardPage";
import { DetailPage } from "@/pages/detail/DetailPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/keywords", element: <KeywordInputPage /> },
      { path: "/keywords/edit", element: <KeywordEditPage /> },
      { path: "/board", element: <BoardPage /> },
      { path: "/board/:id", element: <DetailPage /> },
      { path: "/", element: <Navigate to="/board" replace /> },
    ],
  },
]);
