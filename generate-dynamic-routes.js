import { readdir } from "fs/promises";
import path from "path";

export async function generateRoutes(PAGES_DIR) {
  let isRoot = true;
  async function helper(folderPath) {
    const folderEntries = await readdir(folderPath, { withFileTypes: true });
    const node = {
      name: isRoot ? "root" : path.basename(folderPath),
      children: [],
    };
    if (isRoot) isRoot = false;

    for (const entry of folderEntries) {
      const fullPath = path.join(folderPath, entry.name);

      if (
        entry.isFile() &&
        (entry.name === "page.jsx" || entry.name === "page.js")
      ) {
        node.page = path.resolve(folderPath, entry.name);
      } else if (entry.isDirectory()) {
        const child = await helper(fullPath);
        node.children.push(child);
      }
    }

    return node;
  }

  return await helper(PAGES_DIR);
}

console.log(
  JSON.stringify(await generateRoutes(path.resolve("frontend/pages")), null, 2)
);
