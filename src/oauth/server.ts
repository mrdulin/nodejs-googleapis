import express from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

interface IServerOpts {
  PORT: number | string;
  oauth2Client: OAuth2Client;
}

function createServer(opts: IServerOpts) {
  const app: express.Application = express();
  const { PORT, oauth2Client } = opts;

  app.get("/oauth/callback", async (req, res) => {
    console.log("req.query: ", req.query);
    const { code: authorizationCode } = req.query;
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    console.log("tokens: ", tokens);
    oauth2Client.credentials = tokens;
    res.end("Authentication successful! Please return to the console.");
  });

  app.get("/plus/:userId", async (req, res) => {
    console.log("req.params: ", req.params);
    const { userId } = req.params;
    const plus = google.plus("v1");
    try {
      const response = await plus.people.get({ userId });
      res.json({ data: response.data, error: 0, errMsg: "" });
    } catch (error) {
      console.error(error);
      res.json({ data: {}, error: 1, errMsg: "get google plus user profile failed." });
    }
  });

  return app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
  });
}

export { createServer, IServerOpts };
