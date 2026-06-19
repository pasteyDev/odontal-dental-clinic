import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as object, o as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unsubscribe-Lvhz3viG.js
var $$splitComponentImporter = () => import("./unsubscribe-DxD3j_b_.mjs");
var searchSchema = object({ token: string().optional() });
var Route = createFileRoute("/unsubscribe")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
