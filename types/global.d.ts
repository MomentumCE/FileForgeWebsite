export {};

// Minimal view of the Outseta embed JS API we rely on (loaded site-wide by
// components/OutsetaScripts.tsx). Declared once here so every component shares
// an identical Window.Outseta type — declaration-merged Window augmentations
// must match exactly, so this is the single source of truth.
declare global {
  type OutsetaApi = {
    auth: { open: (options: Record<string, unknown>) => void };
    getAccessToken?: () => string | null;
    getUser?: () => Promise<{ Account?: { AccountStage?: number } }>;
    on?: (event: string, cb: () => void) => void;
    off?: (event: string, cb: () => void) => void;
  };

  interface Window {
    Outseta?: OutsetaApi;
  }
}
