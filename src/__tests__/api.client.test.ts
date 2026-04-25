import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/api/client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns parsed JSON on success", async () => {
    const mockData = { id: "1", name: "test" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await apiClient<typeof mockData>("/api/test");
    expect(result).toEqual(mockData);
  });

  it("calls fetch with Content-Type application/json header", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await apiClient("/api/test");
    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((options as RequestInit).headers).toMatchObject({
      "Content-Type": "application/json",
    });
  });

  it("throws error with detail message when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ detail: "Bad request" }),
    } as Response);

    await expect(apiClient("/api/test")).rejects.toThrow("Bad request");
  });

  it("throws generic error with status code when no detail in body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve(null),
    } as Response);

    await expect(apiClient("/api/test")).rejects.toThrow("API Error: 500");
  });

  it("passes custom headers to fetch (options spread overrides merged headers)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await apiClient("/api/test", {
      headers: { Authorization: "Bearer token" },
    });
    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    // The outer ...options spread overwrites the merged headers object,
    // so only the custom header survives when options.headers is provided.
    expect((options as RequestInit).headers).toMatchObject({
      Authorization: "Bearer token",
    });
  });

  it("passes method and body to fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    await apiClient("/api/test", {
      method: "POST",
      body: JSON.stringify({ key: "value" }),
    });
    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((options as RequestInit).method).toBe("POST");
    expect((options as RequestInit).body).toBe(JSON.stringify({ key: "value" }));
  });

  it("falls back to generic error when json parsing fails on error response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: () => Promise.reject(new Error("not JSON")),
    } as unknown as Response);

    await expect(apiClient("/api/test")).rejects.toThrow("API Error: 503");
  });
});
