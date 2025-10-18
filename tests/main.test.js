import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getRoutes, startServer } from "../index.js";
import expectedPages from "./expected-data/pages.js";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let PAGES_FOLDER = path.join(__dirname, "tests/pages");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("getRoutes function", () => {
  it("should return routes for '/', '/about', and 404 page", async () => {
    const expected = {
      "/about": { fileName: "about.js" },
      "/": { fileName: "index.js" },
      "/not-found": { fileName: "not-found.js" },
    };

    const result = await getRoutes();
    expect(result).toEqual(expected);
  });
});

describe("Check if server is working", () => {
  let serverProcess;
  const BASE_URL = "http://localhost:3567";

  beforeAll(async () => {
    // Start the dev server
    serverProcess = spawn("npm", ["run", "test-build"], {
      shell: true,
      stdio: "inherit", // output logs to console
    });
    await delay(5000); // adjust if server takes longer
    const server = await startServer();
    // Wait for the server to start
  });

  afterAll(() => {
    // Kill the server after tests
    if (serverProcess) serverProcess.kill();
  });

  const testPathnames = ["/", "/about", "/notfoundrubbishpageblala"];

  testPathnames.forEach((pathname) => {
    it(`should return correct status for '${pathname}'`, async () => {
      let result;
      try {
        result = await axios.get(`${BASE_URL}${pathname}`);
      } catch (err) {
        result = err?.response;
      }

      const expectedResult =
        expectedPages[pathname] || expectedPages["/not-found"];

      expect(result.status).toEqual(expectedResult.status);
    });
  });
});
