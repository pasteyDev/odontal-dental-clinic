import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as object, o as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-B4M7mpo4.js
var $$splitComponentImporter = () => import("./book-W9YazwA9.mjs");
var searchSchema = object({ service: string().optional() });
var Route = createFileRoute("/book")({
	validateSearch: searchSchema,
	head: () => ({ meta: [{ title: "Book an Appointment — Odontal Dental Clinic" }, {
		name: "description",
		content: "Request an appointment with Odontal Dental Clinic in Aguda, Lagos. Simple online booking — we confirm by phone."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
