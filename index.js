import { createServer } from "http";
import { readdir, readFile, stat } from "fs/promises";
import path, { extname, join } from "path";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { fileURLToPath, pathToFileURL } from "url";
import React from "react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let PUBLIC_DIR = path.join(__dirname, "/frontend/static");
let PORT = 3001;
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
        response.write("<!DOCTYPE html>")
        pipe(response);
      },
    }
  );

  return pipe;
}

export async function getRoutes(dir = PAGES_FOLDER) {
  const files = await readdir(dir);
  const routes = {};

  for (const file of files) {
    if (!file.endsWith(".js")) continue;
    const name = file.replace(".js", "");
    if (name === "layout") continue;
    routes[name === "index" ? "/" : `/${name}`] = { fileName: file };
  }

  return routes;
}

function getMimeType(fileName) {
  return mime[extname(fileName)] || "text/plain";
}

export async function startServer(dir = PAGES_FOLDER) {
  if (dir) PAGES_FOLDER = dir;

  const routes = await getRoutes(dir);

  const server = createServer(async (req, res) => {
    const { url } = req;
    const [path] = url.split("?");

    const route = routes[path];
    const fileName = route?.fileName;
    res.statusCode = 200;
    if (path.startsWith("/scripts")) {
      const filePath = join(".previous", ...path.split("/").slice(2)); // map URL path to local files
      console.log(filePath);
      
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
    } else if (path.startsWith("/static")) {
      const filePath = join(PUBLIC_DIR, decodeURIComponent(req.url));
      const fileStat = await stat(filePath);
      if (fileStat.isFile()) {
        const content = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": getMimeType(filePath) || "text/plain",
        });
        res.end(content);
        return;
      }
    } else {
      try {
        if (fileName) {
          const filePath = join(PAGES_FOLDER, fileName);
          await streamReactFileToClient(filePath, res);

          res.end();
        } else {
          res.statusCode = 404;
          if (routes["/not-found"]) {
            const filePath = join(PAGES_FOLDER, routes["/not-found"].fileName);

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
  PORT = 3567
}
