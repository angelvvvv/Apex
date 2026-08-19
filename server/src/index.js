import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import carsRouter from "./routes/cars.js";
import ownersRouter from "./routes/owners.js";
import bookingsRouter from "./routes/bookings.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/cars", carsRouter);
app.use("/api/owners", ownersRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Apex API listening on http://localhost:${port}`));
