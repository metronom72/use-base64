import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "use-base64",
      fileName: (format) => (format === "es" ? "index.mjs" : "index.cjs"),
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["react"],
      output: {
        exports: "named"
      }
    },
    sourcemap: true,
    target: "es2020",
    emptyOutDir: true,
    // Ensure we're only building the library, not copying assets
    copyPublicDir: false
  },
  plugins: [
    dts({
      insertTypesEntry: false,
      copyDtsFiles: false,
      include: ["src"],
      exclude: ["test", "vite.config.ts"]
    })
  ]
})