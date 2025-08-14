// /** @type { import("drizzle-kit").Config } */
// export default {
//     schema: "./utils/schema.js",
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: 'postgresql://accounts_owner:npg_Y2IHMjPD7oug@ep-ancient-resonance-a8lesnlf-pooler.eastus2.azure.neon.tech/accounts?sslmode=require'
//     }
// };
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
           url: 'postgresql://accounts_owner:npg_Y2IHMjPD7oug@ep-ancient-resonance-a8lesnlf-pooler.eastus2.azure.neon.tech/accounts?sslmode=require'
         }
});
