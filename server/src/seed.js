import bcrypt from "bcrypt";
import { pool } from "./db.js";

const ADMIN_EMAIL = "admin@apex.demo";
const ADMIN_PASSWORD = "ApexAdmin123!"; // placeholder — see README, change in production

const OWNERS = [
  { name: "Marcus Whitfield", email: "marcus.whitfield@apex.demo" },
  { name: "Elena Rossi", email: "elena.rossi@apex.demo" },
  { name: "James Okafor", email: "james.okafor@apex.demo" },
  { name: "Priya Anand", email: "priya.anand@apex.demo" },
  { name: "Diego Fernandez", email: "diego.fernandez@apex.demo" },
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
  {
    owner: 3,
    make: "Bugatti",
    model: "Chiron",
    year: 2020,
    engine: "8.0L Quad-Turbo W16",
    power: "1479 hp",
    mileage: 900,
    city: "Las Vegas, NV",
    price_per_day: 4999,
    description:
      "The pinnacle of automotive engineering. A quad-turbo W16 built for a 261 mph top speed, and a cabin trimmed like a private jet.",
    image_url: "/images/bugatti-chiron.jpg",
  },
  {
    owner: 3,
    make: "Bentley",
    model: "Continental GT",
    year: 2022,
    engine: "4.0L Twin-Turbo V8",
    power: "542 hp",
    mileage: 3400,
    city: "Chicago, IL",
    price_per_day: 1299,
    description:
      "Hand-stitched leather, cut diamond dashboard details, and a twin-turbo V8 that hustles this grand tourer with real urgency.",
    image_url: "/images/bentley-continental-gt.jpg",
  },
  {
    owner: 4,
    make: "Mercedes-AMG",
    model: "GT Black Series",
    year: 2022,
    engine: "4.0L Twin-Turbo V8",
    power: "720 hp",
    mileage: 2100,
    city: "Austin, TX",
    price_per_day: 1899,
    description:
      "AMG's most extreme road car. Motorsport-derived aero, a flat-plane-crank V8, and a Nürburgring lap record to prove it.",
    image_url: "/images/mercedes-amg-gt.jpg",
  },
  {
    owner: 4,
    make: "Audi",
    model: "R8",
    year: 2018,
    engine: "5.2L V10",
    power: "602 hp",
    mileage: 6200,
    city: "San Francisco, CA",
    price_per_day: 1099,
    description:
      "Naturally-aspirated V10 shared with the Huracan, wrapped in Audi's understated everyday-usable shell. Quattro all-wheel drive included.",
    image_url: "/images/audi-r8.jpg",
  },
  {
    owner: 4,
    make: "Maserati",
    model: "MC20",
    year: 2022,
    engine: "3.0L Twin-Turbo V6",
    power: "621 hp",
    mileage: 2800,
    city: "Scottsdale, AZ",
    price_per_day: 1599,
    description:
      "Butterfly doors and an in-house Nettuno V6 with F1-derived pre-chamber combustion. Maserati's return to true supercar form.",
    image_url: "/images/maserati-mc20.jpg",
  },
  {
    owner: 3,
    make: "Pagani",
    model: "Huayra",
    year: 2019,
    engine: "6.0L Twin-Turbo V12",
    power: "730 hp",
    mileage: 1200,
    city: "Denver, CO",
    price_per_day: 6999,
    description:
      "Hand-built in Modena with active aero flaps and a Mercedes-AMG-sourced V12. Fewer than 100 made — a rolling sculpture.",
    image_url: "/images/pagani-huayra.jpg",
  },
  {
    owner: 3,
    make: "Koenigsegg",
    model: "Jesko",
    year: 2021,
    engine: "5.0L Twin-Turbo V8",
    power: "1280 hp",
    mileage: 600,
    city: "Seattle, WA",
    price_per_day: 7999,
    description:
      "Swedish engineering with a top-speed target north of 300 mph and a 9-speed multi-clutch gearbox unlike anything else on sale.",
    image_url: "/images/koenigsegg-jesko.jpg",
  },
  {
    owner: 4,
    make: "Nissan",
    model: "GT-R",
    year: 2020,
    engine: "3.8L Twin-Turbo V6",
    power: "565 hp",
    mileage: 12400,
    city: "Dallas, TX",
    price_per_day: 799,
    description:
      "Godzilla. All-wheel drive launch control and a dual-clutch gearbox that make supercar pace approachable — and much easier on the wallet.",
    image_url: "/images/nissan-gtr.jpg",
  },
  {
    owner: 4,
    make: "Ferrari",
    model: "SF90 Stradale",
    year: 2022,
    engine: "4.0L Twin-Turbo V8 Hybrid",
    power: "986 hp",
    mileage: 1900,
    city: "Nashville, TN",
    price_per_day: 2499,
    description:
      "Ferrari's first series-production plug-in hybrid. Three electric motors plus a twin-turbo V8 for a combined 986 hp and AWD.",
    image_url: "/images/ferrari-sf90-stradale.jpg",
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

    let inserted = 0;
    let backfilled = 0;
    for (const car of CARS) {
      const [existing] = await conn.query("SELECT id, image_url FROM cars WHERE make = ? AND model = ?", [
        car.make,
        car.model,
      ]);

      if (existing.length === 0) {
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
        inserted += 1;
      } else if (!existing[0].image_url) {
        await conn.query("UPDATE cars SET image_url = ? WHERE id = ?", [car.image_url, existing[0].id]);
        backfilled += 1;
      }
    }
    console.log(`Inserted ${inserted} new car(s), backfilled image_url on ${backfilled}.`);

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
