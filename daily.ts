import { Router } from "express";
import { db, usersTable, dailyClaimsTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";

const router = Router();

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAILY_REWARDS = ["🎁", "⭐", "🎁", "🌟", "🎁", "💫", "🎆"];

function getWeekDates(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

router.get("/status", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const weekDates = getWeekDates();
  const today = new Date().toISOString().slice(0, 10);

  const claims = await db.select().from(dailyClaimsTable)
    .where(and(eq(dailyClaimsTable.userId, userId), gte(dailyClaimsTable.claimedDate, weekDates[0])));

  const claimedDates = new Set(claims.map(c => c.claimedDate));

  const days = weekDates.map((date, i) => ({
    dayLabel: DAY_LABELS[i],
    date,
    claimed: claimedDates.has(date),
    isToday: date === today,
    reward: DAILY_REWARDS[i],
  }));

  return res.json({
    days,
    claimedToday: claimedDates.has(today),
    streakCount: claims.length,
  });
});

router.post("/claim", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const user: typeof usersTable.$inferSelect = (req as any).user;
  const today = new Date().toISOString().slice(0, 10);

  if (user.lastDailyDate === today) {
    return res.status(400).json({ error: "Already claimed today" });
  }

  await db.insert(dailyClaimsTable).values({ userId, claimedDate: today, reward: "+1 roll" });

  const [updated] = await db.update(usersTable).set({
    availableRolls: user.availableRolls + 1,
    lastDailyDate: today,
  }).where(eq(usersTable.id, userId)).returning();

  return res.json(userToResponse(updated));
});

export { router as dailyRouter };
