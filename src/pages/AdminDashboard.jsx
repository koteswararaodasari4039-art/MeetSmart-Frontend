import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [equipment, setEquipment] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomUsage, setRoomUsage] = useState([]);
  const [busyHours, setBusyHours] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Format booking date & time (FIXED)
  const formatBookingDateTime = (date, start, end) => {
    return {
      date: date, // show database date directly
      time: `${start?.slice(0,5)} - ${end?.slice(0,5)}`, // remove seconds
    };
  };

  useEffect(() => {
    if (!user?.isAdmin) return;

    const loadData = async () => {
      try {
        const roomsRes = await axios.get("https://meetsmart-backend-tb5e.onrender.com/api/rooms");
        const bookingsRes = await axios.get(
          "https://meetsmart-backend-tb5e.onrender.com/api/bookings/admin/all"
        );
        const roomUsageRes = await axios.get(
          "https://meetsmart-backend-tb5e.onrender.com/api/analytics/rooms-usage"
        );
        const busyHoursRes = await axios.get(
          "https://meetsmart-backend-tb5e.onrender.com/api/analytics/busy-hours"
        );

        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
        setRoomUsage(roomUsageRes.data);
        setBusyHours(busyHoursRes.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadData();
  }, [user]);

  if (!user?.isAdmin) return <p>Access Denied</p>;

  // Add Room
  const addRoom = async () => {
    try {
      const res = await axios.post("https://meetsmart-backend-tb5e.onrender.com/api/admin/rooms", {
        name: roomName,
        capacity,
        equipment,
      });

      setRooms([...rooms, res.data]);
      setRoomName("");
      setCapacity("");
      setEquipment("");
    } catch (err) {
      console.error("Add room error:", err);
    }
  };

  // Update Room
  const updateRoom = async () => {
    try {
      const res = await axios.put(
        `https://meetsmart-backend-tb5e.onrender.com/api/admin/rooms/${editingRoomId}`,
        { name: roomName, capacity, equipment }
      );

      setRooms(
        rooms.map((r) => (r.id === editingRoomId ? res.data : r))
      );

      setEditingRoomId(null);
      setRoomName("");
      setCapacity("");
      setEquipment("");
    } catch (err) {
      console.error("Update room error:", err);
    }
  };

  // Delete Room
  const deleteRoom = async (id) => {
    try {
      await axios.delete(`https://meetsmart-backend-tb5e.onrender.com/api/admin/rooms/${id}`);
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete room error:", err);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        {["rooms", "bookings", "analytics"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ROOMS */}
      {activeTab === "rooms" && (
        <div className="admin-section">

          <div className="room-form">
            <input
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <input
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />

            <input
              placeholder="Equipment"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            />

            <button
              className="primary-btn"
              onClick={editingRoomId ? updateRoom : addRoom}
            >
              {editingRoomId ? "Update Room" : "Add Room"}
            </button>
          </div>

          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <h3>{room.name}</h3>
                <p>Capacity: {room.capacity}</p>
                <p>Equipment: {room.equipment || "None"}</p>

                <div className="room-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingRoomId(room.id);
                      setRoomName(room.name);
                      setCapacity(room.capacity);
                      setEquipment(room.equipment);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteRoom(room.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="booking-grid">
          {bookings.map((b) => {
            const { date, time } = formatBookingDateTime(
              b.date,
              b.start_time,
              b.end_time
            );

            return (
              <div className="booking-card" key={b.id}>

                <div className="booking-header">
                  <div className="booking-room">{b.roomName}</div>
                  <span className="booking-status">Booked</span>
                </div>

                <div className="booking-info">
                  <p>
                    <span>User</span>
                    <strong>{b.userName}</strong>
                  </p>

                  <p>
                    <span>Date</span>
                    <strong>{date}</strong>
                  </p>

                  <p>
                    <span>Time</span>
                    <strong>{time}</strong>
                  </p>
                </div>

                <div className="booking-purpose">
                  {b.purpose}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="analytics-container">

          <div className="analytics-stats">

            <div className="stat-card">
              <h3>Total Rooms</h3>
              <p>{rooms.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p>{bookings.length}</p>
            </div>

            <div className="stat-card">
              <h3>Most Used Room</h3>
              <p>{roomUsage[0]?.name || "-"}</p>
            </div>

          </div>

          <div className="analytics-grid">

            <div className="chart-card">
              <h3>Most Booked Rooms</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalBookings" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>

            </div>

            <div className="chart-card">
              <h3>Busy Hours</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={busyHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookingsCount" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}