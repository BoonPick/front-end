import { describe, it, expect, vi, beforeEach } from "vitest";
import { getKeywords, updateKeywords, getSuggestedKeywords } from "@/api/keywords";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockApiClient = vi.mocked(client.apiClient);

beforeEach(() => {
  localStorage.clear();
  mockApiClient.mockReset();
});

describe("getKeywords", () => {
  it("returns empty array when nothing stored", async () => {
    const result = await getKeywords();
    expect(result).toEqual([]);
  });

  it("returns parsed stored keywords", async () => {
    localStorage.setItem("boonpick_keywords", JSON.stringify(["react", "node"]));
    const result = await getKeywords();
    expect(result).toEqual(["react", "node"]);
  });
});

describe("updateKeywords", () => {
  it("stores keywords in localStorage", async () => {
    await updateKeywords(["python", "fastapi"]);
    const stored = localStorage.getItem("boonpick_keywords");
    expect(JSON.parse(stored!)).toEqual(["python", "fastapi"]);
  });

  it("overwrites previous keywords", async () => {
    await updateKeywords(["old"]);
    await updateKeywords(["new1", "new2"]);
    const stored = localStorage.getItem("boonpick_keywords");
    expect(JSON.parse(stored!)).toEqual(["new1", "new2"]);
  });

  it("can store empty array", async () => {
    await updateKeywords([]);
    const stored = localStorage.getItem("boonpick_keywords");
    expect(JSON.parse(stored!)).toEqual([]);
  });
});

describe("getSuggestedKeywords", () => {
  it("calls apiClient with /api/keywords", async () => {
    mockApiClient.mockResolvedValue(["AI", "backend"]);
    const result = await getSuggestedKeywords();
    expect(mockApiClient).toHaveBeenCalledWith("/api/keywords");
    expect(result).toEqual(["AI", "backend"]);
  });

  it("propagates errors", async () => {
    mockApiClient.mockRejectedValue(new Error("Server error"));
    await expect(getSuggestedKeywords()).rejects.toThrow("Server error");
  });
});
