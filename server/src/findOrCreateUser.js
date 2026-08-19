// Renters and owners aren't required to have accounts up front in this demo —
// booking a car or listing one just needs a name + email, and we find-or-create
// the underlying `users` row so bookings/cars can still FK to a real user.
export async function findOrCreateUser(conn, { name, email, role }) {
  const [existing] = await conn.query("SELECT id, role FROM users WHERE email = ?", [email]);
  if (existing[0]) {
    return existing[0].id;
  }
  const [result] = await conn.query(
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
    [name, email, role]
  );
  return result.insertId;
}
