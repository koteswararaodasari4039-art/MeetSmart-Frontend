import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      axios
        .get(`https://meetsmart-backend-tb5e.onrender.com/api/bookings/user/${user.id}`)
        .then((res) => {
          setBookings(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mybookings-container">

      <div className="mybookings-header">
        <h1>My Bookings</h1>
        <p>View and manage your meeting room reservations</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-booking">
          <h3>No Bookings Found</h3>
          <p>You haven't booked any meeting rooms yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">

          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">

              <div className="booking-card-header">
                <h3>{booking.roomName || booking.room || "Meeting Room"}</h3>
                <span className="status-badge">Booked</span>
              </div>

              <div className="booking-info">
                <p>
                  <strong>Date</strong>
                  <span>{formatDate(booking.date)}</span>
                </p>

                <p>
                  <strong>Time</strong>
                  <span>
                    {booking.start_time && booking.end_time
                      ? `${formatTime(booking.start_time)} - ${formatTime(
                          booking.end_time
                        )}`
                      : "-"}
                  </span>
                </p>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default MyBookings;