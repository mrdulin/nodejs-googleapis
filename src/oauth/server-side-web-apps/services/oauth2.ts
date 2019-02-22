import { google } from "googleapis";
import { oauth2Client } from "../googleOAuth2";

class OAuth2Service {
  public static async getUserInfo() {
    const oauth2 = google.oauth2("v1");
    const { data } = await oauth2.userinfo.get({ auth: oauth2Client });
    return data;
  }
}

export { OAuth2Service };
