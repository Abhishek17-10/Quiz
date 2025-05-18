import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress }) => {
  // Calculate the color gradient based on progress
  const getColor = () => {
    if (progress <= 30) return 'from-blue-400 to-blue-600';
    if (progress <= 70) return 'from-green-400 to-green-600';
    return 'from-purple-400 to-purple-600';
  };

  return (
    <div className="relative w-full mb-6">
      {/* Progress percentage label */}
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">Progress</span>
        <motion.span 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          key={progress} // Re-animate when progress changes
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-white"
        >
          {progress}%
        </motion.span>
      </div>
      
      {/* Main progress bar */}
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
          className={`h-full bg-gradient-to-r ${getColor()} rounded-full shadow-lg relative`}
        >
          {/* Animated glow effect */}
          <motion.div
            animate={{ 
              x: ['-100%', '200%'],
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2.5,
              ease: "linear"
            }}
            className="absolute top-0 bottom-0 w-8 bg-white bg-opacity-30 blur-sm"
          />
        </motion.div>
      </div>
      
      {/* Quiz step indicators */}
      <div className="flex justify-between mt-2">
        {[...Array(10)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ 
              scale: progress/10 > index ? 1 : 0.5,
              opacity: progress/10 > index ? 1 : 0.3
            }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.2
            }}
            className={`w-3 h-3 rounded-full ${
              progress/10 > index 
                ? 'bg-white shadow-glow' 
                : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;