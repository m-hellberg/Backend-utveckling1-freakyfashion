import fs from "fs";
import Database from "better-sqlite3";
import path from "path";

const __dirname = path.resolve();
const dbPath = path.join(__dirname, "freakyfashion.db");
const sqlPath = path.join(__dirname, "db.sql");

if (fs.existsSync(dbPath)) {
  console.log("Databas finns redan. Ingen åtgärd behövs.");
  process.exit(0);
}

const sql = fs.readFileSync(sqlPath, "utf8");

const db = new Database(dbPath);

try {
  db.exec(sql);
  console.log("Databas skapad: freakyfashion.db");
} catch (err) {
  console.error("Kunde inte köra SQL:", err);
} finally {
  db.close();
}