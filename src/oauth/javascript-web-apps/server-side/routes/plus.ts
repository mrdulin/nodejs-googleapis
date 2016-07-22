import { Router } from "express";
import { google } from "googleapis";

function plus() {
  const router = Router();

  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const googlePlus = google.plus("v1");
    try {
      const response = await googlePlus.people.get({ userId });
      res.json({ data: response.data, error: 0, errMsg: "" });
    } catch (error) {
      console.error(error);
      res.json({ data: {}, error: 1, errMsg: "get google plus user profile failed." });
    }
  });

  return router;
}

export { plus };
