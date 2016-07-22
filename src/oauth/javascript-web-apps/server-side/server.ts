import cors from "cors";
import express from "express";

import * as routes from "./routes";
interface IServerOpts {
  PORT: number | string;
}

function createServer(opts: IServerOpts) {
  const app: express.Application = express();
  const { PORT } = opts;

  app.use(cors());

  app.use("/oauth", routes.oauth());
  app.use("/plus", routes.plus());
  app.use("/ping", (req, res) => {
    res.end("pong");
  });

  return app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
  });
}

export { createServer, IServerOpts };
