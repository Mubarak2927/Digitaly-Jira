import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, PlaneTakeoff, Sparkles } from "lucide-react";

const LeaveManagement = () => {
  return (
    <div
      className="relative min-h-[85vh] flex flex-col items-center justify-center 
                 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 
                 overflow-hidden rounded-2xl px-4 sm:px-6 md:px-10 py-8 sm:py-12"
    >
      {/* Animated floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-500/20 rounded-full"
          style={{
            width: Math.random() * 10 + 4,
            height: Math.random() * 10 + 4,
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 z-10 px-2"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl pb-5 font-bold text-transparent 
                     bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 
                     tracking-wide drop-shadow-lg"
        >
          Leave Management
        </h1>
      </motion.div>

      {/* Feature cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 
                   w-full max-w-6xl z-10"
      >
        {[
          {
            icon: <PlaneTakeoff className="w-8 h-8 text-blue-400" />,
            title: "Apply for Leave",
            desc: "Request new leave with detailed reason and duration.",
            color: "from-blue-500 to-cyan-400",
          },
          {
            icon: <Clock className="w-8 h-8 text-purple-400" />,
            title: "Leave History",
            desc: "View all your past leaves with status and type.",
            color: "from-purple-500 to-pink-400",
          },
          {
            icon: <CalendarDays className="w-8 h-8 text-green-400" />,
            title: "Upcoming Leaves",
            desc: "Check approved leaves and upcoming schedules.",
            color: "from-green-500 to-emerald-400",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i, duration: 0.7 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl 
                       border border-gray-800 shadow-lg overflow-hidden 
                       flex flex-col items-center text-center space-y-3 
                       transition-all duration-300"
          >
            <div
              className={`absolute inset-0 opacity-20 bg-gradient-to-tr ${card.color} blur-2xl`}
            ></div>

            <div className="relative flex flex-col items-center space-y-3">
              <div className="p-4 bg-gray-800/80 rounded-full">{card.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100">
                {card.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming soon footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 
                   to-cyan-500 text-white text-sm sm:text-base font-semibold 
                   flex items-center gap-2 shadow-lg shadow-blue-500/30 z-10 
                   animate-bounce"
      >
        <Sparkles className="w-4 h-4" />
        Coming Soon...
      </motion.div>
    </div>
  );
};

export default LeaveManagement;
