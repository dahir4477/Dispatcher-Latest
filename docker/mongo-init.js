// Runs on first DB init (empty /data/db). Uses LF line endings — CRLF breaks mongosh on Linux.
db = db.getSiblingDB("dispatch");

try {
  db.createCollection("early_access_leads");
} catch (e) {
  // collection may already exist
}
db.early_access_leads.createIndex({ email: 1 }, { unique: true });
