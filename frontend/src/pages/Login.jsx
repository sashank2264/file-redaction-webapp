import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });
      setUser(res.data.email);
    } catch {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>🔐 Login</h2>

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

        <button className="btn primary" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
