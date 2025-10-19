import path from "path";
import { build } from "esbuild";
import { readdir, writeFile } from "fs/promises";

const OUT_DIR = ".previous/tests";
const OUTPUT_PAGES_DIR = path.join(OUT_DIR, "pages");

const PAGES_DIR = path.resolve("./tests/pages");
const OUTPUT_FILE = path.resolve("./frontend/.pages/index.js");

async function generatePagesIndex() {
  const files = await readdir(PAGES_DIR);
  const imports = [];
  const mapEntries = [];

  let counter = 0;
  for (const file of files) {
    if (!file.endsWith(".jsx")) continue;

    const route = file === "index.jsx" ? "/" : `/${file.replace(".jsx", "")}`;
    const importName = `Page${counter++}`; // safe local variable

    imports.push(`import ${importName} from '../pages/${file}';`);
    mapEntries.push(`  '${route}': ${importName}`);
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

await build({
  entryPoints: ["frontend/static/scripts/react-runtime.js"],
  outfile: "frontend/react-runtime-server.js",
  format: "esm",
  platform: "node",
  target: "esnext",
  bundle: false,
});

await build({
  entryPoints: ["tests/pages/*.jsx"],
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
    "./frontend/react-runtime.js",
  ],
  alias: {
    "@/frontend/react-runtime.js": path.resolve(
      "./frontend/react-runtime-server.js"
    ),
  },
});
