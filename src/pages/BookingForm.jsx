// src/pages/BookingForm.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/BookingForm.css";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch room details
  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoom(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Handle booking submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http:// https://meetsmart-backend-tb5e.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: id,
          userId: user.id,
          date,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Booking Confirmed!");
        navigate("/mybookings");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading) {
    return <p className="loading-text">Loading room details...</p>;
  }

  if (!room) {
    return <p className="error-text">Room not found!</p>;
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2 className="booking-title">Book Room</h2>
        <h3 className="room-name">{room.name}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <button className="booking-btn" type="submit">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}