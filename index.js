import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import path, { extname, join } from "path";
import { renderToPipeableStream } from "react-dom/server";
import { fileURLToPath, pathToFileURL } from "url";
import React from "react";
import { generateDynamicRoutes } from "./generate-dynamic-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let PUBLIC_DIR = path.join(__dirname, "/frontend/static");
let PORT = 3000;
let PAGES_FOLDER = path.join(__dirname, "/.previous/pages");

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};
function renderWithLayout({ Page, Layout }) {
  return React.createElement(Layout, null, React.createElement(Page));
}
export async function streamReactFileToClient(filePath, response) {
  const file = pathToFileURL(filePath);
  const { default: Component } = await import(file);
  const { default: Layout } = await import("./.previous/pages/layout.js");
  const { pipe } = renderToPipeableStream(
    renderWithLayout({ Page: Component, Layout }),
    {
      onShellReady() {
        response.setHeader("content-type", mime[".html"]);
        response.write("<!DOCTYPE html>");
        pipe(response);
      },
    }
  );

  return pipe;
}

// export async function getRoutes(dir = PAGES_FOLDER) {
//   const files = await readdir(dir);
//   const routes = {};

//   for (const file of files) {
//     if (!file.endsWith(".js")) continue;
//     const name = file.replace(".js", "");
//     if (name === "layout") continue;
//     routes[name === "index" ? "/" : `/${name}`] = { fileName: file };
//   }

//   return routes;
// }

function getMimeType(fileName) {
  return mime[extname(fileName)] || "text/plain";
}

function isPathInsideRoot(filePath, rootPath) {
  const resolvedFilePath = path.resolve(filePath);
  const resolvedRootPath = path.resolve(rootPath);
  const rootWithSeparator = resolvedRootPath.endsWith(path.sep)
    ? resolvedRootPath
    : `${resolvedRootPath}${path.sep}`;

  return (
    resolvedFilePath === resolvedRootPath ||
    resolvedFilePath.startsWith(rootWithSeparator)
  );
}

function isAllowedByWhitelist(filePath, whitelistRoots) {
  return whitelistRoots.some((rootPath) => isPathInsideRoot(filePath, rootPath));
}

function resolveRoute({ allRoutesTree, pathname }) {
  console.log(pathname);

  const folders = pathname.split("/");

  let currentRoute = allRoutesTree;

  for (const folder of folders.slice(1)) {
    if (folder.length === 0) continue;
    const route = currentRoute.children.find((child) => child.name === folder);
    if (!route) {
      return;
    }
    currentRoute = route;
  }

  return currentRoute;
}

// console.log(
// resolveRoute({
// allRoutesTree:
// await generateDynamicRoutes(PUBLIC_DIR)
// pathname: "/scripts/client.js",
// })
// );

export async function startServer(dir = PAGES_FOLDER) {
  if (dir) PAGES_FOLDER = dir;

  const routes = await generateDynamicRoutes(PAGES_FOLDER);
  const whitelistRoots = [
    path.resolve(PAGES_FOLDER),
    path.resolve(PUBLIC_DIR),
    path.resolve(".previous"),
  ];

  const server = createServer(async (req, res) => {
    const { url } = req;
    const [pathname] = url.split("?");

    const route = resolveRoute({ allRoutesTree: routes, pathname });
    const filePath = route?.page;
    res.statusCode = 200;
    if (pathname.startsWith("/scripts")) {
      const filePath = path.resolve(
        join(".previous", ...pathname.split("/").slice(2))
      ); // map URL path to local files
      if (!isAllowedByWhitelist(filePath, whitelistRoots)) {
        res.statusCode = 403;
        res.end("<h1>Forbidden</h1>");
        return;
      }

      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          const content = await readFile(filePath);
          res.writeHead(200, {
            "Content-Type": getMimeType(filePath) || "application/javascript",
          });
          res.end(content);
          return;
        }
      } catch (err) {
        res.statusCode = 404;
        res.end();
      }
    } else if (pathname.startsWith("/static")) {
      try {
        const filePath = path.resolve(
          join(PUBLIC_DIR, decodeURIComponent(pathname))
        );
        if (!isAllowedByWhitelist(filePath, whitelistRoots)) {
          res.statusCode = 403;
          res.end("<h1>Forbidden</h1>");
          return;
        }
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          const content = await readFile(filePath);
          res.writeHead(200, {
            "Content-Type": getMimeType(filePath) || "text/plain",
          });
          res.end(content);
          return;
        }
      } catch (err) {
        res.statusCode = 404;
        res.end();
      }
    } else {
      try {
        if (filePath) {
          if (!isAllowedByWhitelist(filePath, whitelistRoots)) {
            res.statusCode = 403;
            res.end("<h1>Forbidden</h1>");
            return;
          }
          await streamReactFileToClient(filePath, res);

          res.end();
        } else {
          res.statusCode = 404;
          if (routes["/not-found"]) {
            const filePath = routes["/not-found"].filePath;

            await streamReactFileToClient(filePath, res);

            res.end();
          } else {
            res.setHeader("Content-Type", "text/html");
            res.end("<h1>Not found</h1>");
          }
        }
      } catch (err) {
        console.error("Error serving request:", err);
        res.statusCode = 500;
        res.end("<h1>Internal Server Error</h1>");
      }
    }

    console.log(
      `[${new Date().toTimeString()}] [${req.method}] ${url} ${res.statusCode}`
    );
  });

  server.listen(PORT || 0, () => {
    console.log(
      `Server running at http://${
        server.address().address === "::"
          ? "localhost"
          : server.address().address
      }:${server.address().port}`
    );
  });

  return server;
}

// Auto-start when run directly (not imported)
if (process.env.NODE_ENV !== "test") {
  startServer();
} else {
  PUBLIC_DIR = path.join(__dirname, "/tests/static");
  PAGES_FOLDER = path.join(__dirname, "/.previous/tests/pages");
  PORT = 3567;
}
