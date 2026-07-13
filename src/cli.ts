#!/usr/bin/env node

import { doctorEnv } from "./index.js";
import path from "node:path";

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help")) {
    console.log(`
Usage: auto-env-doctor [options]

Options:
  --sync                Append missing environment variables to .env.example
  --dir <path>          Workspace directory to scan (default: current directory)
  --example <path>      Path to the .env.example file (default: .env.example in scan dir)
  -h, --help            Show help info
`);
    process.exit(0);
  }

  let sync = false;
  let dir = process.cwd();
  let examplePath: string | undefined = undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--sync") {
      sync = true;
    } else if (arg === "--dir") {
      const val = args[++i];
      if (val) dir = path.resolve(val);
    } else if (arg === "--example") {
      const val = args[++i];
      if (val) examplePath = path.resolve(val);
    }
  }

  try {
    const result = await doctorEnv({
      dir,
      envExamplePath: examplePath,
      sync
    });

    console.log("=== Environment Variables Audit ===");
    console.log(`Referenced in code:   [${result.referenced.join(", ")}]`);
    console.log(`Found in .env.example: [${result.exampleVars.join(", ")}]`);
    
    if (result.missing.length > 0) {
      console.log(`Missing variables:    [${result.missing.join(", ")}]`);
      if (result.synced) {
        console.log("\n[Success] Missing variables appended to .env.example.");
      } else {
        console.log("\n[Warning] Run with '--sync' to automatically add missing variables.");
        process.exit(1);
      }
    } else {
      console.log("\n[Success] All environment variables are synchronized.");
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
