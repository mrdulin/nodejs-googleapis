import { google } from "googleapis";
import { oauth2Client } from "../googleOAuth2";

class OAuth2Service {
  public static async getUserInfo() {
    const oauth2 = google.oauth2("v1");
    try {
      const { data } = await oauth2.userinfo.get({ auth: oauth2Client });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("OAuth2Service.getUserInfo failed.");
    }
  }
}

export { OAuth2Service };
