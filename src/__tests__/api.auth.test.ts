import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, signup } from "@/api/auth";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("auth API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("login", () => {
    it("calls apiClient with POST and correct body", async () => {
      const mockUser = { id: "1", email: "a@b.com", name: "A", keywords: [] };
      vi.mocked(client.apiClient).mockResolvedValue(mockUser);

      const result = await login("a@b.com", "pass");

      expect(client.apiClient).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "pass" }),
      });
      expect(result).toEqual(mockUser);
    });

    it("propagates error from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Unauthorized"));
      await expect(login("a@b.com", "wrong")).rejects.toThrow("Unauthorized");
    });
  });

  describe("signup", () => {
    it("calls apiClient with POST and correct body", async () => {
      const mockUser = { id: "2", email: "b@b.com", name: "B", keywords: [] };
      vi.mocked(client.apiClient).mockResolvedValue(mockUser);

      const result = await signup("b@b.com", "pass", "B");

      expect(client.apiClient).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: "b@b.com", password: "pass", name: "B" }),
      });
      expect(result).toEqual(mockUser);
    });

    it("propagates error from apiClient on duplicate email", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("이미 사용 중인 이메일"));
      await expect(signup("dup@b.com", "pass", "D")).rejects.toThrow("이미 사용 중인 이메일");
    });
  });
});
