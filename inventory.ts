import { Router } from "express";
import { db, usersTable, inventoryTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { userToResponse } from "./auth";
import { requireAuth } from "./middleware";
import { RARITY_ORDER, getRandomSticker } from "../lib/stickers";
import { TradeStickerUpBody } from "@workspace/api-zod";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId: number = (req as any).userId;
  const items = await db.select().from(inventoryTable).where(eq(inventoryTable.userId, userId));
  const sorted = items.sort((a, b) => {
    const ai = RARITY_ORDER.indexOf(a.rarity);
    const bi = RARITY_ORDER.indexOf(b.rarity);
    return ai - bi;
  });
  return res.json(sorted.map(item => ({
    stickerId: item.stickerId,
    stickerName: item.stickerName,
    stickerIcon: item.stickerIcon,
    stickerDesc: item.stickerDesc,
    rarity: item.rarity,
    count: item.count,
  })));
});

router.post("/trade", requireAuth, async (req, res) => {
  const parsed = TradeStickerUpBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const userId: number = (req as any).userId;
  const { stickerId, rarity } = parsed.data;

  const [item] = await db.select().from(inventoryTable)
    .where(and(eq(inventoryTable.userId, userId), eq(inventoryTable.stickerId, stickerId)))
    .limit(1);

  if (!item || item.count < 2) {
    return res.status(400).json({ error: "Need at least 2 of this sticker to trade" });
  }

  // Remove 2 of the sticker
  if (item.count === 2) {
    await db.delete(inventoryTable).where(eq(inventoryTable.id, item.id));
  } else {
    await db.update(inventoryTable).set({ count: item.count - 2 }).where(eq(inventoryTable.id, item.id));
  }

  // Get the next rarity up
  const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "secret"];
  const currentIndex = rarityOrder.indexOf(rarity);
  const nextRarity = currentIndex < rarityOrder.length - 1 ? rarityOrder[currentIndex + 1] : "mythic";
  const newSticker = getRandomSticker(nextRarity);

  // Add to inventory
  const [existing] = await db.select().from(inventoryTable)
    .where(and(eq(inventoryTable.userId, userId), eq(inventoryTable.stickerId, newSticker.id)))
    .limit(1);

  let isNew = false;
  if (existing) {
    await db.update(inventoryTable).set({ count: existing.count + 1 }).where(eq(inventoryTable.id, existing.id));
  } else {
    isNew = true;
    await db.insert(inventoryTable).values({
      userId,
      stickerId: newSticker.id,
      stickerName: newSticker.name,
      stickerIcon: newSticker.icon,
      stickerDesc: newSticker.desc,
      rarity: nextRarity,
    });
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

  return res.json({
    stickerId: newSticker.id,
    stickerName: newSticker.name,
    stickerIcon: newSticker.icon,
    stickerDesc: newSticker.desc,
    rarity: nextRarity,
    isNew,
    user: userToResponse(user),
  });
});

export { router as inventoryRouter };
