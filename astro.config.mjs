import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";

const workerOptimizerExcludes = ["emdash/media/local-runtime"];
const workerOptimizerIncludes = ["resend"];

function syncWorkerOptimizeDeps() {
	return {
		name: "sync-worker-optimize-deps",
		configResolved(config) {
			if (config.command !== "serve") {
				return;
			}

			const ssrOptimizeDeps = config.ssr.optimizeDeps ?? {};

			for (const [name, environment] of Object.entries(config.environments ?? {})) {
				if (name === "client") {
					continue;
				}

				environment.optimizeDeps.include = Array.from(
					new Set([
						...(environment.optimizeDeps.include ?? []),
						...(ssrOptimizeDeps.include ?? []),
						...workerOptimizerIncludes,
					]),
				);
				environment.optimizeDeps.exclude = Array.from(
					new Set([
						...(environment.optimizeDeps.exclude ?? []),
						...(ssrOptimizeDeps.exclude ?? []),
						...workerOptimizerExcludes,
					]),
				);
				environment.optimizeDeps.ignoreOutdatedRequests = true;
			}
		},
	};
}

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		sessionKVBindingName: "SESSION",
		imageService: "cloudflare-binding",
		inspectorPort: false,
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
		plugins: [tailwindcss(), syncWorkerOptimizeDeps()],
		server: {
			hmr: false,
			watch: {
				ignored: [
					"**/.wrangler/**",
					"**/.astro/**",
					"**/dist/**",
					"**/node_modules/**",
				],
			},
		},
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
	},
	devToolbar: { enabled: false },
});
