import { NextFunction, Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authUrl } from "../googleOAuth2";

import { lowdb } from "../database";
import { oauth } from "./oauth";
import { plus } from "./plus";

function routes(opts: { oauth2Client: OAuth2Client }) {
  const router = Router();
  const { oauth2Client } = opts;

  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log("tokens.refresh_token: ", tokens.refresh_token);
    }
    console.log("tokens.access_token: ", tokens.access_token);
  });

  router.use(function jwtAuth(req: Request, res, next) {
    (req as any).user = { email: "novaline.dulin@gmail.com" };
    next();
  });

  router.get("/", async (req, res) => {
    console.log("req.user: ", (req as any).user);
    const userInfo = lowdb
      .get("oauth_clients")
      .find({ email: (req as any).user.email })
      .value();

    res.render("index", { authUrl, userInfo });
  });

  router.use("/api/oauth", oauth(opts));
  router.use("/api/plus", plus());

  router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500);
    res.render("error", { error: error.message || error });
  });

  return router;
}

export { routes };
