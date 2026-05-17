import { Router } from "express";
import { db, usersTable, inventoryTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const schoolFilter = req.query.school as string | undefined;

  const users = await db.select().from(usersTable);
  const inventoryCounts = await db
    .select({ userId: inventoryTable.userId, total: sql<number>`sum(${inventoryTable.count})` })
    .from(inventoryTable)
    .groupBy(inventoryTable.userId);

  const countMap = new Map(inventoryCounts.map(i => [i.userId, Number(i.total) || 0]));

  let filtered = users;
  if (schoolFilter && schoolFilter !== "all") {
    filtered = users.filter(u => u.school === schoolFilter);
  }

  const leaderboard = filtered
    .map((u, _) => ({
      username: u.username,
      school: u.school,
      rideCount: u.rideCount,
      stickerCount: countMap.get(u.id) || 0,
      points: u.rideCount * 10 + (countMap.get(u.id) || 0) * 5,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 50)
    .map((entry, i) => ({ rank: i + 1, ...entry }));

  return res.json(leaderboard);
});

router.get("/summary", async (_req, res) => {
  const users = await db.select().from(usersTable);
  const totalRides = users.reduce((sum, u) => sum + u.rideCount, 0);
  const totalUsers = users.length;

  const dropCounts = await db
    .select({ rarity: inventoryTable.rarity, total: sql<number>`sum(${inventoryTable.count})` })
    .from(inventoryTable)
    .groupBy(inventoryTable.rarity);

  const totalDropped = dropCounts.reduce((sum, r) => sum + Number(r.total), 0);
  const rarityOrder = ["impossible", "secret", "mythic", "legendary", "epic", "rare", "uncommon", "common"];
  let topRarity = "common";
  for (const r of rarityOrder) {
    if (dropCounts.find(d => d.rarity === r && Number(d.total) > 0)) {
      topRarity = r;
      break;
    }
  }

  return res.json({ totalUsers, totalRides, totalStickersDropped: totalDropped, topRarity });
});

export { router as leaderboardRouter };
