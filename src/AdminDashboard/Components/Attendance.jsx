import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";

const Attendance = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center 
                    bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 
                    overflow-hidden rounded-2xl  shadow-lg/60  
                    px-4 sm:px-6 md:px-10 py-10 sm:py-12">
      
      {/* Animated Background Circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-10 sm:top-20 left-5 sm:left-20 w-40 sm:w-64 h-40 sm:h-64 
                   bg-gradient-to-br from-blue-600 via-cyan-400 to-teal-400 
                   rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 
                   bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-400 
                   rounded-full blur-3xl"
      />

      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-10 z-10"
      >
        <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide">
          Attendance Dashboard
        </h1>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 
                      w-full max-w-5xl z-10">
        {[
          {
            icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
            title: "Present",
            desc: "View employees who are currently present.",
            color: "from-green-500 to-emerald-400",
          },
          {
            icon: <XCircle className="w-8 h-8 text-red-400" />,
            title: "Absent",
            desc: "Track employees who are absent today.",
            color: "from-red-500 to-pink-400",
          },
          {
            icon: <Clock className="w-8 h-8 text-yellow-400" />,
            title: "Late Arrivals",
            desc: "See employees who checked in late.",
            color: "from-yellow-500 to-orange-400",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i, duration: 0.7 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 
                       p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-blue-600/20 
                       transition-all duration-300"
          >
            <div
              className={`absolute inset-0 opacity-20 bg-gradient-to-tr ${card.color} blur-2xl`}
            ></div>
            <div className="relative flex flex-col items-center text-center space-y-3">
              <div className="p-3 sm:p-4 bg-gray-800/70 rounded-full">{card.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-100">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-20 px-5 py-2 sm:py-3 animate-bounce rounded-full 
                   bg-gradient-to-r from-blue-600 to-cyan-500 text-white 
                   text-xs sm:text-sm font-semibold flex items-center gap-2 
                   shadow-lg shadow-blue-500/30 z-10"
      >
        <Sparkles className="w-4 h-4" />
        Coming Soon...
      </motion.div>
    </div>
  );
};

export default Attendance;
