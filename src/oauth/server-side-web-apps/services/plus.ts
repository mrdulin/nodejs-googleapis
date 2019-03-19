import { google } from "googleapis";

class PlusService {
  public static async getUser(userId: string) {
    const plus = google.plus("v1");
    try {
      const { data } = await plus.people.get({ userId });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("get google plus user info failed.");
    }
  }
}

export { PlusService };
