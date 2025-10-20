import path from "path";
import { build } from "esbuild";
await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outfile: ".previous/static/scripts/react-runtime-client.js",
  format: "esm",
  platform: "browser",
  target: "esnext",
  bundle: true,
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
    react: path.resolve(".previous/static/scripts/react-runtime-client.js"),
    "react-dom": path.resolve(
      ".previous/static/scripts/react-runtime-client.js"
    ),
    "react-dom/client": path.resolve(
      ".previous/static/scripts/react-runtime-client.js"
    ),
  },
  external: [
    "react",
    "react-dom",
    "./.previous/static/scripts/react-runtime-client.js",
  ],
});
