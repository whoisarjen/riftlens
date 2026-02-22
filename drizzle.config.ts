import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local first (Next.js convention), then fall back to .env
config({ path: ".env.local" });
config({ path: ".env" });

// Strip channel_binding param that causes issues with neon-serverless driver
const rawUrl = process.env.DATABASE_URL!;
const dbUrl = rawUrl.replace(/[?&]channel_binding=[^&]*/g, "").replace(/\?$/, "");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
