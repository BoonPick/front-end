import { describe, it, expect } from "vitest";
import { queryClient } from "@/app/queryClient";
import { QueryClient } from "@tanstack/react-query";

describe("queryClient", () => {
  it("is an instance of QueryClient", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("has staleTime of 5 minutes", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(1000 * 60 * 5);
  });

  it("has retry set to 1", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(1);
  });
});
