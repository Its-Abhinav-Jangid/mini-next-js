import path from "path";
import { build } from "esbuild";
import { glob } from "glob";

const entryPoints = await glob("frontend/pages/**/*.jsx");

const OUT_DIR = ".previous";
const PAGES_DIR = path.join(OUT_DIR, "pages");

await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outfile: "./.previous/static/scripts/react-runtime-server.js",
  format: "esm",
  platform: "node",
  target: "esnext",
  bundle: false,
  minify: true,
});

await build({
  entryPoints,
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
    path.resolve("./.previous/static/scripts/react-runtime-client.js"),
    path.resolve("./.previous/static/scripts/react-runtime-server.js"),
  ],
  alias: {
    react: path.resolve("./.previous/static/scripts/react-runtime-server.js"),
    "react-dom": path.resolve(
      "./.previous/static/scripts/react-runtime-server.js"
    ),
    "react-dom/client": path.resolve(
      "./.previous/static/scripts/react-runtime-server.js"
    ),
    "react-dom/server": path.resolve(
      "./.previous/static/scripts/react-runtime-server.js"
    ),
  },
});
