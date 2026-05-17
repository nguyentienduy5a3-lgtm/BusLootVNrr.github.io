import { Router } from "express";
import { db, usersTable, ridesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { StartRideBody } from "@workspace/api-zod";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";

const router = Router();

router.post("/start", requireAuth, async (req, res) => {
  const parsed = StartRideBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const userId: number = (req as any).userId;
  const { route, pickup, destination } = parsed.data;

  const [ride] = await db.insert(ridesTable).values({ userId, route, pickup, destination }).returning();
  return res.json({ rideId: ride.id, route: ride.route, pickup: ride.pickup, destination: ride.destination });
});

router.post("/complete", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const user: typeof usersTable.$inferSelect = (req as any).user;

  const today = new Date().toISOString().slice(0, 10);
  const lastRide = user.lastRideDate;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  let newStreak = user.streak;
  if (lastRide === today) {
    // already rode today, still count ride but no extra streak
  } else if (lastRide === yesterday) {
    newStreak = user.streak + 1;
  } else {
    newStreak = 1;
  }

  const [updated] = await db.update(usersTable).set({
    rideCount: user.rideCount + 1,
    streak: newStreak,
    availableRolls: user.availableRolls + 1,
    lastRideDate: today,
  }).where(eq(usersTable.id, userId)).returning();

  return res.json(userToResponse(updated));
});

export { router as rideRouter };
