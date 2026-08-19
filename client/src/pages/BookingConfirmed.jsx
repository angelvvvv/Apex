import { useLocation, useParams, Link } from "react-router-dom";

export default function BookingConfirmed() {
  const { id } = useParams();
  const location = useLocation();
  const { booking, car } = location.state || {};

  return (
    <div className="container">
      <div className="confirmation">
        <span className="lot-number">Lot {String(id).padStart(3, "0")}</span>
        <h1>Reservation Confirmed</h1>
        {car ? (
          <p>
            Your booking for the {car.year} {car.make} {car.model} is confirmed.
          </p>
        ) : (
          <p>Your reservation has been confirmed.</p>
        )}

        {booking && (
          <table className="spec-table" style={{ marginTop: 24, textAlign: "left" }}>
            <tbody>
              <tr>
                <td>Pickup</td>
                <td>{booking.start_date}</td>
              </tr>
              <tr>
                <td>Return</td>
                <td>{booking.end_date}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>${Number(booking.total_price).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{booking.status}</td>
              </tr>
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 32 }}>
          <Link to="/" className="btn btn-outline">
            Back to Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
