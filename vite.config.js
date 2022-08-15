import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [svelte({ useVitePreprocess: true })],
    resolve: {
        alias: {
            $src: path.resolve("./src"),
        },
    },
});
