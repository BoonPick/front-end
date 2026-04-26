import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAdminKeywords, createKeyword, updateKeyword, deleteKeyword } from "@/api/admin";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockApiClient = vi.mocked(client.apiClient);

beforeEach(() => {
  mockApiClient.mockReset();
});

describe("getAdminKeywords", () => {
  it("calls apiClient with /api/admin/keywords", async () => {
    mockApiClient.mockResolvedValue([]);
    await getAdminKeywords();
    expect(mockApiClient).toHaveBeenCalledWith("/api/admin/keywords");
  });

  it("returns keyword list", async () => {
    const keywords = [{ id: 1, keyword_name: "react" }];
    mockApiClient.mockResolvedValue(keywords);
    const result = await getAdminKeywords();
    expect(result).toEqual(keywords);
  });
});

describe("createKeyword", () => {
  it("calls apiClient with POST and keyword_name", async () => {
    const created = { id: 5, keyword_name: "vue" };
    mockApiClient.mockResolvedValue(created);

    const result = await createKeyword("vue");

    expect(mockApiClient).toHaveBeenCalledWith("/api/admin/keywords", {
      method: "POST",
      body: JSON.stringify({ keyword_name: "vue" }),
    });
    expect(result).toEqual(created);
  });

  it("propagates errors", async () => {
    mockApiClient.mockRejectedValue(new Error("Duplicate"));
    await expect(createKeyword("dup")).rejects.toThrow("Duplicate");
  });
});

describe("updateKeyword", () => {
  it("calls apiClient with PUT and updated name", async () => {
    const updated = { id: 3, keyword_name: "angular" };
    mockApiClient.mockResolvedValue(updated);

    const result = await updateKeyword(3, "angular");

    expect(mockApiClient).toHaveBeenCalledWith("/api/admin/keywords/3", {
      method: "PUT",
      body: JSON.stringify({ keyword_name: "angular" }),
    });
    expect(result).toEqual(updated);
  });
});

describe("deleteKeyword", () => {
  it("calls fetch with DELETE method for the given id", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true } as Response);
    vi.stubGlobal("fetch", mockFetch);

    await deleteKeyword(7);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/admin/keywords/7",
      expect.objectContaining({ method: "DELETE" }),
    );

    vi.unstubAllGlobals();
  });
});
