import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import { credentials } from "../../credentials";

const scopes: string[] = credentials.SCOPES.split(",").map((scope) => `https://www.googleapis.com/auth/${scope}`);

const oauth2Client: OAuth2Client = new google.auth.OAuth2(
  credentials.CLIENT_ID,
  credentials.CLIENT_SECRET,
  credentials.REDIRECT_URL,
);
google.options({ auth: oauth2Client });
const authUrl: string = oauth2Client.generateAuthUrl({ access_type: "offline", scope: scopes });

// oauth2Client.on("tokens", (tokens) => {
//   if (tokens.refresh_token) {
//     // store the refresh_token in my database!
//     console.log("[tokens event] tokens.refresh_token", tokens.refresh_token);
//   }
//   console.log("[tokens event] tokens.access_token", tokens.access_token);
// });

export { oauth2Client, authUrl };
