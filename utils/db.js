import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let db;

// Export a ready-to-use db but initialized only when first accessed
function initDb() {
  if (!db) {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error("DATABASE_URL is missing");
    }

    const sql = neon(url);
    db = drizzle(sql, { schema });
  }

  return db;
}

export { initDb as db };

