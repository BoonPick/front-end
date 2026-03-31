import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
