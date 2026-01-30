import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/signup", {
        email,
        password,
      });
      alert("Signup successful! Please login.");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>📝 Signup</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn primary" onClick={signup}>
          Signup
        </button>
      </div>
    </div>
  );
}
