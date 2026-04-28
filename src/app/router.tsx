import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AuthPage } from "@/pages/auth/AuthPage";
import { KeywordInputPage } from "@/pages/keywords/KeywordInputPage";
import { KeywordEditPage } from "@/pages/keywords/KeywordEditPage";
import { BoardPage } from "@/pages/board/BoardPage";
import { DetailPage } from "@/pages/detail/DetailPage";
import { SearchPage } from "@/pages/search/SearchPage";
import { AdminKeywordPage } from "@/pages/admin/AdminKeywordPage";
import { NotificationSettingsPage } from "@/pages/notifications/NotificationSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/admin",
    element: <AdminKeywordPage />,
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
      { path: "/notifications", element: <NotificationSettingsPage /> },
      { path: "/board", element: <BoardPage /> },
      { path: "/board/:id", element: <DetailPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/", element: <Navigate to="/board" replace /> },
    ],
  },
]);
