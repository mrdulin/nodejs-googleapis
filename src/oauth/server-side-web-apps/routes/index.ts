import { Application, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authUrl } from "../googleOAuth2";

import { oauth } from "./oauth";

function routes(opts: { oauth2Client: OAuth2Client }) {
  const router = Router();

  router.get("/", async (req, res) => {
    let displayName;
    if (req.app.locals.plusUserInfo) {
      displayName = req.app.locals.plusUserInfo.displayName;
    }
    res.render("index", { authUrl, displayName });
  });

  router.get("/error", (req, res) => {
    res.render("error", { error: res.locals.errorMessage });
  });

  router.use("/api/oauth", oauth(opts));

  return router;
}

export { routes };
