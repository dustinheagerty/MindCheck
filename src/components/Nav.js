import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("mindcheck_token");
    navigate("/login");
  }

  return (
    <nav className="nav">
      <Link to="/" className="logo">MindCheck</Link>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/checkin">Check-In</Link>
        <Link to="/history">History</Link>
        <Link to="/trends">Trends</Link>
        <Link to="/settings">Settings</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}