-- Apex schema. Run once against the Railway MySQL database (see README).
--
-- Note: `password_hash` on `users` is an addition beyond the base spec —
-- it's required so admin accounts have something to authenticate against.
-- It's nullable because renter/owner rows are created implicitly (by name
-- + email) when someone books a car or lists one, and never log in.

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  role ENUM('renter', 'owner', 'admin') NOT NULL DEFAULT 'renter',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  engine VARCHAR(255),
  power VARCHAR(100),
  mileage INT,
  city VARCHAR(150),
  price_per_day DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cars_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE cars ADD COLUMN image_url VARCHAR(500) NULL;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  car_id INT NOT NULL,
  renter_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('requested', 'confirmed', 'rejected', 'completed') NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_car FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_renter FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_cars_owner ON cars(owner_id);
CREATE INDEX idx_bookings_car ON bookings(car_id);
CREATE INDEX idx_bookings_renter ON bookings(renter_id);
