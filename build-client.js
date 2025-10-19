import path from "path";
import { build } from "esbuild";
await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outdir: "frontend/",
  format: "esm",
  platform: "browser",
  target: "esnext",
  bundle: true,
  splitting: true,
  minify: true,
  alias: {
    "@": path.resolve("."),
  },
});

await build({
  entryPoints: ["frontend/static/scripts/client.js"],
  outdir: ".previous/static/scripts",
  format: "esm",
  platform: "browser",
  target: "esnext",
  bundle: true,
  splitting: true,
  minify: true,
  alias: {
    "@": path.resolve("."),
  },
  external: ["react", "react-dom", "./frontend/react-runtime.js"],
});
