import { Router } from "express";
import { pool } from "../db.js";
import { findOrCreateUser } from "../findOrCreateUser.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

// GET /api/cars?make=&city=&minPrice=&maxPrice=
router.get("/", asyncHandler(async (req, res) => {
  const { make, city, minPrice, maxPrice } = req.query;
  const clauses = [];
  const params = [];

  if (make) {
    clauses.push("cars.make LIKE ?");
    params.push(`%${make}%`);
  }
  if (city) {
    clauses.push("cars.city LIKE ?");
    params.push(`%${city}%`);
  }
  if (minPrice) {
    clauses.push("cars.price_per_day >= ?");
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    clauses.push("cars.price_per_day <= ?");
    params.push(Number(maxPrice));
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT cars.*, users.name AS owner_name
     FROM cars
     JOIN users ON users.id = cars.owner_id
     ${where}
     ORDER BY cars.id ASC`,
    params
  );
  res.json(rows);
}));

// GET /api/cars/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT cars.*, users.name AS owner_name, users.email AS owner_email
     FROM cars
     JOIN users ON users.id = cars.owner_id
     WHERE cars.id = ?`,
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Car not found." });
  }
  res.json(rows[0]);
}));

// POST /api/cars
router.post("/", asyncHandler(async (req, res) => {
  const {
    owner_name,
    owner_email,
    make,
    model,
    year,
    engine,
    power,
    mileage,
    city,
    price_per_day,
    description,
    image_url,
  } = req.body;

  if (!owner_name || !owner_email || !make || !model || !year || !price_per_day) {
    return res.status(400).json({
      error: "owner_name, owner_email, make, model, year, and price_per_day are required.",
    });
  }

  const conn = await pool.getConnection();
  try {
    const ownerId = await findOrCreateUser(conn, {
      name: owner_name,
      email: owner_email,
      role: "owner",
    });

    const [result] = await conn.query(
      `INSERT INTO cars
         (owner_id, make, model, year, engine, power, mileage, city, price_per_day, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerId, make, model, year, engine, power, mileage || null, city, price_per_day, description, image_url || null]
    );

    res.status(201).json({ id: result.insertId, owner_id: ownerId });
  } finally {
    conn.release();
  }
}));

export default router;
