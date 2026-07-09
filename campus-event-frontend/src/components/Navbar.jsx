import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);
  const role = String(user?.role || "student").toLowerCase();

  const dashboardPath =
    role === "organizer" ? "/organizer/dashboard" : role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campus EMS</h1>

        <div className="space-x-6">
          <Link to="/">Home</Link>
          <Link to={dashboardPath}>Dashboard</Link>
          <Link to="/events">Events</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;