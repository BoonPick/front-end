import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, signup } from "@/api/auth";
import * as client from "@/api/client";

vi.mock("@/api/client");

const mockApiClient = vi.mocked(client.apiClient);

beforeEach(() => {
  mockApiClient.mockReset();
});

describe("login", () => {
  it("calls apiClient with POST and credentials", async () => {
    const user = { id: "1", email: "a@b.com", name: "A", keywords: [] };
    mockApiClient.mockResolvedValue(user);

    const result = await login("a@b.com", "pass");

    expect(mockApiClient).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.com", password: "pass" }),
    });
    expect(result).toEqual(user);
  });

  it("propagates error from apiClient", async () => {
    mockApiClient.mockRejectedValue(new Error("Unauthorized"));
    await expect(login("bad@example.com", "wrong")).rejects.toThrow("Unauthorized");
  });
});

describe("signup", () => {
  it("calls apiClient with POST and all fields", async () => {
    const user = { id: "2", email: "b@b.com", name: "B", keywords: [] };
    mockApiClient.mockResolvedValue(user);

    const result = await signup("b@b.com", "pass", "B");

    expect(mockApiClient).toHaveBeenCalledWith("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "b@b.com", password: "pass", name: "B" }),
    });
    expect(result).toEqual(user);
  });

  it("propagates error from apiClient", async () => {
    mockApiClient.mockRejectedValue(new Error("Duplicate email"));
    await expect(signup("dup@x.com", "p", "N")).rejects.toThrow("Duplicate email");
  });
});
