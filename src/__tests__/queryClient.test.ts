import { describe, it, expect } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";

describe("queryClient", () => {
  it("is an instance of QueryClient", () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it("has staleTime of 5 minutes for queries", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.staleTime).toBe(1000 * 60 * 5);
  });

  it("has retry set to 1 for queries", () => {
    const defaults = queryClient.getDefaultOptions();
    expect(defaults.queries?.retry).toBe(1);
  });
});
