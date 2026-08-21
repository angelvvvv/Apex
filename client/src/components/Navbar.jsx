import { Link } from "react-router-dom";
import ApexLogo from "./ApexLogo.jsx";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand-mark">
          <ApexLogo size={30} />
          <span>
            <span className="brand">Apex</span>
            <span className="brand-sub">Fine Motorcar Rentals</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link to="/">Collection</Link>
          <Link to="/list-a-car">List a Car</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
