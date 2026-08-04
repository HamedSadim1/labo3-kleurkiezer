/** Resolve a plain value or a lazy initializer (used for useState-style defaults). */
export const resolveInitial = <T>(initialValue: T | (() => T)): T =>
  typeof initialValue === "function"
    ? (initialValue as () => T)()
    : initialValue;

/**
 * Stable serializer for values stored as raw strings (no JSON wrapping).
 * Use it when the stored value is a plain string, e.g. `serialize: serializeRaw`.
 */
export const serializeRaw = (value: string): string => value;
