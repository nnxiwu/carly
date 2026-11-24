import { Pool, types } from "pg";

// Return `date` columns as "YYYY-MM-DD" strings instead of JS Date objects.
types.setTypeParser(types.builtins.DATE, (value) => value);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({ connectionString });