import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router = Router();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function userToResponse(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    username: user.username,
    school: user.school,
    nickname: user.nickname,
    bio: user.bio,
    avatar: user.avatar,
    rideCount: user.rideCount,
    streak: user.streak,
    availableRolls: user.availableRolls,
    pityCounter: user.pityCounter,
    pityActive: user.pityActive,
    dailyWheelSpins: user.dailyWheelSpins,
    lastDailyDate: user.lastDailyDate,
  };
}

router.post("/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { username, password, school } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (existing.length > 0) {
    return res.status(409).json({ error: "Username taken" });
  }

  const [user] = await db.insert(usersTable).values({
    username,
    passwordHash: hashPassword(password),
    school,
    availableRolls: 3,
  }).returning();

  const token = Buffer.from(`${user.id}:${user.username}`).toString("base64");
  return res.status(201).json({ token, user: userToResponse(user) });
});

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { username, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  if (user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const today = new Date().toISOString().slice(0, 10);
  let updatedUser = user;
  if (user.lastWheelDate !== today) {
    const [u] = await db.update(usersTable).set({ dailyWheelSpins: 3, lastWheelDate: today }).where(eq(usersTable.id, user.id)).returning();
    updatedUser = u;
  }

  const token = Buffer.from(`${updatedUser.id}:${updatedUser.username}`).toString("base64");
  return res.json({ token, user: userToResponse(updatedUser) });
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = Buffer.from(authHeader.slice(7), "base64").toString();
    const [idStr] = decoded.split(":");
    const id = parseInt(idStr);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    if (!user) return res.status(401).json({ error: "Not found" });
    return res.json(userToResponse(user));
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export { router as authRouter, userToResponse };
