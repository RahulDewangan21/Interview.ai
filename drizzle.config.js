// /** @type { import("drizzle-kit").Config } */
// export default {
//     schema: "./utils/schema.js",
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL
//     }
// };
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL
  }
});

