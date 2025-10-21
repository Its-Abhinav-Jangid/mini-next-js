import { readdir } from "fs/promises";
import path from "path";

export async function generateRoutes(PAGES_DIR) {
  const entries = await readdir(PAGES_DIR, { withFileTypes: true });
  const routes = {};

  // helper recursive function to generate routes
  async function helper(folderPath) {
    const folderEntries = await readdir(folderPath, { withFileTypes: true });
    const relativeFolderPath = path.relative(PAGES_DIR, folderPath);

    for (const entry of folderEntries) {
      if (
        entry.isFile() &&
        (entry.name === "page.jsx" || entry.name === "page.js")
      ) {
        // normalize route path to use forward slashes (windows!!)
        const routePath = "/" + relativeFolderPath.replace(/\\/g, "/");

        routes[routePath] = {
          filePath: path.resolve(folderPath, entry.name),
        };
      } else if (entry.isDirectory()) {
        await helper(path.join(folderPath, entry.name));
      }
    }
  }

  for (const entry of entries) {
    if (entry.name === "page.jsx" || entry.name === "page.js") {
      routes["/"] = { filePath: path.resolve(PAGES_DIR, entry.name) };
    }

    if (entry.isDirectory()) {
      await helper(path.join(PAGES_DIR, entry.name));
    }
  }

  return routes;
}
