type OdontalErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type OdontalEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: OdontalErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __OdontalEvents?: OdontalEvents;
  }
}

export function reportOdontalError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__OdontalEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
