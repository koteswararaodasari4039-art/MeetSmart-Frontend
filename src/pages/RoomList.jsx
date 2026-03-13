import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoomList.css";

export default function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("https://meetsmart-backend-tb5e.onrender.com/api/rooms");
        const data = await res.json();

        // Check if API returned an array
        if (Array.isArray(data)) {
          setRooms(data);
          setError("");
        } else {
          setError(data.message || "Failed to load rooms");
          setRooms([]);
        }
      } catch (err) {
        console.error("Fetch rooms error:", err);
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p className="rooms-loading">Loading rooms...</p>;
  if (error) return <p className="rooms-error">{error}</p>;
  if (rooms.length === 0) return <p className="rooms-empty">No rooms available.</p>;

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1>Meeting Rooms</h1>
        <p>Select a room to schedule your meeting</p>
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-icon">🏢</div>

            <h3>{room.name}</h3>

            <p>
              <strong>Capacity:</strong>{" "}
              <span>{room.capacity} people</span>
            </p>

            <p>
              <strong>Equipment:</strong>{" "}
              <span>{room.equipment && room.equipment.length > 0 ? room.equipment.join(", ") : "None"}</span>
            </p>

            <button
              className="book-btn"
              onClick={() => navigate(`/book/${room.id}`)}
            >
              Book Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}