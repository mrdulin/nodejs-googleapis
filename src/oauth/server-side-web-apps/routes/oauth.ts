import { Router } from "express";
import { OAuth2Client } from "google-auth-library";

function oauth(oauth2Client: OAuth2Client) {
  const router = Router();

  router.get("/callback", async (req, res) => {
    console.log("req.query: ", req.query);
    const { code: authorizationCode } = req.query;
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    console.log("tokens: ", tokens);
    oauth2Client.credentials = tokens;
    res.end("Authentication successful! Please return to the console.");
  });

  router.get("/revoke", (req, res) => {
    oauth2Client.revokeCredentials((error, response) => {
      if (error) {
        return res.end("revoke token failed.");
      }
      console.log("response: ", response);
      res.end("revoke token successfully");
    });
  });

  return router;
}

export { oauth };
