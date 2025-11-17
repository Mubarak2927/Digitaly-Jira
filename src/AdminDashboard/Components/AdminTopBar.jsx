import React from "react";
import { Bell, Search, UserCircle2, Settings, User } from "lucide-react";

const AdminTopBar = () => {
  return (
    <div className="flex justify-between items-center shadow-lg bg-white border-b border-black w-full  px-6 py-3 sticky top-0 z-50 ">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl items-center gap-2 flex md:text-2xl font-bold text-blue-600">
          <span className="text-blue-600"><User/></span>Admin Dashboard
        </h1>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center  px-3 py-2 rounded-full w-1/3">
        {/* <Search size={18} className="text-white  mr-2" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent w-full border p-2 rounded-full outline-none text-black placeholder-black text-sm"
        /> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="relative">
          {/* <Bell size={22} className="text-black hover:text-blue-700 transition" /> */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 text-white">
            
          </span>
        </button>
        {/* <Settings size={22} className="text-black hover:text-purple-400 transition cursor-pointer" /> */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 px-2 py-1 rounded-lg transition">
          <UserCircle2 size={28} className="text-blue-700" />
          <span className="hidden sm:inline text-black text-sm font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
