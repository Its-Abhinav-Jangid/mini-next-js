import path from "path";
import { build } from "esbuild";

const OUT_DIR = ".previous";
const PAGES_DIR = path.join(OUT_DIR, "pages");

await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outfile: "frontend/react-runtime-server.js",
  format: "esm",
  platform: "node",
  target: "esnext",
  bundle: false,
});

await build({
  entryPoints: ["frontend/pages/*.jsx"],
  outdir: PAGES_DIR,
  format: "esm",
  platform: "node",
  target: "esnext",
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  splitting: false, // Per-file bundles
  external: [
    "react",
    "react-dom",
    "react-dom/client",
    "./frontend/react-runtime.js",
  ],
  alias: {
    "@/frontend/react-runtime.js": path.resolve(
      "./frontend/react-runtime-server.js"
    ),
  },
});
