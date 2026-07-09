import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { AuthContext } from "./context/AuthContext";
import Analytics from "./pages/Analytics";
import Certificates from "./pages/Certificates";
import ConfirmQR from "./pages/ConfirmQR";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyQRCode from "./pages/MyQRCode";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AdminUsers from "./pages/AdminUsers";
import Recommendations from "./pages/Recommendations";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function RoleRedirect() {
  const { user } = useContext(AuthContext);
  const role = String(user?.role || "student").toLowerCase();

  if (role === "organizer") {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/student/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<RequireAuth><RoleRedirect /></RequireAuth>} />
      <Route path="/student/dashboard" element={<RequireAuth allowedRoles={["student"]}><Dashboard /></RequireAuth>} />
      <Route path="/organizer/dashboard" element={<RequireAuth allowedRoles={["organizer"]}><OrganizerDashboard /></RequireAuth>} />
      <Route path="/admin/dashboard" element={<RequireAuth allowedRoles={["admin"]}><AdminDashboard /></RequireAuth>} />

      <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
      <Route path="/my-qrcode" element={<RequireAuth><MyQRCode /></RequireAuth>} />
      <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
      <Route path="/recommendations" element={<RequireAuth><Recommendations /></RequireAuth>} />
      <Route path="/certificates" element={<RequireAuth><Certificates /></RequireAuth>} />
      <Route path="/Certificates" element={<Navigate to="/certificates" replace />} />

      <Route path="/organizer/create-event" element={<RequireAuth allowedRoles={["organizer"]}><CreateEvent /></RequireAuth>} />
      <Route path="/organizer/checkin" element={<RequireAuth allowedRoles={["organizer"]}><ConfirmQR /></RequireAuth>} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;