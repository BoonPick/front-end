import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/api/auth";

vi.mock("@/api/auth");

const STORAGE_KEY = "boonpick_user";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("initializes with null user when localStorage is empty", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("initializes with stored user from localStorage", () => {
    const storedUser = { id: "1", email: "a@b.com", name: "Alice", keywords: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUser));

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(storedUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("login sets user and persists to localStorage", async () => {
    const mockUser = { id: "2", email: "b@c.com", name: "Bob", keywords: [] };
    vi.mocked(authApi.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("b@c.com", "pass");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored).toEqual(mockUser);
  });

  it("login sets error and rethrows on failure", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error("로그인 실패"));

    const { result } = renderHook(() => useAuth());

    let caughtMessage: string | null = null;
    await act(async () => {
      try {
        await result.current.login("bad@email.com", "wrong");
      } catch (e) {
        caughtMessage = (e as Error).message;
      }
    });

    expect(caughtMessage).toBe("로그인 실패");
    expect(result.current.error).toBe("로그인 실패");
    expect(result.current.user).toBeNull();
  });

  it("signup sets user on success", async () => {
    const mockUser = { id: "3", email: "c@d.com", name: "Carol", keywords: [] };
    vi.mocked(authApi.signup).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signup("c@d.com", "pass", "Carol");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("signup sets error and rethrows on failure", async () => {
    vi.mocked(authApi.signup).mockRejectedValue(new Error("회원가입에 실패했습니다."));

    const { result } = renderHook(() => useAuth());

    let caughtMessage: string | null = null;
    await act(async () => {
      try {
        await result.current.signup("x@y.com", "pass", "X");
      } catch (e) {
        caughtMessage = (e as Error).message;
      }
    });

    expect(caughtMessage).toBe("회원가입에 실패했습니다.");
    expect(result.current.error).toBe("회원가입에 실패했습니다.");
  });

  it("logout clears user and removes localStorage entries", async () => {
    const mockUser = { id: "1", email: "a@b.com", name: "Alice", keywords: [] };
    vi.mocked(authApi.login).mockResolvedValue(mockUser);
    localStorage.setItem("boonpick_keywords", JSON.stringify(["AI"]));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("a@b.com", "pass");
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem("boonpick_keywords")).toBeNull();
  });

  it("loading is true during login and false after", async () => {
    let resolveLogin!: (val: any) => void;
    const loginPromise = new Promise((res) => { resolveLogin = res; });
    vi.mocked(authApi.login).mockReturnValue(loginPromise as any);

    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.login("a@b.com", "pass");
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveLogin({ id: "1", email: "a@b.com", name: "A", keywords: [] });
      await loginPromise;
    });
    expect(result.current.loading).toBe(false);
  });
});
