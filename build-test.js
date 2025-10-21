import path from "path";
import { build } from "esbuild";
import { readdir, writeFile } from "fs/promises";
import { glob } from "glob";
import { generateRoutes } from "./generate-routes.js";
const OUT_DIR = ".previous/tests";
const OUTPUT_PAGES_DIR = path.join(OUT_DIR, "pages");

const PAGES_DIR = path.resolve("./tests/pages");
const OUTPUT_FILE = path.resolve("./frontend/.pages/index.js");

async function generatePagesIndex() {
  const routes = await generateRoutes(PAGES_DIR);
  const keys = Object.keys(routes);
  const imports = [];
  const mapEntries = [];
  let route;
  let counter = 0;
  for (const key of keys) {
    route = routes[key];

    const importName = `Page${counter++}`; // safe local variable

    imports.push(`import ${importName} from '${route.filePath}';`);
    mapEntries.push(`  '${key}': ${importName}`);
  }

  const content = `
${imports.join("\n")}

export const pages = {
${mapEntries.join(",\n")}
};
`;

  await writeFile(OUTPUT_FILE, content.trim());
  console.log(`Pages index generated at ${OUTPUT_FILE}`);
}

generatePagesIndex().catch(console.error);

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
await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outfile: "./.previous/static/scripts/react-runtime-server.js",
  format: "esm",
  platform: "node",
  target: "esnext",
  bundle: false,
  minify: true,
});

const entryPoints = await glob("tests/pages/**/*.jsx");

await build({
  entryPoints,
  outdir: OUTPUT_PAGES_DIR,
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
