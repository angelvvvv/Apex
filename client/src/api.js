const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("apex_admin_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `Request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getCars: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    return request(`/cars${query ? `?${query}` : ""}`);
  },
  getCar: (id) => request(`/cars/${id}`),
  createCar: (payload) => request("/cars", { method: "POST", body: JSON.stringify(payload) }),
  createBooking: (payload) => request("/bookings", { method: "POST", body: JSON.stringify(payload) }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  adminGetCars: () => request("/cars"),
  adminUpdateCar: (id, payload) =>
    request(`/admin/cars/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  adminDeleteCar: (id) => request(`/admin/cars/${id}`, { method: "DELETE" }),

  adminGetBookings: () => request("/admin/bookings"),
  adminUpdateBooking: (id, status) =>
    request(`/admin/bookings/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  adminDeleteBooking: (id) => request(`/admin/bookings/${id}`, { method: "DELETE" }),

  adminGetUsers: () => request("/admin/users"),
  adminDeleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
};
