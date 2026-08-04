import { useCallback, useState } from "react";
import { FEEDBACK_TIMEOUT_MS } from "@/constants";

/**
 * A state value that briefly switches to `next` and automatically resets back
 * to `initial` after a timeout (used for transient feedback like "Saved").
 *
 * Rapid consecutive sets each schedule their own reset, and a reset only
 * clears the state when it still matches the value that triggered it.
 */
const useTimedReset = <T>(initial: T, timeoutMs = FEEDBACK_TIMEOUT_MS) => {
  const [value, setValue] = useState<T>(initial);

  const setWithReset = useCallback(
    (next: T) => {
      setValue(next);
      window.setTimeout(() => {
        setValue((current) => (current === next ? initial : current));
      }, timeoutMs);
    },
    [initial, timeoutMs],
  );

  return [value, setWithReset] as const;
};

export default useTimedReset;
