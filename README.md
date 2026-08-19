# Apex — Fine Motorcar Rentals

A peer-to-peer rental marketplace for exotic cars. Monorepo with a React (Vite) front end
in `/client` and a Node/Express REST API in `/server`, backed by MySQL.

## Stack

- **Client:** React + Vite, React Router, plain CSS (no UI framework)
- **Server:** Node.js + Express, REST API, JWT auth for admin, bcrypt for password hashing
- **Database:** MySQL, hosted on [Railway](https://railway.app)

## 1. Provision the database on Railway

1. Sign up at [railway.app](https://railway.app), create a new project, and choose
   **New Project → Provision MySQL**. No extra configuration is needed.
2. Open the MySQL service's **Variables** (or **Connect**) tab and copy these five values:
   `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`.

Optional: install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (or any MySQL
GUI) and connect using the same five values if you want to browse the schema/data visually.

## 2. Configure environment variables

`server/.env` currently has **placeholder values** — the app will not be able to reach a
database until you replace them:

```
MYSQLHOST=...
MYSQLUSER=...
MYSQLPASSWORD=...
MYSQLDATABASE=...
MYSQLPORT=3306

JWT_SECRET=some-long-random-string
PORT=4000
```

Generate a `JWT_SECRET` any way you like, e.g.:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`client/.env.example` documents `VITE_API_URL`, which is only needed for production
builds (see the deployment section below) — local dev doesn't need it, since Vite proxies
`/api` requests to the Express server (see `client/vite.config.js`).

## 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

## 4. Create the schema and seed data

Run these from `/server` once your `.env` has real Railway credentials:

```bash
npm run migrate   # creates users / cars / bookings tables
npm run seed       # inserts 1 admin user + 3 owners + 6 sample cars
```

The seed script prints the admin login it created:

```
email:    admin@apex.demo
password: ApexAdmin123!
```

**This is a placeholder password for local/demo use only.** Change it (and re-seed, or
update the row directly) before using this anywhere real.

## 5. Run both apps in dev mode

In two terminals:

```bash
cd server && npm run dev     # http://localhost:4000
cd client && npm run dev     # http://localhost:5173
```

Visit `http://localhost:5173`. Log into `/admin/login` with the seeded admin credentials
above to reach the admin dashboard.

## Notes on the schema

The `users` table has one column beyond the original spec: `password_hash` (nullable).
It's needed so admin accounts have something to authenticate against — renters and owners
never log in in this app; a `users` row for them is created automatically (matched by
email) the first time they book or list a car.

## Project structure

```
/client        React app (Vite)
  src/pages    Collection, CarDetail, BookingConfirmed, ListCar, AdminLogin, AdminDashboard
  src/components
  src/api.js   fetch wrapper for the REST API
/server
  src/routes   cars, owners, bookings, admin, auth
  src/middleware/auth.js   JWT + admin-role check
  src/migrations/schema.sql
  src/seed.js
```

## API overview

| Method | Path                        | Auth  | Description                          |
|--------|-----------------------------|-------|---------------------------------------|
| GET    | /api/cars                   | -     | List cars (filter by make/city/price) |
| GET    | /api/cars/:id                | -     | Car detail                            |
| POST   | /api/cars                   | -     | Create a listing                      |
| GET    | /api/owners/:id/cars         | -     | An owner's listings                   |
| POST   | /api/bookings                | -     | Create a booking (transactional overlap check) |
| POST   | /api/auth/login               | -     | Admin login, returns a JWT            |
| PUT    | /api/admin/cars/:id           | admin | Edit any listing                      |
| DELETE | /api/admin/cars/:id           | admin | Delete any listing                    |
| GET    | /api/admin/bookings           | admin | All bookings                          |
| PUT    | /api/admin/bookings/:id       | admin | Change a booking's status             |
| DELETE | /api/admin/bookings/:id       | admin | Delete a booking                      |
| GET    | /api/admin/users              | admin | All users                             |
| DELETE | /api/admin/users/:id          | admin | Delete a user                         |

Admin routes require `Authorization: Bearer <token>` with a JWT for a `role: 'admin'` user.

## Deployment

See the deployment steps shared separately (Vercel for `/client`, Render for `/server`) once
the app is verified working locally.
