import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/">
          <span className="brand">Apex</span>
          <span className="brand-sub">Fine Motorcar Rentals</span>
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
