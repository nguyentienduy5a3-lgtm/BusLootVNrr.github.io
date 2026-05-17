import { Router } from "express";
import { db, usersTable, inventoryTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";
import { rollRarity, getRandomSticker } from "../lib/stickers";

const router = Router();

router.post("/open", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const user: typeof usersTable.$inferSelect = (req as any).user;

  if (user.availableRolls <= 0) {
    return res.status(400).json({ error: "No rolls available" });
  }

  const rarity = rollRarity(user.pityCounter, user.pityActive);
  const sticker = getRandomSticker(rarity);

  const newPityCounter = rarity === "impossible" ? 0 : user.pityCounter + 1;
  const newPityActive = rarity !== "impossible" && newPityCounter >= 10;

  const [updated] = await db.update(usersTable).set({
    availableRolls: user.availableRolls - 1,
    pityCounter: newPityCounter,
    pityActive: newPityActive,
  }).where(eq(usersTable.id, userId)).returning();

  // Upsert inventory
  const [existing] = await db.select().from(inventoryTable)
    .where(and(eq(inventoryTable.userId, userId), eq(inventoryTable.stickerId, sticker.id)))
    .limit(1);

  let isNew = false;
  if (existing) {
    await db.update(inventoryTable).set({ count: existing.count + 1 }).where(eq(inventoryTable.id, existing.id));
  } else {
    isNew = true;
    await db.insert(inventoryTable).values({
      userId,
      stickerId: sticker.id,
      stickerName: sticker.name,
      stickerIcon: sticker.icon,
      stickerDesc: sticker.desc,
      rarity,
    });
  }

  return res.json({
    stickerId: sticker.id,
    stickerName: sticker.name,
    stickerIcon: sticker.icon,
    stickerDesc: sticker.desc,
    rarity,
    isNew,
    user: userToResponse(updated),
  });
});

export { router as capsuleRouter };
