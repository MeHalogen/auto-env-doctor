import { describe, it, expect } from "vitest";
import { doctorEnv } from "../src/index.js";
import { writeFile, mkdir, rm, readFile } from "node:fs/promises";
import path from "node:path";

describe("doctorEnv", () => {
  it("should detect environment variables in code and sync with example", async () => {
    const tmpDir = path.resolve("tests/tmp-env-project");
    await mkdir(tmpDir, { recursive: true });

    // Create a mock code file
    const codeFile = path.join(tmpDir, "index.ts");
    const codeContent = `
      const port = process.env.PORT || 3000;
      const apiKey = process.env.API_KEY;
      console.log(process.env.DB_URL);
    `;
    await writeFile(codeFile, codeContent, "utf8");

    // Create a mock .env.example with some variables missing
    const exampleFile = path.join(tmpDir, ".env.example");
    const exampleContent = `
# Server configs
PORT=8080
    `;
    await writeFile(exampleFile, exampleContent, "utf8");

    // Audit env
    const result = await doctorEnv({
      dir: tmpDir,
      envExamplePath: exampleFile,
      sync: true
    });

    expect(result.referenced).toContain("PORT");
    expect(result.referenced).toContain("API_KEY");
    expect(result.referenced).toContain("DB_URL");
    expect(result.exampleVars).toContain("PORT");
    expect(result.missing).toContain("API_KEY");
    expect(result.missing).toContain("DB_URL");
    expect(result.synced).toBe(true);

    // Read synced file content
    const syncedContent = await readFile(exampleFile, "utf8");
    expect(syncedContent).toContain("API_KEY=");
    expect(syncedContent).toContain("DB_URL=");

    // Clean up
    await rm(tmpDir, { recursive: true, force: true });
  });
});
