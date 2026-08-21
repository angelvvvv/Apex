import { Link } from "react-router-dom";
import BrandCrest from "./BrandCrest.jsx";
import { useReveal } from "../useReveal.js";

export default function CarCard({ car, index = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <Link
      to={`/cars/${car.id}`}
      ref={ref}
      className={`lot-card${visible ? " in-view" : ""}`}
      style={{ transitionDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="lot-photo">
        {car.image_url && (
          <div className="lot-photo-img" style={{ backgroundImage: `url(${car.image_url})` }} />
        )}
        {!car.image_url && (
          <div className="lot-photo-fallback">
            {car.make} {car.model}
          </div>
        )}
        <div className="lot-photo-scrim" />
        <span className="lot-number">Lot {String(car.id).padStart(3, "0")}</span>
        <span className="lot-crest">
          <BrandCrest make={car.make} size={40} />
        </span>
        <span className="lot-view-cta">View Lot →</span>
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
