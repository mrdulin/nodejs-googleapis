import { createServer } from "./server";

import { config } from "../../config";
import { credentials } from "../../credentials";
import { authenticate } from "./auth";

async function main() {
  const scopes: string[] = credentials.SCOPES.split(",").map((scope) => `https://www.googleapis.com/auth/${scope}`);

  const oauth2Client = await authenticate(scopes);
  createServer({ PORT: config.PORT, oauth2Client });
}

main();
