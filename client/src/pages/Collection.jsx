import { useEffect, useState } from "react";
import CarCard from "../components/CarCard.jsx";
import { api } from "../api.js";

export default function Collection() {
  const [cars, setCars] = useState([]);
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
    <div className="container">
      <div className="page-header">
        <div className="eyebrow">The Collection</div>
        <h1>Current Lots</h1>
        <p>
          Every vehicle below is offered directly by its owner. Reserve online; the collector
          confirms availability upon request.
        </p>
      </div>

      <form className="filter-bar" onSubmit={handleSubmit}>
        <div className="field">
          <label>Make</label>
          <input name="make" value={filters.make} onChange={handleChange} placeholder="Ferrari" />
        </div>
        <div className="field">
          <label>City</label>
          <input name="city" value={filters.city} onChange={handleChange} placeholder="Miami" />
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
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
