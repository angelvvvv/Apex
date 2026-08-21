import { useEffect, useState } from "react";
import CarCard from "../components/CarCard.jsx";
import BrandCrest from "../components/BrandCrest.jsx";
import { api } from "../api.js";

export default function Collection() {
  const [cars, setCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [cities, setCities] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ make: "", city: "", minPrice: "", maxPrice: "" });

  async function load(activeFilters) {
    setLoading(true);
    setError("");
    try {
      const data = await api.getCars(activeFilters);
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(filters);
    api
      .getCars({})
      .then((all) => {
        setTotalCount(all.length);
        setMakes([...new Set(all.map((car) => car.make))].sort());
        setCities([...new Set(all.map((car) => car.city).filter(Boolean))].sort());
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    load(filters);
  }

  return (
    <div>
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url(/images/ferrari-488-pista.jpg)" }} />
        <div className="hero-content">
          <div className="eyebrow">Est. for the Discerning Collector</div>
          <h1>Drive the Extraordinary</h1>
          <div className="ornament" />
          <p>
            Ferraris, Lamborghinis, and more — offered directly by their owners. Reserve online;
            the collector confirms availability upon request.
          </p>
          <div className="trust-bar">
            <span>{totalCount ?? "12"}+ Exotic Models</span>
            <span>Verified Owners</span>
            <span>Fully Insured</span>
            <span>Instant Booking</span>
          </div>
        </div>
      </div>

      {makes.length > 0 && (
        <div className="logo-strip">
          <div className="logo-strip-track">
            {[...makes, ...makes].map((make, i) => (
              <span className="logo-strip-item" key={`${make}-${i}`}>
                <BrandCrest make={make} size={40} />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <form className="filter-bar" onSubmit={handleSubmit}>
          <div className="field">
            <label>Make</label>
            <select name="make" value={filters.make} onChange={handleChange}>
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>City</label>
            <select name="city" value={filters.city} onChange={handleChange}>
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Min $/day</label>
            <input
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label>Max $/day</label>
            <input
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="2000"
            />
          </div>
          <button type="submit" className="btn">
            Filter
          </button>
        </form>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="empty-state">Loading collection…</div>
        ) : cars.length === 0 ? (
          <div className="empty-state">No lots match those filters.</div>
        ) : (
          <div className="lot-grid">
            {cars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
