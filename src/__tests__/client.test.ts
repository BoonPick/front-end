import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/api/client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("apiClient", () => {
  it("returns parsed JSON on success", async () => {
    mockFetch.mockResolvedValue(makeResponse({ id: "1" }));
    const result = await apiClient<{ id: string }>("/api/test");
    expect(result).toEqual({ id: "1" });
  });

  it("calls fetch with correct URL and content-type header", async () => {
    mockFetch.mockResolvedValue(makeResponse({}));
    await apiClient("/api/endpoint");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/endpoint",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    );
  });

  it("throws with detail message when response not ok", async () => {
    mockFetch.mockResolvedValue(makeResponse({ detail: "Not found" }, false, 404));
    await expect(apiClient("/api/missing")).rejects.toThrow("Not found");
  });

  it("throws generic API error when no detail in body", async () => {
    mockFetch.mockResolvedValue(makeResponse({}, false, 500));
    await expect(apiClient("/api/error")).rejects.toThrow("API Error: 500");
  });

  it("merges extra headers from options", async () => {
    mockFetch.mockResolvedValue(makeResponse({}));
    await apiClient("/api/auth", { headers: { Authorization: "Bearer token" } });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token" }),
      }),
    );
  });

  it("forwards method and body options", async () => {
    mockFetch.mockResolvedValue(makeResponse({}));
    await apiClient("/api/post", { method: "POST", body: '{"x":1}' });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/post",
      expect.objectContaining({ method: "POST", body: '{"x":1}' }),
    );
  });
});
