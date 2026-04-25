import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/api/auth";

vi.mock("@/api/auth");

const STORAGE_KEY = "boonpick_user";

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("initializes with null user when no stored user", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("initializes with stored user from localStorage", () => {
    const storedUser = { id: "1", email: "a@b.com", name: "A", keywords: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUser));
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(storedUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("login sets user and stores in localStorage", async () => {
    const mockUser = { id: "2", email: "b@c.com", name: "B", keywords: [] };
    vi.mocked(authApi.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login("b@c.com", "pass");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(mockUser);
  });

  it("login sets error and rethrows on failure", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await expect(result.current.login("bad@email.com", "wrong")).rejects.toThrow("Invalid credentials");
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.user).toBeNull();
  });

  it("signup sets user and stores in localStorage", async () => {
    const mockUser = { id: "3", email: "c@c.com", name: "C", keywords: [] };
    vi.mocked(authApi.signup).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signup("c@c.com", "pass", "C");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(mockUser);
  });

  it("logout clears user and localStorage", async () => {
    const mockUser = { id: "4", email: "d@d.com", name: "D", keywords: [] };
    vi.mocked(authApi.login).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login("d@d.com", "pass");
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("sets loading true during login and false after", async () => {
    let resolveLogin!: (u: typeof mockUser) => void;
    const mockUser = { id: "5", email: "e@e.com", name: "E", keywords: [] };
    vi.mocked(authApi.login).mockReturnValue(
      new Promise((r) => { resolveLogin = r; })
    );

    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login("e@e.com", "pass");
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveLogin(mockUser);
    });
    expect(result.current.loading).toBe(false);
  });
});
