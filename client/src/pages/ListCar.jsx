import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const initialForm = {
  owner_name: "",
  owner_email: "",
  make: "",
  model: "",
  year: "",
  engine: "",
  power: "",
  mileage: "",
  city: "",
  price_per_day: "",
  description: "",
  image_url: "",
};

export default function ListCar() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await api.createCar({
        ...form,
        year: Number(form.year),
        mileage: form.mileage ? Number(form.mileage) : null,
        price_per_day: Number(form.price_per_day),
      });
      navigate(`/cars/${result.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="eyebrow">Consign Your Vehicle</div>
        <h1>List a Car</h1>
        <p>Submit your vehicle's details below to add it to the current collection.</p>
      </div>

      <div className="form-card">
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Your Name</label>
              <input name="owner_name" value={form.owner_name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Your Email</label>
              <input
                name="owner_email"
                type="email"
                value={form.owner_email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Make</label>
              <input name="make" value={form.make} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Model</label>
              <input name="model" value={form.model} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Price / Day ($)</label>
              <input
                name="price_per_day"
                type="number"
                value={form.price_per_day}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Engine</label>
              <input name="engine" value={form.engine} onChange={handleChange} placeholder="4.0L Twin-Turbo V8" />
            </div>
            <div className="field">
              <label>Power</label>
              <input name="power" value={form.power} onChange={handleChange} placeholder="600 hp" />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Mileage</label>
              <input name="mileage" type="number" value={form.mileage} onChange={handleChange} />
            </div>
            <div className="field">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Miami, FL" />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Photo URL (optional)</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <button type="submit" className="btn btn-wine" disabled={submitting}>
            {submitting ? "Listing…" : "List This Car"}
          </button>
        </form>
      </div>
    </div>
  );
}
