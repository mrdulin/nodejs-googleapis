import { Router } from "express";
import { google } from "googleapis";

function adwords() {
  const router = Router();

  router.get("/", (req, res) => {
    // const googleAdwords = google.adwords;
  });
  return router;
}

export { adwords };
