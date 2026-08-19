import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      try {
        await conn.query(statement);
        console.log("OK:", statement.split("\n")[0].slice(0, 70));
      } catch (err) {
        // Re-running the migration is safe for tables (IF NOT EXISTS), but
        // plain CREATE INDEX / ADD COLUMN has no such guard — skip if it already exists.
        if (err.code === "ER_DUP_KEYNAME" || err.code === "ER_DUP_FIELDNAME") {
          console.log("Skip (already exists):", statement.split("\n")[0].slice(0, 70));
        } else {
          throw err;
        }
      }
    }
    console.log("Migration complete.");
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
