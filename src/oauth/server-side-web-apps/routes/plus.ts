import { Router } from "express";
import { PlusService } from "../services";

function plus() {
  const router = Router();

  router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const data = await PlusService.getUser(userId);
    res.json(data);
  });
  return router;
}

export { plus };
