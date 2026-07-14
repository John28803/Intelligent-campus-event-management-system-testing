import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCertificate,
  FaChartBar,
  FaCheckCircle,
  FaHome,
  FaMagic,
  FaQrcode,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = String(user?.role || "student").toLowerCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linksByRole = {
    student: [
      { to: "/student/dashboard", icon: FaHome, label: "Dashboard" },
      { to: "/events", icon: FaCalendarAlt, label: "Events" },
      { to: "/my-qrcode", icon: FaQrcode, label: "My QR Code" },
      { to: "/analytics", icon: FaChartBar, label: "Analytics" },
      { to: "/certificates", icon: FaCertificate, label: "Certificates" },
      { to: "/recommendations", icon: FaMagic, label: "Recommendations" },
    ],
    organizer: [
      { to: "/organizer/dashboard", icon: FaHome, label: "Dashboard" },
      { to: "/organizer/create-event", icon: FaCalendarAlt, label: "Create Event" },
      { to: "/organizer/checkin", icon: FaCheckCircle, label: "Confirm Attendance" },
      { to: "/events", icon: FaCalendarAlt, label: "Events" },
      { to: "/analytics", icon: FaChartBar, label: "Analytics" },
    ],
    admin: [
      { to: "/admin/dashboard", icon: FaHome, label: "Dashboard" },
      { to: "/admin/users", icon: FaUsers, label: "Manage Users" },
      { to: "/analytics", icon: FaChartBar, label: "Analytics" },
      { to: "/certificates", icon: FaCertificate, label: "Certificates" },
    ],
  };

  const links = linksByRole[role] || linksByRole.student;
  const roleTitle =
    role === "organizer" ? "Organizer Panel" : role === "admin" ? "Admin Panel" : "Student Panel";

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-10">{roleTitle}</h2>

      <div className="space-y-6 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center gap-3 hover:text-gray-300">
            <Icon />
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;