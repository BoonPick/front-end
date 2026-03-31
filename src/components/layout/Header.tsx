import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings, Search } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/board" className="text-xl font-bold">
          BoonPick
        </Link>

        {user && (
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link to="/board" />}>
              <Search className="mr-1 h-4 w-4" />
              게시판
            </Button>
            <Button variant="ghost" size="sm" render={<Link to="/keywords/edit" />}>
              <Settings className="mr-1 h-4 w-4" />
              키워드 관리
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" />
              로그아웃
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
