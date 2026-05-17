import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
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
    (req as any).userId = user.id;
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
