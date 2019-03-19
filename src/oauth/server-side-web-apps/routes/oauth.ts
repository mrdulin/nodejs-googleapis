import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import { lowdb } from "../database";

import { OAuth2Service } from "../services";

function oauth(opts: { oauth2Client: OAuth2Client }) {
  const router = Router();
  const { oauth2Client } = opts;

  router.get("/callback", async (req, res, next) => {
    const { code: authorizationCode, error } = req.query;
    if (!authorizationCode || error) {
      req.app.locals.errorMessage = error;
      return next(error);
    }

    let tokens;
    try {
      tokens = (await oauth2Client.getToken(authorizationCode)).tokens;
      console.log("tokens: ", tokens);
    } catch (error) {
      const errorMessage = "oauth2Client get token failed.";
      console.error(errorMessage);
      console.error(error);
      return next(errorMessage);
    }

    oauth2Client.setCredentials(tokens);

    let userInfo;
    try {
      userInfo = await OAuth2Service.getUserInfo();
      console.log("userInfo: ", userInfo);
    } catch (error) {
      const errorMessage = "OAuth2Service get user info failed.";
      console.error(errorMessage);
      console.error(error);
      return next(errorMessage);
    }

    if (tokens.expiry_date) {
      // For testing token expire
      const expiryDate = moment(new Date(tokens.expiry_date))
        .subtract(59, "m")
        .subtract(50, "s")
        .toDate()
        .getTime();

      console.log("expiryDate: ", new Date(expiryDate).toLocaleString());

      tokens.expiry_date = expiryDate;
    }

    lowdb
      .get("oauth_clients")
      .push({ ...tokens, ...userInfo })
      .write();
    req.app.locals.userInfo = userInfo;

    res.redirect("/");
  });

  router.get("/user", async (req, res, next) => {
    try {
      const data = await OAuth2Service.getUserInfo();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/revoke", (req, res, next) => {
    oauth2Client.revokeCredentials((error, response) => {
      if (error) {
        const errorMessage = "revoke token failed.";
        console.error(errorMessage);
        console.error(error);
        return next(errorMessage);
      }
      console.log("revoke token successfully");
      lowdb.set("oauth_clients", []).write();
      req.app.locals.userInfo = null;
      res.redirect("/");
    });
  });

  return router;
}

export { oauth };
