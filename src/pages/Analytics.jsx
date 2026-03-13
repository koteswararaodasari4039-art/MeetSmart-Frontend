import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Analytics() {
  const [roomUsage, setRoomUsage] = useState([]);
  const [busyHours, setBusyHours] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const roomsRes = await axios.get("https://meetsmart-backend-tb5e.onrender.com/api/admin/analytics/rooms-usage");
        const hoursRes = await axios.get("https://meetsmart-backend-tb5e.onrender.com/api/admin/analytics/busy-hours");
        setRoomUsage(roomsRes.data);
        setBusyHours(hoursRes.data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    };
    loadAnalytics();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Room Usage Analytics</h2>
      <h3>Most Booked Rooms</h3>
      <BarChart width={600} height={300} data={roomUsage}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="totalBookings" fill="#4caf50" />
      </BarChart>

      <h3>Busy Hours</h3>
      <BarChart width={600} height={300} data={busyHours}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="bookingsCount" fill="#ff5722" />
      </BarChart>
    </div>
  );
}