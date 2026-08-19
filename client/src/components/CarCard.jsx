import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className="lot-card">
      <div className="lot-photo">
        <span className="lot-number">Lot {String(car.id).padStart(3, "0")}</span>
        {car.make} {car.model}
      </div>
      <div className="lot-body">
        <h3>
          {car.year} {car.make} {car.model}
        </h3>
        <div className="lot-spec">
          {car.power || "—"} · {car.city || "Location TBD"}
        </div>
        <div className="lot-price">
          <span>Per Day</span>
          <strong>${Number(car.price_per_day).toLocaleString()}</strong>
        </div>
      </div>
    </Link>
  );
}
