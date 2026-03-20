import { readdir, writeFile } from "fs/promises";
import path from "path";
import { generateRoutes } from "./generate-routes.js";

const PAGES_DIR = path.resolve("./frontend/pages");
const OUTPUT_FILE = path.resolve("./frontend/.pages/index.js");
const OUTPUT_DIR = path.dirname(OUTPUT_FILE);

function toModuleSpecifier(fromDir, targetFile) {
  const relativePath = path.relative(fromDir, targetFile).replace(/\\/g, "/");
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}

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

    const moduleSpecifier = toModuleSpecifier(OUTPUT_DIR, route.filePath);
    imports.push(`import ${importName} from '${moduleSpecifier}';`);
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
