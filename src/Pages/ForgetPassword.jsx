import React, { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          <span className="text-red-600">Note: </span> Please enter your registered email address. We’ll send you a reset link.
        </p>

        <form className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
