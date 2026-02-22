import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Strip channel_binding param — the Neon serverless driver uses HTTP/WebSocket
// and does not support the channel_binding option. Leaving it in causes errors.
function sanitizeDatabaseUrl(url: string): string {
  const u = new URL(url);
  u.searchParams.delete("channel_binding");
  return u.toString();
}

const sql = neon(sanitizeDatabaseUrl(process.env.DATABASE_URL!));
export const db = drizzle(sql, { schema });
