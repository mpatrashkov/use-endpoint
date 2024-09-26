import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "UseEndpoint",
			fileName: "use-endpoint",
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"graphql",
				"@tanstack/react-query",
			],
		},
	},
});
