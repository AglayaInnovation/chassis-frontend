import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce } from "../src/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    // Update value
    rerender({ value: "updated", delay: 500 });

    // Should still show old value
    expect(result.current).toBe("initial");

    // Fast-forward time
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });

  it("should handle multiple rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });
    jest.advanceTimersByTime(200);

    rerender({ value: "third" });
    jest.advanceTimersByTime(200);

    rerender({ value: "fourth" });

    // Only the last value should be applied after the full delay
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe("fourth");
    });
  });

  it("should work with different delay values", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "test", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    jest.advanceTimersByTime(500);
    expect(result.current).toBe("test");

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });
});
