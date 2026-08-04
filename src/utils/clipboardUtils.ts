/**
 * Copy text to the system clipboard.
 * Resolves true on success, false when the clipboard is unavailable.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
