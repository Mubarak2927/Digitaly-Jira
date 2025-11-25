import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../Api/projectAPI";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
  const res = await axios.post(
    "https://project-management-sfrn.onrender.com/api/v1/login",
    {
      email: form.email,
      password: form.password
    }
  );

  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  // 🔥 Fetch role after login
  const profile = await getMyProfile();
  localStorage.setItem("role", profile.role);

  navigate("/dashboard");
}  catch (err) {
      setFieldErrors({
        ...fieldErrors,
        submit:' "Invalid Credentials or Server Error",'
      })
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            className="w-full p-2 border rounded"
            name="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />

          <label className="mt-3 block">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            name="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
          />

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
