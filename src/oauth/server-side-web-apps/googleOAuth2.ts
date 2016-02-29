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

export { oauth2Client, authUrl };
