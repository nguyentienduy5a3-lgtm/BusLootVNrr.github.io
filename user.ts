import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpdateProfileBody } from "@workspace/api-zod";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";

const router = Router();

router.patch("/profile", requireAuth, async (req, res) => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const userId: number = (req as any).userId;
  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, userId)).returning();
  return res.json(userToResponse(user));
});

export { router as userRouter };
