import { readdir, writeFile } from "fs/promises";
import path from "path";
import { generateRoutes } from "./generate-routes.js";

const PAGES_DIR = path.resolve("./frontend/pages");
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
