#!/usr/bin/env node
import { mainCLI } from "./main";

// Small launcher that delegates to the refactored main module.
mainCLI().catch((e) => {
  console.error("Error running generator:", e);
  process.exit(1);
});
