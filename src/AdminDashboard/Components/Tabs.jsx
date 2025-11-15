import React from "react";
import { MoreHorizontal } from "lucide-react";

const Tabs = ({ activeTab, setActiveTab, onAddMember, onArchive, onDelete }) => {
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "product-backlog", label: "Product Backlog Items" },
    { id: "board", label: "Board" },
    { id: "lists", label: "Lists" },
    { id: "goals", label: "Goals" },
    { id: "archived", label: "Archived Items" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between mb-8 backdrop-blur-md  border-1 border-black  rounded-xl px-4 py-2 shadow-inner">
      {/* Tabs Section */}
      <ul className="flex flex-wrap items-center gap-2 md:gap-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 md:px-4 md:py-2   rounded-lg cursor-pointer transition-all duration-300 text-xs md:text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-800/40 scale-105"
                  : "text-black hover:text-black hover:bg-white/10"
              }`}
            >
              {tab.label}
            </li>
          );
        })}
      </ul>
    
    </div>
  );
};

export default Tabs;
