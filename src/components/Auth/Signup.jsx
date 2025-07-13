import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.scss";
import axios from "../../axios";

export default function Signup({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPass) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("/auth/register", { username, password });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      alert(message);
      return;
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

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

        <label>Confirm Password</label>
        <div className="password-field">
          <input
            type={showConfirmPass ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle"
            onClick={() => setShowConfirmPass((prev) => !prev)}
          >
            {showConfirmPass ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="auth-button">
          Signup
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
