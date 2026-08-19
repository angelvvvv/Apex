import bcrypt from "bcrypt";
import { pool } from "./db.js";

const ADMIN_EMAIL = "admin@apex.demo";
const ADMIN_PASSWORD = "ApexAdmin123!"; // placeholder — see README, change in production

const OWNERS = [
  { name: "Marcus Whitfield", email: "marcus.whitfield@apex.demo" },
  { name: "Elena Rossi", email: "elena.rossi@apex.demo" },
  { name: "James Okafor", email: "james.okafor@apex.demo" },
];

const CARS = [
  {
    owner: 0,
    make: "Ferrari",
    model: "488 Pista",
    year: 2021,
    engine: "3.9L Twin-Turbo V8",
    power: "710 hp",
    mileage: 3200,
    city: "Miami, FL",
    price_per_day: 1899,
    description:
      "Track-bred Ferrari with the naturally-aspirated soul of the 458 and the shove of forced induction. Immaculate, single owner.",
    image_url: "/images/ferrari-488-pista.jpg",
  },
  {
    owner: 0,
    make: "Lamborghini",
    model: "Huracan EVO",
    year: 2022,
    engine: "5.2L V10",
    power: "631 hp",
    mileage: 4100,
    city: "Miami, FL",
    price_per_day: 1699,
    description:
      "Naturally-aspirated V10 theatre. Rear-wheel steering and Lamborghini Dinamica Veicolo Integrata make this as usable as it is loud.",
    image_url: "/images/lamborghini-huracan-evo.jpg",
  },
  {
    owner: 1,
    make: "McLaren",
    model: "720S",
    year: 2020,
    engine: "4.0L Twin-Turbo V8",
    power: "710 hp",
    mileage: 5600,
    city: "Los Angeles, CA",
    price_per_day: 1799,
    description:
      "Carbon-tub supercar with a drag coefficient built for lap times, not just looks. Dihedral doors, butter-smooth dual-clutch gearbox.",
    image_url: "/images/mclaren-720s.jpg",
  },
  {
    owner: 1,
    make: "Porsche",
    model: "911 Turbo S",
    year: 2023,
    engine: "3.7L Twin-Turbo Flat-6",
    power: "640 hp",
    mileage: 1800,
    city: "Los Angeles, CA",
    price_per_day: 999,
    description:
      "The everyday supercar. All-wheel drive, launch control, and enough composure to make 200 mph feel routine.",
    image_url: "/images/porsche-911-turbo-s.jpg",
  },
  {
    owner: 2,
    make: "Rolls-Royce",
    model: "Wraith",
    year: 2019,
    engine: "6.6L Twin-Turbo V12",
    power: "624 hp",
    mileage: 7200,
    city: "New York, NY",
    price_per_day: 1499,
    description:
      "The fastest, most powerful Rolls-Royce ever built at launch. A coupe that whispers rather than shouts.",
    image_url: "/images/rolls-royce-wraith.jpg",
  },
  {
    owner: 2,
    make: "Aston Martin",
    model: "DB11",
    year: 2021,
    engine: "4.0L Twin-Turbo V8",
    power: "503 hp",
    mileage: 4900,
    city: "New York, NY",
    price_per_day: 1099,
    description:
      "Grand tourer proportions with a hand-finished cabin. Effortless motorway miles, sharp enough for the canyon roads too.",
    image_url: "/images/aston-martin-db11.jpg",
  },
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await conn.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin'`,
      ["Apex Admin", ADMIN_EMAIL, passwordHash]
    );
    console.log("Seeded admin user:", ADMIN_EMAIL);

    const ownerIds = [];
    for (const owner of OWNERS) {
      const [result] = await conn.query(
        `INSERT INTO users (name, email, role)
         VALUES (?, ?, 'owner')
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [owner.name, owner.email]
      );
      const id = result.insertId || (await conn.query("SELECT id FROM users WHERE email = ?", [owner.email]))[0][0].id;
      ownerIds.push(id);
    }
    console.log("Seeded owners:", ownerIds);

    const [[{ count }]] = await conn.query("SELECT COUNT(*) as count FROM cars");
    if (count > 0) {
      console.log(`${count} car(s) already present — backfilling image_url by make/model instead of re-inserting.`);
      for (const car of CARS) {
        await conn.query("UPDATE cars SET image_url = ? WHERE make = ? AND model = ? AND image_url IS NULL", [
          car.image_url,
          car.make,
          car.model,
        ]);
      }
    } else {
      for (const car of CARS) {
        await conn.query(
          `INSERT INTO cars
             (owner_id, make, model, year, engine, power, mileage, city, price_per_day, description, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ownerIds[car.owner],
            car.make,
            car.model,
            car.year,
            car.engine,
            car.power,
            car.mileage,
            car.city,
            car.price_per_day,
            car.description,
            car.image_url,
          ]
        );
      }
      console.log(`Seeded ${CARS.length} cars.`);
    }

    console.log("\nAdmin login -> email:", ADMIN_EMAIL, " password:", ADMIN_PASSWORD);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
