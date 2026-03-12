// src/pages/Signup.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Signup.css";

export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        navigate("/");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-container">

      <div className="signup-card">

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-btn">
            Create Account
          </button>

        </form>

      </div>

    </div>
  );
}