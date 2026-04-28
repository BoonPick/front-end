import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, signup } from "@/api/auth";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("calls apiClient with POST and credentials", async () => {
      const mockUser = { id: "1", email: "a@b.com", name: "Alice", keywords: [] };
      vi.mocked(client.apiClient).mockResolvedValue(mockUser);

      const result = await login("a@b.com", "pass123");

      expect(client.apiClient).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.com", password: "pass123" }),
      });
      expect(result).toEqual(mockUser);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("이미 가입된 이메일입니다."));
      await expect(login("a@b.com", "pass")).rejects.toThrow("이미 가입된 이메일입니다.");
    });
  });

  describe("signup", () => {
    it("calls apiClient with POST and signup data including verification_code", async () => {
      const mockUser = { id: "2", email: "b@c.com", name: "Bob", keywords: [] };
      vi.mocked(client.apiClient).mockResolvedValue(mockUser);

      const result = await signup("b@c.com", "pass456", "Bob", "123456");

      expect(client.apiClient).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "b@c.com",
          password: "pass456",
          name: "Bob",
          verification_code: "123456",
        }),
      });
      expect(result).toEqual(mockUser);
    });

    it("propagates errors from apiClient", async () => {
      vi.mocked(client.apiClient).mockRejectedValue(new Error("Signup failed"));
      await expect(signup("b@c.com", "pass", "Bob", "000000")).rejects.toThrow(
        "Signup failed",
      );
    });
  });
});
