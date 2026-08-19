import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();
router.use(requireAdmin);

// --- Cars -------------------------------------------------------------

router.put(
  "/cars/:id",
  asyncHandler(async (req, res) => {
    const fields = ["make", "model", "year", "engine", "power", "mileage", "city", "price_per_day", "description", "image_url"];
    const updates = fields.filter((f) => req.body[f] !== undefined);

    if (updates.length === 0) {
      return res.status(400).json({ error: "No updatable fields provided." });
    }

    const setClause = updates.map((f) => `${f} = ?`).join(", ");
    const values = updates.map((f) => req.body[f]);

    const [result] = await pool.query(`UPDATE cars SET ${setClause} WHERE id = ?`, [
      ...values,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found." });
    }
    res.json({ updated: true });
  })
);

router.delete(
  "/cars/:id",
  asyncHandler(async (req, res) => {
    const [result] = await pool.query("DELETE FROM cars WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found." });
    }
    res.json({ deleted: true });
  })
);

// --- Bookings -----------------------------------------------------------

router.get(
  "/bookings",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT bookings.*, cars.make, cars.model, users.name AS renter_name, users.email AS renter_email
       FROM bookings
       JOIN cars ON cars.id = bookings.car_id
       JOIN users ON users.id = bookings.renter_id
       ORDER BY bookings.created_at DESC`
    );
    res.json(rows);
  })
);

router.put(
  "/bookings/:id",
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ["requested", "confirmed", "rejected", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });
    }

    const [result] = await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.json({ updated: true });
  })
);

router.delete(
  "/bookings/:id",
  asyncHandler(async (req, res) => {
    const [result] = await pool.query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }
    res.json({ deleted: true });
  })
);

// --- Users ----------------------------------------------------------------

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id ASC"
    );
    res.json(rows);
  })
);

router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ deleted: true });
  })
);

export default router;
