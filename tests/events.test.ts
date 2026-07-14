import { describe, it, expect, vi } from "vitest";
import { emit, on, NOTES_CHANGED } from "@/shared/lib/events";

describe("Event emitter", () => {
  it("calls listener when event is emitted", () => {
    const listener = vi.fn();
    on("test-event", listener);
    emit("test-event");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("supports multiple listeners for the same event", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    on("multi-event", listener1);
    on("multi-event", listener2);
    emit("multi-event");
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it("returns an unsubscribe function", () => {
    const listener = vi.fn();
    const unsub = on("unsub-event", listener);
    emit("unsub-event");
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
    emit("unsub-event");
    expect(listener).toHaveBeenCalledTimes(1); // still 1, not called again
  });

  it("does not call listeners for different events", () => {
    const listener = vi.fn();
    on("event-a", listener);
    emit("event-b");
    expect(listener).not.toHaveBeenCalled();
  });

  it("exports NOTES_CHANGED constant", () => {
    expect(NOTES_CHANGED).toBe("notes:changed");
  });
});
