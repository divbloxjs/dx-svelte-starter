import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [svelte({ useVitePreprocess: true, typescript: true })],
    resolve: {
        alias: {
            $src: path.resolve("./src"),
            $base_components: path.resolve("./src/base_components"),
            $assets: path.resolve("./src/assets"),
            $lib: path.resolve("./src/lib"),
            $navigation: path.resolve("./src/lib/navigation"),
            $utilities: path.resolve("./src/lib/js/utilities"),
            $stores: path.resolve("./src/lib/js/stores"),
        },
    },
});
