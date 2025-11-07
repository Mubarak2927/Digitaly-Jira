import React from "react";

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-gradient-to-b from-cyan-400 to-purple-500 hover:scale-105 animate-fadeOut shadow-lg/60 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition">
    <div>
      <h3 className="text-black font-bold">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className="text-blue-600">{icon}</div>
  </div>
);

export default DashboardCard;
