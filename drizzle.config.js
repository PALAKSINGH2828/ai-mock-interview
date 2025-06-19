import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials : {
    url : 'postgresql://neondb_owner:npg_IWi8CT7kdMPw@ep-young-cell-a8pp6k0v-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'
  }
});
