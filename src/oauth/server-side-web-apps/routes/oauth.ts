import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import { lowdb } from "../database";

import { OAuth2Service } from "../services";

function oauth(opts: { oauth2Client: OAuth2Client }) {
  const router = Router();
  const { oauth2Client } = opts;

  router.get("/callback", async (req, res) => {
    const { code: authorizationCode } = req.query;
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    oauth2Client.setCredentials(tokens);
    const data = await OAuth2Service.getUserInfo();

    console.log("tokens: ", tokens);
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
      .push({ ...tokens, ...data })
      .write();

    req.app.locals.userInfo = data;
    res.redirect("/");
  });

  router.get("/user", async (req, res) => {
    const data = await OAuth2Service.getUserInfo();
    res.send(data);
  });

  router.get("/revoke", (req, res) => {
    oauth2Client.revokeCredentials((error, response) => {
      if (error) {
        const errorMessage = "revoke token failed.";
        console.error(errorMessage);
        console.error(error);
        res.locals.errorMessage = errorMessage;
        return res.redirect("/error");
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
