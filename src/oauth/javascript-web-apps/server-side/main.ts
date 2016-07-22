import { createServer } from "./server";

import { config } from "../../../config";

function main() {
  createServer({ PORT: config.PORT });
}

main();
