import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import request, { Options } from "request-promise";

import { credentials } from "../../../credentials";
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

      console.log(
        `original tokens expiry date: ${tokens.expiry_date},${new Date(tokens.expiry_date as number).toLocaleString()}`,
      );
      if (tokens.expiry_date) {
        // For testing token expire
        const expiryDate = moment(new Date(tokens.expiry_date))
          .subtract(59, "m")
          .subtract(50, "s")
          .toDate()
          .getTime();

        console.log(`test expiry date: ${expiryDate}, ${new Date(expiryDate).toLocaleString()}`);

        tokens.expiry_date = expiryDate;
      }

      oauth2Client.setCredentials(tokens);
    } catch (error) {
      console.error("oauth2Client get token failed.");
      return next(error);
    }

    let userInfo;
    try {
      userInfo = await OAuth2Service.getUserInfo();
      console.log("userInfo: ", userInfo);
    } catch (error) {
      console.error("OAuth2Service get user info failed.");
      return next(error);
    }

    lowdb
      .get("oauth_clients")
      .push({ ...tokens, ...userInfo })
      .write();

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

  router.get("/revoke-access-token", async (req, res, next) => {
    const googleAccount: any = lowdb
      .get("oauth_clients")
      .find({ email: (req as any).user.email })
      .value();
    console.log("googleAccount: ", googleAccount);

    // oauth2Client.setCredentials({ refresh_token: googleAccount.refresh_token });

    try {
      const accessToken = googleAccount.access_token + "make invalid"; // Error: invalid_token
      await oauth2Client.revokeToken(googleAccount.access_token);
      console.log("revoke access token successfully.");
      lowdb
        .get("oauth_clients")
        .remove({ email: (req as any).user.email })
        .write();
      res.redirect("/");
    } catch (error) {
      console.error("revoke access token failed.");
      next(error);
    }
  });

  router.get("/v2/revoke-access-token", async (req, res, next) => {
    const googleAccount: any = lowdb
      .get("oauth_clients")
      .find({ email: (req as any).user.email })
      .value();

    let newTokens;
    try {
      newTokens = await refreshAccessToken(googleAccount.refresh_token);
      console.log("new access token: ", newTokens);
      lowdb
        .get("oauth_clients")
        .find({ email: (req as any).user.email })
        .assign({ access_token: newTokens.access_token, id_token: newTokens.id_token });
    } catch (error) {
      const err = error.error;
      console.log("err: ", err);
      if (err.error_description === "Token has been expired or revoked." && err.error === "invalid_grant") {
        lowdb
          .get("oauth_clients")
          .remove({ email: (req as any).user.email })
          .write();
        return res.redirect("/");
      }
      next(err);
    }

    try {
      await oauth2Client.revokeToken(newTokens.access_token);
      console.log("revoke access token successfully.");
      lowdb
        .get("oauth_clients")
        .remove({ email: (req as any).user.email })
        .write();
      res.redirect("/");
    } catch (error) {
      console.error("revoke access token failed.");
      next(error);
    }
  });

  // { expiry_date: 1554023897790,
  //   scopes:
  //    [ 'openid',
  //      'https://www.googleapis.com/auth/userinfo.profile',
  //      'https://www.googleapis.com/auth/userinfo.email',
  //      'https://www.googleapis.com/auth/adwords' ],
  //   azp: '16536262744-7ob1su0o1hn4t79482e41mirhc102mvh.apps.googleusercontent.com',
  //   aud: '16536262744-7ob1su0o1hn4t79482e41mirhc102mvh.apps.googleusercontent.com',
  //   sub: '104760625496851302622',
  //   exp: '1554023897',
  //   email: 'novaline.dulin@gmail.com',
  //   email_verified: 'true',
  //   access_type: 'offline' }
  router.get("/token-info", async (req, res, next) => {
    const googleAccount: any = lowdb
      .get("oauth_clients")
      .find({ email: (req as any).user.email })
      .value();
    try {
      const tokenInfo = await oauth2Client.getTokenInfo(googleAccount.access_token);
      console.log("token info: ", tokenInfo);
      res.redirect("/");
    } catch (error) {
      const err = error.response.data;
      console.error("get token info failed.");
      console.error(err);
      // token expired or token has been revoked.
      // { error: 'invalid_token', error_description: 'Invalid Value' }
      if (err && err.error === "invalid_token" && err.error_description === "Invalid Value") {
        lowdb
          .get("oauth_clients")
          .remove({ email: (req as any).user.email })
          .write();
        return res.redirect("/");
      }
      next(error);
    }
  });

  router.get("/refresh-token", async (req, res, next) => {
    const googleAccount: any = lowdb
      .get("oauth_clients")
      .find({ email: (req as any).user.email })
      .value();
    try {
      const tokens = await refreshAccessToken(googleAccount.refresh_token);
      console.log("new access token: ", tokens);
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  });

  router.get("/revoke", (req, res, next) => {
    oauth2Client.revokeCredentials((error, response) => {
      if (error) {
        console.error("revoke token failed.");
        return next(error);
      }
      console.log("revoke token successfully");
      lowdb
        .get("oauth_clients")
        .remove({ email: (req as any).user.email })
        .write();
      res.redirect("/");
    });
  });

  return router;
}

async function refreshAccessToken(refreshToken: string) {
  const options: Options = {
    uri: "https://www.googleapis.com/oauth2/v4/token",
    method: "POST",
    body: {
      client_id: credentials.CLIENT_ID,
      client_secret: credentials.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
    json: true,
  };
  return request(options).catch((error) => {
    console.error("refresh access token failed.");
    console.log(error.error);
    return Promise.reject(error);
  });
}

export { oauth };
