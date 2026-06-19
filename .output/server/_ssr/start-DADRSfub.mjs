import { t as supabase } from "./client-BXuQfohU.mjs";
import { n as createMiddleware, r as createStart, t as createCsrfMiddleware } from "./createStart-DwZhSttb.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-DADRSfub.js
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
	const res = await next();
	if (res instanceof Response) {
		const headers = new Headers(res.headers);
		headers.set("X-Content-Type-Options", "nosniff");
		headers.set("X-Frame-Options", "DENY");
		headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
		headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), interest-cohort=()");
		headers.set("X-XSS-Protection", "0");
		const csp = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https:",
			"style-src 'self' 'unsafe-inline' https:",
			"img-src 'self' data: blob: https:",
			"connect-src 'self' https: wss:",
			"font-src 'self' data:",
			"object-src 'none'",
			"base-uri 'self'",
			"frame-ancestors 'none'"
		].join("; ");
		headers.set("Content-Security-Policy", csp);
		headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
		return new Response(res.body, {
			status: res.status,
			statusText: res.statusText,
			headers
		});
	}
	return res;
});
var startInstance = createStart(() => ({
	requestMiddleware: [
		securityHeadersMiddleware,
		csrfMiddleware,
		errorMiddleware
	],
	functionMiddleware: [attachSupabaseAuth]
}));
//#endregion
export { startInstance };
