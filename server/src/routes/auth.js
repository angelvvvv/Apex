import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email]
  );
  const user = rows[0];

  if (!user || !user.password_hash) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Only admin accounts can log in." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}));

export default router;
