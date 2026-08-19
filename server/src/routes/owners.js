import { Router } from "express";
import { pool } from "../db.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

// GET /api/owners/:id/cars
router.get(
  "/:id/cars",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM cars WHERE owner_id = ? ORDER BY id ASC", [
      req.params.id,
    ]);
    res.json(rows);
  })
);

export default router;
