import { Application, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authUrl } from "../googleOAuth2";

import { oauth } from "./oauth";
import { plus } from "./plus";

function routes(opts: { oauth2Client: OAuth2Client }) {
  const router = Router();

  router.get("/", async (req, res) => {
    let userInfo;
    if (req.app.locals.userInfo) {
      userInfo = req.app.locals.userInfo;
    }
    res.render("index", { authUrl, userInfo });
  });

  router.get("/error", (req, res) => {
    res.render("error", { error: res.locals.errorMessage });
  });

  router.use("/api/oauth", oauth(opts));
  router.use("/api/plus", plus());

  return router;
}

export { routes };
