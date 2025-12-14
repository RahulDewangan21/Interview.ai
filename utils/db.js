import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance = null;

// Create DB instance only when needed (runtime), not during build
export function getDb() {
    if (dbInstance) return dbInstance;

    const url = process.env.DATABASE_URL;
    
    if (!url) {
        throw new Error("DATABASE_URL is missing");
    }

    const sql = neon(url);
    dbInstance = drizzle(sql, { schema });
    return dbInstance;
}
