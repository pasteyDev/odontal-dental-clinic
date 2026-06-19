globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as NodeResponse, i as defineLazyEventHandler, l as serve, n as HTTPError, r as defineHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"dd-n2GaCfhXC+dJ8gRmnAtKiNKurlM\"",
		"mtime": "2026-05-31T13:53:55.811Z",
		"size": 221,
		"path": "../public/robots.txt"
	},
	"/sitemap.xml": {
		"type": "application/xml",
		"etag": "\"13b-nQbBf4qSua8I0QVd66crHlZQ2sQ\"",
		"mtime": "2026-05-31T13:53:57.395Z",
		"size": 315,
		"path": "../public/sitemap.xml"
	},
	"/assets/about-7xbmBMcZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13be-/dIzZIkOFysKJx3rka/wFND4eoI\"",
		"mtime": "2026-06-19T01:08:45.284Z",
		"size": 5054,
		"path": "../public/assets/about-7xbmBMcZ.js"
	},
	"/assets/admin-7xFnFmcZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f00-nK7cYrlztw0jVb+t0V2eKa6+ZHc\"",
		"mtime": "2026-06-19T01:08:45.284Z",
		"size": 7936,
		"path": "../public/assets/admin-7xFnFmcZ.js"
	},
	"/assets/admin.analytics-Cdf7dgwA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ea-y+tuwxVFpbiWJsXRrBL5RFptK4A\"",
		"mtime": "2026-06-19T01:08:45.284Z",
		"size": 2282,
		"path": "../public/assets/admin.analytics-Cdf7dgwA.js"
	},
	"/assets/admin.bookings-qNmMG7D-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d63-BFVY/Gle2zsJZJJpLdmdZDnTIvc\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 3427,
		"path": "../public/assets/admin.bookings-qNmMG7D-.js"
	},
	"/assets/admin.functions-C4MwdPw4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"921-jwEUqMAuBIK3IHQG5qZnUFNrhiU\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 2337,
		"path": "../public/assets/admin.functions-C4MwdPw4.js"
	},
	"/assets/admin.login-DQ23oy1g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a00-3IT7SAoaGbIWjbOnvaMT9jRU0wk\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 2560,
		"path": "../public/assets/admin.login-DQ23oy1g.js"
	},
	"/assets/admin.index-B_bDqdBS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"129c-qTCozIEtUKSGH7BNxCycRvzUJfk\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 4764,
		"path": "../public/assets/admin.index-B_bDqdBS.js"
	},
	"/assets/admin.messages-DvNEjDZ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7b8-h+/B/kUSqPnju7H77cugmVBSytc\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 1976,
		"path": "../public/assets/admin.messages-DvNEjDZ1.js"
	},
	"/assets/admin.newsletter-DEqU-Wbb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cce-+p0c1/CZPGIIb8omgiPrIqdhWbU\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 11470,
		"path": "../public/assets/admin.newsletter-DEqU-Wbb.js"
	},
	"/assets/admin.patients-BF2BGEET.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ef-MiKry5ewmRkAhRU8m9X/D9+Q7Qc\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 2287,
		"path": "../public/assets/admin.patients-BF2BGEET.js"
	},
	"/assets/admin.services-moCbSGcU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113f-78mEunm1g6llbaorVePnxLCnoS8\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 4415,
		"path": "../public/assets/admin.services-moCbSGcU.js"
	},
	"/assets/admin.reviews-B6zYki-j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70e-TPK1RK4/w7XVopPE4J1T0nKCsG8\"",
		"mtime": "2026-06-19T01:08:45.300Z",
		"size": 1806,
		"path": "../public/assets/admin.reviews-B6zYki-j.js"
	},
	"/assets/admin.staff-BdrsH_iz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ef3-ThI2mDIWWZDn4HbgG4ejoFgv7vQ\"",
		"mtime": "2026-06-19T01:08:45.315Z",
		"size": 3827,
		"path": "../public/assets/admin.staff-BdrsH_iz.js"
	},
	"/assets/auth-middleware-D9tLq7QL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-hTVNnxESvSVt6dmNd3BFUa9X3zo\"",
		"mtime": "2026-06-19T01:08:45.331Z",
		"size": 77,
		"path": "../public/assets/auth-middleware-D9tLq7QL.js"
	},
	"/assets/badge-c-ZlRXtL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"348-YPbTOqu9m4pnApHTqoWdepktHEU\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 840,
		"path": "../public/assets/badge-c-ZlRXtL.js"
	},
	"/assets/book-DPDId7uD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12ac-NKO9EKknx0+dbWpuPnO8S3f5Cvs\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 4780,
		"path": "../public/assets/book-DPDId7uD.js"
	},
	"/assets/button-D0IF1GaE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e96-Bmg/hDdE2IssU4J+O2bFBE6/18s\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 36502,
		"path": "../public/assets/button-D0IF1GaE.js"
	},
	"/assets/card-u2lDXsCR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"428-HlqO7ImrwaFr4+0Sxk1WBKy5qI8\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 1064,
		"path": "../public/assets/card-u2lDXsCR.js"
	},
	"/assets/contact-BUdaSSu6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da1-DEmcdg8ojLl4b+HqT3mJDXmKAAY\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 3489,
		"path": "../public/assets/contact-BUdaSSu6.js"
	},
	"/assets/createServerFn-Amj197RG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127d-jHjHFnA46s3x/qZPL6wCycT1ZjM\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 4733,
		"path": "../public/assets/createServerFn-Amj197RG.js"
	},
	"/assets/dialog-Q1yTEHFq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18c7-IyRhhDMgO5TW0niTWjRpiVEjv8w\"",
		"mtime": "2026-06-19T01:08:45.346Z",
		"size": 6343,
		"path": "../public/assets/dialog-Q1yTEHFq.js"
	},
	"/assets/dist-8KLrDTX5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2da-gqxObIQXiWehO45ldcqVosC0z2c\"",
		"mtime": "2026-06-19T01:08:45.362Z",
		"size": 730,
		"path": "../public/assets/dist-8KLrDTX5.js"
	},
	"/assets/dist-C1RJhgYD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"281-K2XQEy4dSuaU+NZeVCiNF1cCMKU\"",
		"mtime": "2026-06-19T01:08:45.394Z",
		"size": 641,
		"path": "../public/assets/dist-C1RJhgYD.js"
	},
	"/assets/dist-d42GdzKu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"488-AhbkvB8W24abkBfzSpaZnxDHFX8\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 1160,
		"path": "../public/assets/dist-d42GdzKu.js"
	},
	"/assets/dist-mbSi2_Cu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ab-1dokH9ZPYzaH2WrYOlBtzI6pwhw\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 1451,
		"path": "../public/assets/dist-mbSi2_Cu.js"
	},
	"/assets/email.functions-Eda6d2CM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45e-vzm4DtzlnQdle4o7gN+VmuQuLwY\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 1118,
		"path": "../public/assets/email.functions-Eda6d2CM.js"
	},
	"/assets/es2015-rT7Mvhh0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6791-htvNo/abe/V1xmfva2/rM21tzgk\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 26513,
		"path": "../public/assets/es2015-rT7Mvhh0.js"
	},
	"/assets/EmailDialog-BGhXIOUA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ce-RtP/TAzlC48ttSk98lFyjHJiIyU\"",
		"mtime": "2026-06-19T01:08:45.079Z",
		"size": 2254,
		"path": "../public/assets/EmailDialog-BGhXIOUA.js"
	},
	"/assets/faq-DIQo_tKQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20b6-3fhk6WYC+ZuJw1qfBQ1hkjxm4c4\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 8374,
		"path": "../public/assets/faq-DIQo_tKQ.js"
	},
	"/assets/label-Dt0YF1sq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ab-esp9BkTZFwIOAaiPUlfSHgjOVc8\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 683,
		"path": "../public/assets/label-Dt0YF1sq.js"
	},
	"/assets/es6-C4QtuxdJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d8e8-66U9TRptImJ2KaNkPsEzCtAACd4\"",
		"mtime": "2026-06-19T01:08:45.409Z",
		"size": 514280,
		"path": "../public/assets/es6-C4QtuxdJ.js"
	},
	"/assets/LazyRecharts-DMKf0rkm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-J+Gg846oRF7rSGg834V2lnCHDuk\"",
		"mtime": "2026-06-19T01:08:45.284Z",
		"size": 807,
		"path": "../public/assets/LazyRecharts-DMKf0rkm.js"
	},
	"/assets/link-D6R9wzIG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54b5-hjyOHL4gQba44R9ZBVLN2Ohe0VA\"",
		"mtime": "2026-06-19T01:08:45.494Z",
		"size": 21685,
		"path": "../public/assets/link-D6R9wzIG.js"
	},
	"/assets/mail-Dr_l07tu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cb-P+Qu84uB5ED+3lPoyItCxcROdJM\"",
		"mtime": "2026-06-19T01:08:45.541Z",
		"size": 203,
		"path": "../public/assets/mail-Dr_l07tu.js"
	},
	"/assets/odontal-logo-2-BD4M7nTm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b-okQa3LcXQmTyzOdrNidGg/2LZek\"",
		"mtime": "2026-06-19T01:08:45.558Z",
		"size": 59,
		"path": "../public/assets/odontal-logo-2-BD4M7nTm.js"
	},
	"/assets/privacy-D-0PIHvi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23bd-LK8qo4aHjFVPhCuhHq45Fwf3hwI\"",
		"mtime": "2026-06-19T01:08:45.559Z",
		"size": 9149,
		"path": "../public/assets/privacy-D-0PIHvi.js"
	},
	"/assets/react-dom-0ZK-Lw7i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dcf-BEXzOhoWGrQd60B8Pm6TGmZy+Bg\"",
		"mtime": "2026-06-19T01:08:45.560Z",
		"size": 3535,
		"path": "../public/assets/react-dom-0ZK-Lw7i.js"
	},
	"/assets/react-B8IZ02wI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fe3-F1OtqcvIddSaDxcd6VGmPyy0Ww0\"",
		"mtime": "2026-06-19T01:08:45.560Z",
		"size": 8163,
		"path": "../public/assets/react-B8IZ02wI.js"
	},
	"/assets/reviews-DoOoXLFC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d83-69SPPU1RltmO+/sl4m4vinsqvH0\"",
		"mtime": "2026-06-19T01:08:45.561Z",
		"size": 3459,
		"path": "../public/assets/reviews-DoOoXLFC.js"
	},
	"/assets/routes-D-MLF_56.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21a4-QxLl0yuPmbIUK0kqowYHgyCe+xc\"",
		"mtime": "2026-06-19T01:08:45.561Z",
		"size": 8612,
		"path": "../public/assets/routes-D-MLF_56.js"
	},
	"/assets/send-DsdNh_IG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118-eCnVSshyQ4BXpGWg9g/MHDq4gdQ\"",
		"mtime": "2026-06-19T01:08:45.563Z",
		"size": 280,
		"path": "../public/assets/send-DsdNh_IG.js"
	},
	"/assets/services-CuEfRGQi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"783-z611GJ2uGS4PkCNedV1MHbik1Xk\"",
		"mtime": "2026-06-19T01:08:45.624Z",
		"size": 1923,
		"path": "../public/assets/services-CuEfRGQi.js"
	},
	"/assets/select-DPEbWw71.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bd41-ZDgJwTZ7Y7IeL/eYDMTKAuO9+vY\"",
		"mtime": "2026-06-19T01:08:45.562Z",
		"size": 48449,
		"path": "../public/assets/select-DPEbWw71.js"
	},
	"/assets/shield-check-BjxP2IBD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-ZnJE0MWSJkLQ0s/vrngDgqVFZc0\"",
		"mtime": "2026-06-19T01:08:45.624Z",
		"size": 310,
		"path": "../public/assets/shield-check-BjxP2IBD.js"
	},
	"/assets/index-D7X7Nb_u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8dd02-fh53HvIp+Xon6mvW0ZbV0CRfXLI\"",
		"mtime": "2026-06-19T01:08:45.070Z",
		"size": 580866,
		"path": "../public/assets/index-D7X7Nb_u.js"
	},
	"/assets/odontal-logo-2-DqHTb2J4.png": {
		"type": "image/png",
		"etag": "\"16254f-A0hkA1bz7Z14xzbtZ2Um7l+OB64\"",
		"mtime": "2026-06-19T01:08:50.825Z",
		"size": 1451343,
		"path": "../public/assets/odontal-logo-2-DqHTb2J4.png"
	},
	"/assets/SiteLayout-BEAahvke.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f51-AXjTcJh/i8PbVwVuob1VJDqPz5I\"",
		"mtime": "2026-06-19T01:08:45.284Z",
		"size": 12113,
		"path": "../public/assets/SiteLayout-BEAahvke.js"
	},
	"/assets/sparkles-YHseXiR2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e4-ySYyzYuJAyqqUgdz2ac5+N22j34\"",
		"mtime": "2026-06-19T01:08:45.624Z",
		"size": 484,
		"path": "../public/assets/sparkles-YHseXiR2.js"
	},
	"/assets/styles-BzGDb-qN.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14413-k1CEz2UuGVGWeUHPEbA4f5PGcts\"",
		"mtime": "2026-06-19T01:08:50.825Z",
		"size": 82963,
		"path": "../public/assets/styles-BzGDb-qN.css"
	},
	"/assets/switch-BI0S4cx5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e61-Zykl/uXKYmjyF7aFw4lHBHbmy6g\"",
		"mtime": "2026-06-19T01:08:45.624Z",
		"size": 3681,
		"path": "../public/assets/switch-BI0S4cx5.js"
	},
	"/assets/terms-Dtjr4Glb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8a-a3quwNwfamZtXjB4H0Za5C1W4Js\"",
		"mtime": "2026-06-19T01:08:45.624Z",
		"size": 7562,
		"path": "../public/assets/terms-Dtjr4Glb.js"
	},
	"/assets/textarea-B2V_Kemc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"221-Qkf+S9t8I75Lq639LbC/sF/nWrQ\"",
		"mtime": "2026-06-19T01:08:45.639Z",
		"size": 545,
		"path": "../public/assets/textarea-B2V_Kemc.js"
	},
	"/assets/tools-DZPqVAF8.jpg": {
		"type": "image/jpeg",
		"etag": "\"d62c-wd7aeKECf+nLJDzwuOHefj7eTbU\"",
		"mtime": "2026-06-19T01:08:50.825Z",
		"size": 54828,
		"path": "../public/assets/tools-DZPqVAF8.jpg"
	},
	"/assets/unsubscribe-B_ZDDAbb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e5-XT30NkXDKjI8FNQvbU9yMPxB37I\"",
		"mtime": "2026-06-19T01:08:45.639Z",
		"size": 1253,
		"path": "../public/assets/unsubscribe-B_ZDDAbb.js"
	},
	"/assets/useMatch-BtAa9ko3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29c-7Dpfy0t2x5aBgVoL81AT9yI8gWQ\"",
		"mtime": "2026-06-19T01:08:45.639Z",
		"size": 668,
		"path": "../public/assets/useMatch-BtAa9ko3.js"
	},
	"/assets/useQuery-Butb7MTQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2263-wtty4MO+4L+lSDx7dm3yctlJlaI\"",
		"mtime": "2026-06-19T01:08:45.639Z",
		"size": 8803,
		"path": "../public/assets/useQuery-Butb7MTQ.js"
	},
	"/assets/useRouter-DhXG1QV5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e5-QvIksetjPk2w6/LwBd8a4E26I0c\"",
		"mtime": "2026-06-19T01:08:45.686Z",
		"size": 1509,
		"path": "../public/assets/useRouter-DhXG1QV5.js"
	},
	"/assets/users-BrppXZff.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"128-BtSeIY2/aoMn/VdpI3hYwYS+kNA\"",
		"mtime": "2026-06-19T01:08:45.686Z",
		"size": 296,
		"path": "../public/assets/users-BrppXZff.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-06-19T01:08:45.686Z",
		"size": 27261,
		"path": "../public/assets/utils-B6KiDbIe.js"
	},
	"/assets/with-selector-BGWzSD5R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"64f-9OqYAUOIifBimYLu1Kbue03Wj7Q\"",
		"mtime": "2026-06-19T01:08:45.686Z",
		"size": 1615,
		"path": "../public/assets/with-selector-BGWzSD5R.js"
	},
	"/assets/Odontal-about-6mJ5F6Lv.mp4": {
		"type": "video/mp4",
		"etag": "\"1aa2d53-ZaYb8fZxQJVbfHKJ31YPHcN3M0U\"",
		"mtime": "2026-06-19T01:08:46.594Z",
		"size": 27929939,
		"path": "../public/assets/Odontal-about-6mJ5F6Lv.mp4"
	},
	"/assets/odontal-introduct-CE6x-ZHx.mp4": {
		"type": "video/mp4",
		"etag": "\"511ccff-beE6l8gOV/YusMcWJ5ldrifSl00\"",
		"mtime": "2026-06-19T01:08:50.825Z",
		"size": 85052671,
		"path": "../public/assets/odontal-introduct-CE6x-ZHx.mp4"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_IQir5x = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_IQir5x
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
