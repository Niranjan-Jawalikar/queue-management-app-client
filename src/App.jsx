import "./styles/index.scss";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import { Queues } from "./components/Queue/Queues.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <div className="app-container">
      <Navbar token={token} setToken={setToken} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute token={token}>
                <Queues token={token} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
        </Routes>
      </main>
    </div>
  );
}
