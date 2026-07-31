import { Request, Response, NextFunction } from "express";
import { createSupabaseClient } from "./client.js";
import { prisma } from "./db.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const client = createSupabaseClient();

export async function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const userId = data.user.id;

  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        supabaseId: userId,
        email: data.user.email!,
        provider: data.user.app_metadata.provider === "google" ? "Google" : "Github",
        name: data.user.user_metadata.full_name ?? data.user.email!.split("@")[0],
      },
    });
  } catch (e) {
    console.error("Failed to upsert user:", e);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  req.userId = userId;
  next();
}