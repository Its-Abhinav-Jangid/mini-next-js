import path from "path";
import { build } from "esbuild";
import { glob } from "glob";
import { readFile, writeFile } from "fs/promises";

const entryPoints = await glob("frontend/pages/**/*.jsx");

const OUT_DIR = ".previous";
const PAGES_DIR = path.join(OUT_DIR, "pages");
const RUNTIME_SERVER_FILE = path.resolve(
  "./.previous/static/scripts/react-runtime-server.js"
);

function toModuleSpecifier(fromDir, targetFile) {
  const relativePath = path.relative(fromDir, targetFile).replace(/\\/g, "/");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

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
    RUNTIME_SERVER_FILE,
  ],
  alias: {
    react: RUNTIME_SERVER_FILE,
    "react-dom": RUNTIME_SERVER_FILE,
    "react-dom/client": RUNTIME_SERVER_FILE,
    "react-dom/server": RUNTIME_SERVER_FILE,
  },
});

const builtPages = await glob(`${PAGES_DIR.replace(/\\/g, "/")}/**/*.js`);
for (const pageFile of builtPages) {
  const source = await readFile(pageFile, "utf-8");
  const runtimeSpecifier = toModuleSpecifier(
    path.resolve(path.dirname(pageFile)),
    RUNTIME_SERVER_FILE
  );
  const escapedRuntimeFileInCode = JSON.stringify(RUNTIME_SERVER_FILE).slice(
    1,
    -1
  );
  const nextSource = source.split(escapedRuntimeFileInCode).join(runtimeSpecifier);

  if (nextSource !== source) {
    await writeFile(pageFile, nextSource);
  }
}
