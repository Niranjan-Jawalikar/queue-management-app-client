import "./Navbar.scss";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  return (
    <nav className="navbar">
      <div className="navbar-title">
        <Link to="/" className="navbar-logo">
          Queue Manager
        </Link>
      </div>
      <div className="navbar-actions">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-button">
              Login
            </Link>
            <Link to="/signup" className="nav-button">
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-button" onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
