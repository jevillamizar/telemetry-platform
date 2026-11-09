import { loadConfig } from "./config.js";

function main(): void {
  try {
    loadConfig();
    console.log("Simulador configurado correctamente.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
