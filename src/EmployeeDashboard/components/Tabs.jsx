import React from "react";
import { MoreHorizontal } from "lucide-react";

const Tabs = ({ activeTab, setActiveTab, onAddMember, onArchive, onDelete }) => {
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "lists", label: "Lists" },
    { id: "board", label: "Board" },
    { id: "product-backlog", label: "Product Backlog Items" },
    { id: "goals", label: "Goals" },
    { id: "archived", label: "Archived Items" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between mb-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-4 py-2 shadow-inner">
      {/* Tabs Section */}
      <ul className="flex flex-wrap items-center gap-2 md:gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg cursor-pointer transition-all duration-300 text-xs md:text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg shadow-blue-800/40 scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>

      {/* Right Side Options */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {/* Future Dropdown Menu */}
        <button className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-all">
          <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default Tabs;
