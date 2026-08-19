import { Router } from "express";
import { pool } from "../db.js";
import { findOrCreateUser } from "../findOrCreateUser.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

function daysBetween(start, end) {
  const ms = new Date(end) - new Date(start);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// POST /api/bookings
router.post("/", asyncHandler(async (req, res) => {
  const { car_id, name, email, start_date, end_date } = req.body;

  if (!car_id || !name || !start_date || !end_date) {
    return res.status(400).json({ error: "car_id, name, start_date, and end_date are required." });
  }
  if (!email) {
    return res.status(400).json({ error: "email is required to identify the renter." });
  }

  const days = daysBetween(start_date, end_date);
  if (days <= 0) {
    return res.status(400).json({ error: "end_date must be after start_date." });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock the car row so two simultaneous requests for the same car
    // serialize here instead of both reading a "no overlap" world.
    const [carRows] = await conn.query("SELECT id, price_per_day FROM cars WHERE id = ? FOR UPDATE", [
      car_id,
    ]);
    const car = carRows[0];
    if (!car) {
      await conn.rollback();
      return res.status(404).json({ error: "Car not found." });
    }

    const renterId = await findOrCreateUser(conn, { name, email, role: "renter" });

    const [overlaps] = await conn.query(
      `SELECT id FROM bookings
       WHERE car_id = ?
         AND status = 'confirmed'
         AND NOT (end_date <= ? OR start_date >= ?)`,
      [car_id, start_date, end_date]
    );

    const totalPrice = Number(car.price_per_day) * days;
    const finalStatus = overlaps.length === 0 ? "confirmed" : "rejected";

    const [insertResult] = await conn.query(
      `INSERT INTO bookings (car_id, renter_id, start_date, end_date, total_price, status)
       VALUES (?, ?, ?, ?, ?, 'requested')`,
      [car_id, renterId, start_date, end_date, totalPrice]
    );

    await conn.query("UPDATE bookings SET status = ? WHERE id = ?", [
      finalStatus,
      insertResult.insertId,
    ]);

    await conn.commit();

    res.status(201).json({
      id: insertResult.insertId,
      car_id: Number(car_id),
      start_date,
      end_date,
      total_price: totalPrice,
      status: finalStatus,
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}));

export default router;
