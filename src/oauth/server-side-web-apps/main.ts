import { config } from "../../config";
import { oauth2Client } from "./googleOAuth2";
import { createServer } from "./server";

async function main() {
  createServer({ PORT: config.PORT, oauth2Client });
}

main();
