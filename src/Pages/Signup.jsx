import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api/axiosInstance";

export default function Signup() {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
// 👈 Add this at the top

const handleSubmit = async (e) => {
  e.preventDefault();
  let newErrors = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.email.trim()) newErrors.email = "Email is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.confirmPassword)
    newErrors.confirmPassword = "Confirm password is required";
  else if (formData.password !== formData.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";
  if (!formData.role) newErrors.role = "Select a role";

  setErrors(newErrors);
  setApiError("");

  if (Object.keys(newErrors).length !== 0) return;

  setLoading(true);
  try {
    const res = await API.post("/api/v1/register", {
      email: formData.email,
      full_name: formData.name,
      role: formData.role,
      is_active: true,
      password: formData.password,
    });

    console.log("Signup success:", res.data);

    // ✅ Save token after signup (if backend returns token)
    if (res.data.access_token) {
      localStorage.setItem("access_token", res.data.access_token);
    }

    navigate("/");
  } catch (error) {
    console.log("Signup error:", error);

    // server error message
    setApiError(error.response?.data?.detail || "Signup failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex text-white items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg/60 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        {/* ❌ Error banner without layout shift */}
        {apiError && (
          <div className="text-red-400 text-center mb-4 text-sm min-h-[20px]">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/10 text-white border rounded-lg px-4 py-2 outline-none"
            />
            <div className="absolute text-red-500 text-xs mt-1 min-h-[16px]">
              {errors.name}
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/10 text-white border rounded-lg px-4 py-2 outline-none"
            />
            <div className="absolute text-red-500 text-xs mt-1 min-h-[16px]">
              {errors.email}
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/10 text-white border rounded-lg px-4 py-2 outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  password: !showPassword.password,
                })
              }
              className="absolute right-3 top-2.5 text-gray-300 text-sm"
            >
              {showPassword.password ? "Hide" : "Show"}
            </button>
            <div className="absolute text-red-500 text-xs mt-1 min-h-[16px]">
              {errors.password}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/10 text-white border rounded-lg px-4 py-2 outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirm: !showPassword.confirm,
                })
              }
              className="absolute right-3 top-2.5 text-gray-300 text-sm"
            >
              {showPassword.confirm ? "Hide" : "Show"}
            </button>
            <div className="absolute text-red-500 text-xs mt-1 min-h-[16px]">
              {errors.confirmPassword}
            </div>
          </div>

          {/* Role Selector */}
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/10 text-white border rounded-lg px-4 py-2 outline-none"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="admin" className="text-black">
                Admin
              </option>
              <option value="employee" className="text-black">  
                User
              </option>
            </select>
            <div className="absolute text-red-500 text-xs mt-1 min-h-[16px]">
              {errors.role}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-bl from-blue-500 via-indigo-800 to-cyan-400 text-white py-2 rounded-lg hover:scale-105 transition-all"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-white mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/"
            className="text-blue-400 hover:text-blue-600 hover:underline font-bold"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
