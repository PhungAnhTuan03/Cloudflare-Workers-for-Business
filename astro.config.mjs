import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		platformProxy: {
			enabled: false
		}
	}),

	image: {
		layout: "constrained",
		responsiveStyles: true,
	},

	integrations: [
		react(),
		emdash({
			database: d1({
				binding: "DB", session: {
					binding: "SESSION"
				}
			}),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	devToolbar: { enabled: false },
});