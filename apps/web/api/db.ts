import { PrismaClient } from "./prisma/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Initialize the pg Pool with your environment variable

console.log("DB URL IS:", process.env.DATABASE_URL); 
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL! 
});

// 2. Pass the pool instance into the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Export the connected client
export const prisma = new PrismaClient({
  adapter,
});