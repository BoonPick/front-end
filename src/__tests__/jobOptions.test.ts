import { describe, it, expect } from "vitest";
import { DUTY_OPTIONS, WORK_TYPE_OPTIONS } from "@/lib/jobOptions";

describe("DUTY_OPTIONS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(DUTY_OPTIONS)).toBe(true);
    expect(DUTY_OPTIONS.length).toBeGreaterThan(0);
  });

  it("contains expected duty categories", () => {
    expect(DUTY_OPTIONS).toContain("개발(IT)");
    expect(DUTY_OPTIONS).toContain("마케팅");
    expect(DUTY_OPTIONS).toContain("SW엔지니어");
    expect(DUTY_OPTIONS).toContain("데이터/머신러닝");
  });

  it("contains no duplicate entries", () => {
    const unique = new Set(DUTY_OPTIONS);
    expect(unique.size).toBe(DUTY_OPTIONS.length);
  });

  it("all entries are non-empty strings", () => {
    DUTY_OPTIONS.forEach((opt) => {
      expect(typeof opt).toBe("string");
      expect(opt.length).toBeGreaterThan(0);
    });
  });
});

describe("WORK_TYPE_OPTIONS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(WORK_TYPE_OPTIONS)).toBe(true);
    expect(WORK_TYPE_OPTIONS.length).toBeGreaterThan(0);
  });

  it("contains common work types", () => {
    expect(WORK_TYPE_OPTIONS).toContain("정규직");
    expect(WORK_TYPE_OPTIONS).toContain("계약직");
    expect(WORK_TYPE_OPTIONS).toContain("인턴직");
  });

  it("contains no duplicate entries", () => {
    const unique = new Set(WORK_TYPE_OPTIONS);
    expect(unique.size).toBe(WORK_TYPE_OPTIONS.length);
  });

  it("all entries are non-empty strings", () => {
    WORK_TYPE_OPTIONS.forEach((opt) => {
      expect(typeof opt).toBe("string");
      expect(opt.length).toBeGreaterThan(0);
    });
  });
});
