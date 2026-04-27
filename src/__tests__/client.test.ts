import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/api/client";

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fetch with the correct URL and Content-Type header", async () => {
    const mockData = { id: "1", email: "test@test.com" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as any);

    const result = await apiClient("/api/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
    expect(result).toEqual(mockData);
  });

  it("throws an error with detail message when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ detail: "Bad request" }),
    } as any);

    await expect(apiClient("/api/test")).rejects.toThrow("Bad request");
  });

  it("throws generic API Error when body has no detail", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({}),
    } as any);

    await expect(apiClient("/api/test")).rejects.toThrow("API Error: 500");
  });

  it("throws generic API Error when json parsing fails on error response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: vi.fn().mockRejectedValue(new Error("invalid json")),
    } as any);

    await expect(apiClient("/api/test")).rejects.toThrow("API Error: 503");
  });

  it("includes custom headers in the request", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as any);

    await apiClient("/api/test", {
      headers: { Authorization: "Bearer token" },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    );
  });

  it("passes method and body through to fetch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    } as any);

    await apiClient("/api/test", {
      method: "POST",
      body: JSON.stringify({ key: "value" }),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({ method: "POST", body: '{"key":"value"}' }),
    );
  });
});
