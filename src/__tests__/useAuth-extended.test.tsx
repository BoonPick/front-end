import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import * as authApi from "@/api/auth";

vi.mock("@/api/auth");

describe("useAuth – sendVerificationCode (lines 72-80)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Line 72: setError(null) — error is cleared before the call
  // Line 74: successful return value is forwarded to the caller
  it("clears any prior error and returns the API result on success", async () => {
    // Arrange: pre-seed an error so we can verify line 72 clears it
    vi.mocked(authApi.login).mockRejectedValue(new Error("prior error"));
    vi.mocked(authApi.sendVerificationCode).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    // Put the hook into an errored state first
    await act(async () => {
      try {
        await result.current.login("x@y.com", "bad");
      } catch {
        // expected
      }
    });
    expect(result.current.error).toBe("prior error");

    // Act: call sendVerificationCode — should clear the error (line 72) and return (line 74)
    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.sendVerificationCode("x@y.com");
    });

    expect(authApi.sendVerificationCode).toHaveBeenCalledWith("x@y.com");
    expect(result.current.error).toBeNull(); // line 72 executed
    expect(returnValue).toBeUndefined();     // line 74 forwarded the resolved value
  });

  it("returns a truthy value forwarded from the API on success", async () => {
    const apiResult = { sent: true };
    vi.mocked(authApi.sendVerificationCode).mockResolvedValue(apiResult as any);

    const { result } = renderHook(() => useAuth());

    let returnValue: unknown;
    await act(async () => {
      returnValue = await result.current.sendVerificationCode("user@example.com");
    });

    expect(returnValue).toEqual(apiResult); // line 74: return value is forwarded
    expect(result.current.error).toBeNull();
  });

  // Lines 75-79: catch block – Error instance → use e.message (line 77)
  it("sets error from Error message and rethrows when an Error is thrown", async () => {
    const apiError = new Error("인증코드 오류");
    vi.mocked(authApi.sendVerificationCode).mockRejectedValue(apiError);

    const { result } = renderHook(() => useAuth());

    let caught: unknown;
    await act(async () => {
      try {
        await result.current.sendVerificationCode("user@example.com");
      } catch (e) {
        caught = e;
      }
    });

    // Line 77-78: message taken from Error instance
    expect(result.current.error).toBe("인증코드 오류");
    // Line 79: rethrows the original error
    expect(caught).toBe(apiError);
    expect(result.current.user).toBeNull();
  });

  // Lines 75-79: catch block – non-Error thrown value → fallback Korean string (line 77)
  it("sets the fallback Korean error string and rethrows when a non-Error is thrown", async () => {
    vi.mocked(authApi.sendVerificationCode).mockRejectedValue("string error");

    const { result } = renderHook(() => useAuth());

    let caught: unknown;
    await act(async () => {
      try {
        await result.current.sendVerificationCode("user@example.com");
      } catch (e) {
        caught = e;
      }
    });

    // Line 77 (ternary else branch): fallback message
    expect(result.current.error).toBe("인증코드 발송에 실패했습니다.");
    // Line 79: rethrows the original non-Error value
    expect(caught).toBe("string error");
  });

  // Verify error is cleared at the START of each call (line 72), even after a prior failure
  it("clears the previous sendVerificationCode error before the next attempt", async () => {
    vi.mocked(authApi.sendVerificationCode)
      .mockRejectedValueOnce(new Error("first failure"))
      .mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());

    // First call – produces an error
    await act(async () => {
      try {
        await result.current.sendVerificationCode("user@example.com");
      } catch {
        // expected
      }
    });
    expect(result.current.error).toBe("first failure");

    // Second call – line 72 must clear the error before the await
    await act(async () => {
      await result.current.sendVerificationCode("user@example.com");
    });

    expect(result.current.error).toBeNull(); // cleared by line 72 on the second invocation
  });
});
