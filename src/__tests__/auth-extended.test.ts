import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendVerificationCode } from "@/api/auth";
import * as client from "@/api/client";

vi.mock("@/api/client");

describe("auth API – sendVerificationCode (lines 28-38)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls apiClient with the correct endpoint and POST body", async () => {
    const mockResponse = { ok: true, expires_in: 300 };
    vi.mocked(client.apiClient).mockResolvedValue(mockResponse);

    const result = await sendVerificationCode("user@example.com");

    expect(client.apiClient).toHaveBeenCalledOnce();
    expect(client.apiClient).toHaveBeenCalledWith("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email: "user@example.com" }),
    });
    expect(result).toEqual(mockResponse);
  });

  it("returns the ok flag and expires_in value from apiClient", async () => {
    const mockResponse = { ok: true, expires_in: 180 };
    vi.mocked(client.apiClient).mockResolvedValue(mockResponse);

    const result = await sendVerificationCode("another@example.com");

    expect(result.ok).toBe(true);
    expect(result.expires_in).toBe(180);
  });

  it("propagates errors thrown by apiClient (e.g. network failure)", async () => {
    vi.mocked(client.apiClient).mockRejectedValue(new Error("Network error"));

    await expect(sendVerificationCode("user@example.com")).rejects.toThrow(
      "Network error",
    );
  });

  it("propagates API-level errors such as rate-limiting or invalid email", async () => {
    vi.mocked(client.apiClient).mockRejectedValue(
      new Error("이메일 전송에 실패했습니다."),
    );

    await expect(sendVerificationCode("bad-email")).rejects.toThrow(
      "이메일 전송에 실패했습니다.",
    );
  });

  it("handles an empty string email argument without throwing synchronously", async () => {
    vi.mocked(client.apiClient).mockResolvedValue({ ok: false, expires_in: 0 });

    const result = await sendVerificationCode("");

    expect(client.apiClient).toHaveBeenCalledWith("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify({ email: "" }),
    });
    expect(result.ok).toBe(false);
  });
});
