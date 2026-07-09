import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const getDashboardPath = (role) => {
  const normalizedRole = String(role || "student").toLowerCase();

  if (normalizedRole === "organizer") {
    return "/organizer/dashboard";
  }

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  return "/student/dashboard";
};

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      let userData = { username };

      try {
        const profileResponse = await api.get("users/profile/");
        userData = profileResponse.data;
      } catch (profileError) {
        console.warn("Profile fetch failed, falling back to username.", profileError);
      }

      login(userData);
      alert("Login Successful");
      navigate(getDashboardPath(userData.role));
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">Welcome Back</h2>
        <p className="text-center text-sm text-gray-500 mb-8">Sign in to your campus dashboard</p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Username</label>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] mt-4"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;