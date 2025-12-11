import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
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
    setLoading(true);

    try {
      const res = await axios.post(
        "https://pmtoolapidev.digitaly.live/api/v1/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("role", res.data.role);


      

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg("Invalid Credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm ">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">
              Email Address
            </label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              name="email"
              value={form.email}
              type="email"
              required
              placeholder="Enter your email"
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, [e.target.name]: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' :'Show' }
              </button>
            </div>
          </div>
          {errorMsg && (
            <p className="text-red-600 text-sm font-semibold mt-1">
              {errorMsg}
            </p>
          )}
          <a href="/ForgetPassword" 
         
          className="  w-fit hover:underline cursor-pointer hover:text-blue-500">Forget Password ?</a>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
