import express from "express";
import { OAuth2Client } from "google-auth-library";

import * as routes from "./routes";
interface IServerOpts {
  PORT: number | string;
  oauth2Client: OAuth2Client;
}

function createServer(opts: IServerOpts) {
  const app: express.Application = express();
  const { PORT, oauth2Client } = opts;

  app.use("/oauth", routes.oauth(oauth2Client));
  app.use("/plus", routes.plus);
  app.use("/adwords", routes.adwords);

  return app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
  });
}

export { createServer, IServerOpts };
