import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LazyRecharts-Dsp7NnJg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LazyRecharts({ children, fallback = null }) {
	const [R, setR] = import_react.useState(null);
	import_react.useEffect(() => {
		let mounted = true;
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then((mod) => {
			if (mounted) setR(mod);
		}).catch(() => {});
		return () => {
			mounted = false;
		};
	}, []);
	if (!R) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center p-4 text-sm text-muted-foreground",
		children: "Loading chart…"
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children(R) });
}
//#endregion
export { LazyRecharts as t };
