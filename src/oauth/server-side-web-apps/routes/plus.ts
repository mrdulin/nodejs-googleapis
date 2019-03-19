import { Router } from "express";
import { PlusService } from "../services";

function plus() {
  const router = Router();

  router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params;
    try {
      const data = await PlusService.getUser(userId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export { plus };
