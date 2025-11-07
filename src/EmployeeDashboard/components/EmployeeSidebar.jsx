import React, { useState } from "react";
import { Home, User, Calendar, LogOut, Folder, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ active, setActive, onLogout }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const menuItems = [
    { icon: <Home size={20} />, label: "Dashboard" },
    {
      icon: <Folder size={20} />,
      label: "Projects",
      hasDropdown: true,
      subItems: [
        { label: "Assigned Projects" },
      ],
    },
    { icon: <Calendar size={20} />, label: "Attendance" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-950 text-white flex flex-col justify-between p-5 shadow-xl border-r border-gray-800">
      <div>
        <h2 className="text-[20px] font-bold mb-10 text-center tracking-wide bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Employee Dashboard
        </h2>

        <ul className="space-y-2">
          {menuItems.map((item, i) => (
            <div key={i}>
              <li
                onClick={() => {
                  if (item.hasDropdown) {
                    setOpenDropdown((prev) => !prev);
                  } else {
                    setActive(item.label);
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  active === item.label
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-800 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm  bfont-medium">{item.label}</span>
                </div>
                {item.hasDropdown &&
                  (openDropdown ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </li>

              {item.hasDropdown && (
                <AnimatePresence>
                  {openDropdown && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="ml-9 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.subItems.map((sub, index) => (
                        <li
                          key={index}
                          onClick={() => setActive(sub.label)}
                          className={`text-sm p-2 rounded-md cursor-pointer transition-all ${
                            active === sub.label
                              ? "bg-blue-500/70 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          {sub.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </ul>
      </div>

      <div
        onClick={onLogout}
        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-red-600 hover:bg-red-700 transition-all duration-200"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
