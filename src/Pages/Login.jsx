import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dot } from "lucide-react";
import API from "../Api/axiosInstance";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  if (!formData.email.trim()) newErrors.email = "Email is required";
  if (!formData.password.trim()) newErrors.password = "Password is required";
  setErrors(newErrors);
  if (Object.keys(newErrors).length !== 0) return;

  setLoading(true);
  setApiError("");

  try {
    const { data } = await API.post("/api/v1/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("Login success:", data);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      navigate("/dashboard");
    } else if (data.role === "employee") {
      navigate("/EmployeeDashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    console.error("Login error:", error);
    setApiError(error.response?.data?.detail || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white">
          Login
        </h2>

        {apiError && (
          <p className="text-red-400 text-center mb-3 text-sm">{apiError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/10 text-white placeholder-gray-400 border rounded-lg px-4 py-2 outline-none"
            />
            <div className="h-5 mt-1">
              {errors.email && (
                <p className="text-red-400 flex items-center text-sm">
                  <Dot size={18} className="text-red-400" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/10 text-white placeholder-gray-400 border rounded-lg px-4 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-white text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="h-5 mt-1">
              {errors.password && (
                <p className="text-red-400 flex items-center text-sm">
                  <Dot size={18} className="text-red-400" />
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-bl from-cyan-500 via-indigo-800 to-purple-600 hover:scale-105 transition-all text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white mt-6 text-sm">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:text-blue-600 hover:underline font-bold"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
