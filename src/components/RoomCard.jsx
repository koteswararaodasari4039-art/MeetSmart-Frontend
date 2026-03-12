import { Link } from "react-router-dom";
import "../styles/RoomCard.css";

export default function RoomCard({ room }) {

  return (
    <div className="room-card">

      <h3>{room.name}</h3>

      <p>Capacity: {room.capacity}</p>

      <p>Equipment: {room.equipment}</p>

      <p>Status: {room.status}</p>

      <Link to={`/book/${room.id}`}>
        <button>Book Room</button>
      </Link>

    </div>
  );
}