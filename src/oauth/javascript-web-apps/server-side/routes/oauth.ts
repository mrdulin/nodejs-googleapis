import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import { credentials } from "../../../../credentials";

function oauth() {
  const router = Router();

  const oauth2Client: OAuth2Client = new google.auth.OAuth2(credentials.CLIENT_ID, credentials.CLIENT_SECRET);
  google.options({ auth: oauth2Client });
  const scopes: string[] = credentials.SCOPES.split(",").map((scope) => `https://www.googleapis.com/auth/${scope}`);
  const authUrl: string = oauth2Client.generateAuthUrl({ access_type: "offline", scope: scopes });
  console.log("authUrl: ", authUrl);

  router.get("/info", (req, res) => {
    res.json({ success: true, data: { authUrl } });
  });

  router.get("/callback", async (req, res) => {
    console.log("req.query: ", req.query);
    const { code, redirect_uri } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken({ code, redirect_uri });
      console.log("tokens: ", tokens);
      oauth2Client.setCredentials(tokens);
      res.json({ success: true });
    } catch (error) {
      const msg = "auth failed.";
      console.error(msg);
      console.error(error);
      res.json({ success: false, msg });
    }
  });

  router.get("/revoke", (req, res) => {
    oauth2Client.revokeCredentials((error, response) => {
      if (error) {
        return res.json({ success: false, msg: "revoke token failed." });
      }
      console.log("response: ", response);
      res.json({ success: true });
    });
  });

  return router;
}

export { oauth };
