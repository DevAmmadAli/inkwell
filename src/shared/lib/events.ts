// Simple event emitter for cross-component communication
type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

export function emit(event: string) {
  listeners.get(event)?.forEach((fn) => fn());
}

export function on(event: string, fn: Listener) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event)!.add(fn);
  return () => {
    listeners.get(event)?.delete(fn);
  };
}

export const NOTES_CHANGED = "notes:changed";
