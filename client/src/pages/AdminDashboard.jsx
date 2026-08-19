import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const TABS = ["Listings", "Bookings", "Users"];
const BOOKING_STATUSES = ["requested", "confirmed", "rejected", "completed"];

function formatDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("Listings");
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCarId, setEditingCarId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const handleAuthError = useCallback(
    (err) => {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem("apex_admin_token");
        navigate("/admin/login");
        return true;
      }
      return false;
    },
    [navigate]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [carsData, bookingsData, usersData] = await Promise.all([
        api.adminGetCars(),
        api.adminGetBookings(),
        api.adminGetUsers(),
      ]);
      setCars(carsData);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  function logout() {
    localStorage.removeItem("apex_admin_token");
    navigate("/admin/login");
  }

  function startEdit(car) {
    setEditingCarId(car.id);
    setEditForm({
      price_per_day: car.price_per_day,
      city: car.city || "",
      mileage: car.mileage ?? "",
      description: car.description || "",
    });
  }

  async function saveEdit(id) {
    try {
      await api.adminUpdateCar(id, {
        ...editForm,
        price_per_day: Number(editForm.price_per_day),
        mileage: editForm.mileage === "" ? null : Number(editForm.mileage),
      });
      setEditingCarId(null);
      loadAll();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  }

  async function deleteCar(id) {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.adminDeleteCar(id);
      loadAll();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  }

  async function changeBookingStatus(id, status) {
    try {
      await api.adminUpdateBooking(id, status);
      loadAll();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.adminDeleteBooking(id);
      loadAll();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user? This also removes their cars/bookings.")) return;
    try {
      await api.adminDeleteUser(id);
      loadAll();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  }

  return (
    <div className="container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="eyebrow">Back Office</div>
          <h1>Admin Dashboard</h1>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          Log Out
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <div style={{ paddingBottom: 60 }}>
          {tab === "Listings" && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lot</th>
                  <th>Vehicle</th>
                  <th>Owner</th>
                  <th>City</th>
                  <th>Mileage</th>
                  <th>Price/Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) =>
                  editingCarId === car.id ? (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>
                        {car.year} {car.make} {car.model}
                      </td>
                      <td>{car.owner_name}</td>
                      <td>
                        <input
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editForm.mileage}
                          onChange={(e) => setEditForm({ ...editForm, mileage: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editForm.price_per_day}
                          onChange={(e) => setEditForm({ ...editForm, price_per_day: e.target.value })}
                        />
                      </td>
                      <td className="table-actions">
                        <button className="btn btn-small" onClick={() => saveEdit(car.id)}>
                          Save
                        </button>
                        <button className="btn btn-small btn-outline" onClick={() => setEditingCarId(null)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={car.id}>
                      <td>{car.id}</td>
                      <td>
                        {car.year} {car.make} {car.model}
                      </td>
                      <td>{car.owner_name}</td>
                      <td>{car.city}</td>
                      <td>{car.mileage != null ? car.mileage.toLocaleString() : "—"}</td>
                      <td>${Number(car.price_per_day).toLocaleString()}</td>
                      <td className="table-actions">
                        <button className="btn btn-small btn-outline" onClick={() => startEdit(car)}>
                          Edit
                        </button>
                        <button className="btn btn-small btn-danger" onClick={() => deleteCar(car.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {cars.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No listings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "Bookings" && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle</th>
                  <th>Renter</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>
                      {b.make} {b.model}
                    </td>
                    <td>
                      {b.renter_name}
                      <br />
                      <span className="helper-text">{b.renter_email}</span>
                    </td>
                    <td>
                      {formatDate(b.start_date)} → {formatDate(b.end_date)}
                    </td>
                    <td>${Number(b.total_price).toLocaleString()}</td>
                    <td>
                      <select value={b.status} onChange={(e) => changeBookingStatus(b.id, e.target.value)}>
                        {BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="table-actions">
                      <button className="btn btn-small btn-danger" onClick={() => deleteBooking(b.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-state">
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "Users" && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="status-pill">{u.role}</span>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="table-actions">
                      <button className="btn btn-small btn-danger" onClick={() => deleteUser(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
