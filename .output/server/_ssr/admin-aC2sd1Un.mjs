import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as odontal_logo_2_default } from "./odontal-logo-2-F10kLYhx.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { D as CalendarCheck, E as ChartColumn, _ as LogOut, d as MessageSquare, h as Mail, n as Users, p as Megaphone, r as UserCog, s as Settings, v as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, o as DialogTitle, r as DialogContent, t as Dialog } from "./dialog-DXonTloK.mjs";
import { r as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as supabase } from "./client-BXuQfohU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-aC2sd1Un.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "odontal_admin_last_activity";
function ReauthGuard({ timeoutMinutes = 30 }) {
	const timeoutMs = timeoutMinutes * 60 * 1e3;
	const [locked, setLocked] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)(null);
	const [password, setPassword] = (0, import_react.useState)("");
	const timerRef = (0, import_react.useRef)(null);
	const readLast = (0, import_react.useCallback)(() => {
		try {
			const v = sessionStorage.getItem(STORAGE_KEY);
			return v ? parseInt(v, 10) : null;
		} catch {
			return null;
		}
	}, []);
	const writeLast = (0, import_react.useCallback)((ts = Date.now()) => {
		try {
			sessionStorage.setItem(STORAGE_KEY, String(ts));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
		if (!readLast()) writeLast();
		const onActivity = () => {
			writeLast();
			if (locked) {}
		};
		const events = [
			"mousemove",
			"keydown",
			"mousedown",
			"touchstart",
			"scroll"
		];
		for (const e of events) window.addEventListener(e, onActivity, { passive: true });
		const schedule = () => {
			const last = readLast() ?? Date.now();
			const elapsed = Date.now() - last;
			if (elapsed >= timeoutMs) {
				setLocked(true);
				setOpen(true);
				return;
			}
			const remaining = timeoutMs - elapsed;
			if (timerRef.current) window.clearTimeout(timerRef.current);
			timerRef.current = window.setTimeout(() => {
				setLocked(true);
				setOpen(true);
			}, remaining);
		};
		schedule();
		const visibilityHandler = () => schedule();
		document.addEventListener("visibilitychange", visibilityHandler);
		return () => {
			for (const e of events) window.removeEventListener(e, onActivity);
			if (timerRef.current) window.clearTimeout(timerRef.current);
			document.removeEventListener("visibilitychange", visibilityHandler);
		};
	}, [
		locked,
		readLast,
		writeLast,
		timeoutMs
	]);
	(0, import_react.useEffect)(() => {
		if (!locked) {
			writeLast();
			setOpen(false);
			if (timerRef.current) window.clearTimeout(timerRef.current);
			timerRef.current = window.setTimeout(() => {
				setLocked(true);
				setOpen(true);
			}, timeoutMs);
		}
	}, [locked]);
	async function handleSubmit(e) {
		e?.preventDefault();
		if (!email) {
			toast.error("Unable to reauthenticate: no email available");
			return;
		}
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			writeLast();
			setPassword("");
			setLocked(false);
			setOpen(false);
			toast.success("Reauthenticated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Reauthentication failed");
		}
	}
	if (!locked) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!locked) setOpen(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			overlayClassName: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			hideClose: true,
			onEscapeKeyDown: (e) => e.preventDefault(),
			onPointerDownOutside: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Session locked — Try reauthenticating" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-2 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: email ?? "",
						readOnly: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true,
						minLength: 8
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: async () => {
							await supabase.auth.signOut();
							window.location.href = "/admin/login";
						},
						children: "Sign out"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "rounded-full",
						children: "Unlock"
					})] })
				]
			})]
		})
	});
}
var NAV = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/bookings",
		label: "Bookings",
		icon: CalendarCheck
	},
	{
		to: "/admin/patients",
		label: "Patients",
		icon: Users
	},
	{
		to: "/admin/messages",
		label: "Messages",
		icon: Mail
	},
	{
		to: "/admin/newsletter",
		label: "Newsletter",
		icon: Megaphone
	},
	{
		to: "/admin/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/admin/services",
		label: "Services",
		icon: Settings
	},
	{
		to: "/admin/staff",
		label: "Staff",
		icon: UserCog
	},
	{
		to: "/admin/reviews",
		label: "Reviews",
		icon: MessageSquare
	}
];
function AdminLayout() {
	const navigate = useNavigate();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (path === "/admin/login") {
			setReady(true);
			return;
		}
		supabase.auth.getUser().then(({ data, error }) => {
			if (error || !data.user) navigate({ to: "/admin/login" });
			else setReady(true);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			if (!session && path !== "/admin/login") navigate({ to: "/admin/login" });
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate, path]);
	if (path === "/admin/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-[color:var(--cream)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				richColors: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReauthGuard, { timeoutMinutes: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden w-64 shrink-0 border-r border-border bg-background p-4 md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 px-2 py-2 font-serif text-xl font-semibold text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex h-15 w-15 items-center justify-center rounded-full bg-background text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: odontal_logo_2_default,
								alt: "Odontal Dental Clinic Logo"
							})
						}), "Admin"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-6 grid gap-1",
						children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							activeOptions: { exact: n.exact ?? false },
							className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-accent",
							activeProps: { className: "bg-accent text-foreground font-medium" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" }),
								" ",
								n.label
							]
						}, n.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							await supabase.auth.signOut();
							navigate({ to: "/admin/login" });
						},
						className: "mt-6 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Sign out"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl p-6 md:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
