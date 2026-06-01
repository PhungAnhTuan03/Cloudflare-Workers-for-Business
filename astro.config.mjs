import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";

const isDevCommand = process.argv.includes("dev");

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		sessionKVBindingName: "SESSION",
		imageService: "cloudflare-binding",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		build: {
			chunkSizeWarningLimit: 8000,
			rollupOptions: {
				onwarn(warning, defaultHandler) {
					if (
						warning.message.includes("createRequire") &&
						warning.message.includes("emdash/dist/runner")
					) {
						return;
					}

					defaultHandler(warning);
				},
			},
		},
		...(isDevCommand
			? {
					optimizeDeps: {
						ignoreOutdatedRequests: true,
					},
				}
			: {}),
	},
	devToolbar: { enabled: false },
});
