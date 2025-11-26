import React, { useState } from "react";

const ResetPassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Reset Password
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        <form className="flex flex-col gap-4">

          <div className="flex flex-col gap-1 relative">
            <label className="font-medium text-gray-700">New Password</label>
            <input
              type={showPass ? "text" : "password"}
              className="border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? 'Hide': 'Show'}
            </span>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="font-medium text-gray-700">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              className="border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? 'Hide': 'Show'}
            </span>
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition-all"
          >
            Update Password
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
