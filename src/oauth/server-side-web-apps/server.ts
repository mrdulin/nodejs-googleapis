import express, { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import path from "path";

import { lowdb } from "./database";
import { routes } from "./routes";

interface IServerOpts {
  PORT: number | string;
  oauth2Client: OAuth2Client;
}

function createServer(opts: IServerOpts) {
  const app: express.Application = express();
  const { PORT, oauth2Client } = opts;

  app.set("view engine", "ejs");
  app.set("views", path.resolve(__dirname, "./views"));

  app.use("/public", express.static(path.resolve(__dirname, "./public")));
  // app.use(oauth(oauth2Client));
  app.use(routes({ oauth2Client }));

  return app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
  });
}

export { createServer, IServerOpts };
