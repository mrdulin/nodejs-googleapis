import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import opn from "opn";

import { credentials } from "../../credentials";

async function authenticate(scopes: string[] | string) {
  const oauth2Client: OAuth2Client = new google.auth.OAuth2(
    credentials.CLIENT_ID,
    credentials.CLIENT_SECRET,
    credentials.REDIRECT_URL,
  );
  google.options({ auth: oauth2Client });

  const authUrl: string = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("auth url: ", authUrl);
  opn(authUrl, { app: "google chrome", wait: false })
    .then((cp) => {
      cp.unref();
    })
    .catch((error) => {
      console.error("open browser failed.");
      console.log(error);
    });
  return oauth2Client;
}

export { authenticate };
