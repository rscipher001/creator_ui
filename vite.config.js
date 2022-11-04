import { defineConfig, loadEnv } from "vite";
import { createVuePlugin as vue } from "vite-plugin-vue2";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig(({ _, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: env.PORT,
    },
    preview: {
      port: env.PORT,
    },
    plugins: [vue()],
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
