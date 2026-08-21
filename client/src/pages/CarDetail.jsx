import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import BrandCrest from "../components/BrandCrest.jsx";

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const ms = new Date(end) - new Date(start);
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", start_date: "", end_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api
      .getCar(id)
      .then(setCar)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const days = daysBetween(form.start_date, form.end_date);
  const total = car ? days * Number(car.price_per_day) : 0;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!form.name || !form.email || !form.start_date || !form.end_date) {
      setSubmitError("Please fill in name, email, and both dates.");
      return;
    }
    if (days <= 0) {
      setSubmitError("Return date must be after the pickup date.");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await api.createBooking({
        car_id: Number(id),
        name: form.name,
        email: form.email,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      if (booking.status === "rejected") {
        setSubmitError(
          "Those dates overlap an existing confirmed booking for this car. Please choose different dates."
        );
        return;
      }

      navigate(`/cars/${id}/confirmed`, { state: { booking, car } });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="container empty-state">Loading lot…</div>;
  if (loadError) return <div className="container error-banner">{loadError}</div>;
  if (!car) return null;

  return (
    <div className="container">
      <div className="page-header detail-header">
        <div>
          <div className="eyebrow">Lot {String(car.id).padStart(3, "0")}</div>
          <h1>
            {car.year} {car.make} {car.model}
          </h1>
          <p>Offered by {car.owner_name}</p>
        </div>
        <BrandCrest make={car.make} size={64} />
      </div>

      <div className="detail-layout">
        <div>
          <div
            className="detail-photo"
            style={car.image_url ? { background: `center / cover no-repeat url(${car.image_url})` } : undefined}
          >
            {!car.image_url && (
              <>
                {car.make} {car.model}
              </>
            )}
          </div>
          <table className="spec-table">
            <tbody>
              <tr>
                <td>Engine</td>
                <td>{car.engine || "—"}</td>
              </tr>
              <tr>
                <td>Power</td>
                <td>{car.power || "—"}</td>
              </tr>
              <tr>
                <td>Mileage</td>
                <td>{car.mileage != null ? `${car.mileage.toLocaleString()} mi` : "—"}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>{car.city || "—"}</td>
              </tr>
              <tr>
                <td>Price / Day</td>
                <td>${Number(car.price_per_day).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{car.description || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="booking-panel">
          <h3>Reserve This Lot</h3>
          {submitError && <div className="error-banner">{submitError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Pickup Date</label>
              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Return Date</label>
              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="total-row">
              <span>
                {days > 0 ? `${days} day${days === 1 ? "" : "s"}` : "Total"}
              </span>
              <strong>${total.toLocaleString()}</strong>
            </div>

            <button type="submit" className="btn btn-wine" disabled={submitting}>
              {submitting ? "Reserving…" : "Request Reservation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
