// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Conference Hall Booking</h1>
      <div className="nav-links">
        <Link to="/">Rooms</Link>
       
        {user && <Link to="/mybookings">My Bookings</Link>}
        {user?.isAdmin && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/signup">Signup</Link>}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              marginLeft: "10px",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}