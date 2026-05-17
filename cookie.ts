import { Router } from "express";
import { FORTUNE_COOKIES } from "../lib/stickers";

const router = Router();

router.post("/open", async (_req, res) => {
  const fortune = FORTUNE_COOKIES[Math.floor(Math.random() * FORTUNE_COOKIES.length)];
  return res.json({ fortune });
});

export { router as cookieRouter };
