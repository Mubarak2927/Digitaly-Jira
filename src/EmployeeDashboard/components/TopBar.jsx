import React from "react";
import { Bell, Search, Menu, User } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-gray-950  shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
      </div>

      <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="text-white cursor-pointer hover:text-blue-600 transition" size={22} />

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white"><User/></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
