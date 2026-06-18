import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

// Security headers middleware: set strong headers on every response
const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const res = await next();

  // If the handler already returned a Response, clone and add headers.
  if (res instanceof Response) {
    const headers = new Headers(res.headers);

    // Basic protections
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), interest-cohort=()");
    headers.set("X-XSS-Protection", "0");

    // Content Security Policy (pragmatic default; adjust as needed for external services)
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: wss:",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    headers.set('Content-Security-Policy', csp);

    // HSTS in production only
    if (process.env.NODE_ENV === 'production') {
      headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }

    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }

  return res;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeadersMiddleware, csrfMiddleware, errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
