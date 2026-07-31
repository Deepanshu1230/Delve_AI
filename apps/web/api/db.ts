import { PrismaClient } from "./prisma/generated/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";


const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL! 
});

// 2. Pass the pool instance into the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Export the connected client
export const prisma = new PrismaClient({
  adapter,
});