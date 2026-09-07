import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Note: In client-side mode, or if Turso credentials are not present,
// the application should fallback to using local storage.
// The Drizzle setup here is intended for server-side usage or when Turso is available.

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
