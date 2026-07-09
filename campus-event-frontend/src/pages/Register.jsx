import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      password,
      role,
    };

    if (role === "organizer") {
      payload.invite_code = inviteCode;
    }

    try {
      await api.post("register/", payload);

      const tokenResponse = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", tokenResponse.data.access);
      localStorage.setItem("refresh", tokenResponse.data.refresh);

      const profileResponse = await api.get("users/profile/");
      login(profileResponse.data);

      alert("Registration Successful! Welcome to your dashboard.");
      navigate(getDashboardPath(profileResponse.data.role || role));
    } catch (error) {
      const backendError = error.response?.data;
      const errorMessage =
        backendError && typeof backendError === "object"
          ? Object.entries(backendError)
              .map(([field, messages]) => {
                const messageList = Array.isArray(messages) ? messages : [messages];
                return `${field}: ${messageList.join(" ")}`;
              })
              .join("\n")
          : "Registration failed. Please try again.";

      console.error("Registration database error:", backendError);
      alert(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-850 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter a unique username"
              className="w-full p-3 rounded bg-slate-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
              {/* Admin signups are disabled from the frontend */}
            </select>
          </div>

          {role === "organizer" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Invitation Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter organizer invite code"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;