import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.scss";
import axios from "../../axios";

export default function Login({setToken}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/auth/login", { username, password });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Username</label>
        <input
          type="text"
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
