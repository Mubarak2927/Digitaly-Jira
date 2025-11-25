import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    submit: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ---------- VALIDATION ----------
  const validateForm = () => {
    let errors = { email: "", password: "", submit: "" };
    let isValid = true;

    if (!form.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Enter a valid email";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 1) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear field error when typing
    setFieldErrors({ ...fieldErrors, [e.target.name]: "", submit: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "https://project-management-sfrn.onrender.com/api/v1/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      navigate("/dashboard");
    } catch (err) {
      setFieldErrors({
        ...fieldErrors,
        submit: "Invalid Credentials or Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-gray-300 p-10 rounded-xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            placeholder="Enter Your Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* FIXED-HEIGHT ERROR BOX */}
          <div className="h-5">
            {fieldErrors.email && (
              <p className="text-red-600 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <label className="block mb-2 text-sm font-medium mt-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-2 border rounded"
              placeholder="Enter Your Password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-2 top-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* FIXED-HEIGHT ERROR BOX */}
          <div className="h-5">
            {fieldErrors.password && (
              <p className="text-red-600 text-sm">{fieldErrors.password}</p>
            )}
          </div>

          {/* SUBMIT ERROR */}
          <div className="h-5">
            {fieldErrors.submit && (
              <p className="text-red-600 text-sm">{fieldErrors.submit}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
