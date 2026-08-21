import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ApexLogo from "./components/ApexLogo.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Collection from "./pages/Collection.jsx";
import CarDetail from "./pages/CarDetail.jsx";
import BookingConfirmed from "./pages/BookingConfirmed.jsx";
import ListCar from "./pages/ListCar.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Collection />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/cars/:id/confirmed" element={<BookingConfirmed />} />
        <Route path="/list-a-car" element={<ListCar />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <footer className="site-footer">
        <div className="footer-logo">
          <ApexLogo size={40} />
        </div>
        <div className="footer-brand">Apex</div>
        <div className="footer-tagline">Fine Motorcar Rentals</div>
        <div className="ornament" />
        <div className="footer-copy">Capstone demo project.</div>
      </footer>
    </div>
  );
}
