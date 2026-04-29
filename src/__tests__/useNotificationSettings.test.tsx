import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import * as notificationsApi from "@/api/notifications";
import type { NotificationSettings } from "@/types";

vi.mock("@/api/notifications");

const mockSettings: NotificationSettings = {
  categories: ["job"],
  duties: ["개발(IT)"],
  work_types: ["정규직"],
  search: "",
  keywords: ["python"],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNotificationSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null settings initially when no userId", () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    const { result } = renderHook(() => useNotificationSettings(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.settings).toBeNull();
  });

  it("does not fetch when userId is undefined", () => {
    const { result } = renderHook(() => useNotificationSettings(undefined), {
      wrapper: createWrapper(),
    });
    expect(notificationsApi.getNotificationSettings).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches settings when userId is provided", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(
      mockSettings,
    );
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(notificationsApi.getNotificationSettings).toHaveBeenCalledWith("42");
    expect(result.current.settings).toEqual(mockSettings);
  });

  it("returns null when API returns null", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.settings).toBeNull();
  });

  it("exposes save function", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.save).toBe("function");
  });

  it("save calls updateNotificationSettings with userId and settings", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    vi.mocked(notificationsApi.updateNotificationSettings).mockResolvedValue(
      mockSettings,
    );
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.save(mockSettings);
    });

    expect(notificationsApi.updateNotificationSettings).toHaveBeenCalledWith(
      "42",
      mockSettings,
    );
  });

  it("exposes isSaving boolean", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(typeof result.current.isSaving).toBe("boolean");
  });

  it("exposes saveError (null when no error)", async () => {
    vi.mocked(notificationsApi.getNotificationSettings).mockResolvedValue(null);
    const { result } = renderHook(() => useNotificationSettings("42"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.saveError).toBeNull();
  });
});
