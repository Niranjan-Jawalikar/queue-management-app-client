import "./styles/index.scss";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./components/Auth/Login.jsx";
import Signup from "./components/Auth/Signup.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import { Queues } from "./components/Queue/Queues.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  return (
    <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Queues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </main>
    </div>
  );
}
