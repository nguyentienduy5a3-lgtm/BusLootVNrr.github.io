import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";
import { spinWheel } from "../lib/stickers";

const router = Router();

router.post("/spin", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const user: typeof usersTable.$inferSelect = (req as any).user;

  const today = new Date().toISOString().slice(0, 10);
  let spinsLeft = user.dailyWheelSpins;
  if (user.lastWheelDate !== today) {
    spinsLeft = 3;
  }

  if (spinsLeft <= 0) {
    return res.status(400).json({ error: "No spins remaining today" });
  }

  const result = spinWheel();
  let updates: Partial<typeof usersTable.$inferSelect> = {
    dailyWheelSpins: spinsLeft - 1,
    lastWheelDate: today,
  };

  if (result.prize === "roll") updates.availableRolls = user.availableRolls + 1;
  else if (result.prize === "roll2") updates.availableRolls = user.availableRolls + 2;
  else if (result.prize === "roll3") updates.availableRolls = user.availableRolls + 3;
  else if (result.prize === "streak") updates.streak = user.streak + 1;
  else if (result.prize === "pity_reset") {
    updates.pityCounter = 0;
    updates.pityActive = false;
    updates.availableRolls = user.availableRolls + 1;
  }

  const [updated] = await db.update(usersTable).set(updates as any).where(eq(usersTable.id, userId)).returning();

  return res.json({
    prize: result.prize,
    label: result.label,
    spinsRemaining: updated.dailyWheelSpins,
    user: userToResponse(updated),
  });
});

export { router as wheelRouter };
