import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Summary = ({ score }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Determine performance level and feedback
  const getPerformance = () => {
    if (score <= 3) return { 
      level: 'Beginner', 
      color: 'text-red-500',
      message: 'Keep practicing! You\'ll improve with time.'
    };
    if (score <= 6) return { 
      level: 'Intermediate', 
      color: 'text-yellow-500',
      message: 'Good effort! You\'re making progress.'
    };
    if (score <= 8) return { 
      level: 'Advanced', 
      color: 'text-green-500',
      message: 'Great job! You know your stuff.'
    };
    return { 
      level: 'Expert', 
      color: 'text-purple-500',
      message: 'Outstanding! You\'ve mastered this quiz!'
    };
  };

  const performance = getPerformance();
  
  useEffect(() => {
    // Trigger confetti animation after component mounts
    setShowConfetti(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-white bg-opacity-90 backdrop-blur-md text-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto"
    >
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: "-10%",
                left: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 1,
                scale: 0.2 + Math.random() * 0.8
              }}
              animate={{ 
                top: "110%",
                rotate: Math.random() * 360,
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 4,
                delay: Math.random() * 2,
                ease: "easeOut" 
              }}
              style={{
                position: "absolute",
                width: "10px",
                height: "10px",
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
                background: [
                  "#FF5733", "#33FF57", "#3357FF", "#F3FF33", 
                  "#FF33F3", "#33FFF3"
                ][Math.floor(Math.random() * 6)]
              }}
            />
          ))}
        </div>
      )}

      {/* Trophy icon */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.5,
          delay: 0.2,
          type: "spring"
        }}
        className="flex justify-center mb-6"
      >
        <div className="bg-yellow-100 p-4 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={score > 7 ? "#FFD700" : "#B8B8B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
        </div>
      </motion.div>

      {/* Result content */}
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-center mb-2"
      >
        Quiz Completed!
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-2xl font-bold">Your Score:</span>
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.8,
              type: "spring",
              stiffness: 200
            }}
            className="flex items-center justify-center bg-blue-600 text-white w-12 h-12 rounded-full text-2xl font-bold"
          >
            {score}
          </motion.span>
          <span className="text-2xl font-bold">/10</span>
        </div>
        
        <div className="text-center mb-6">
          <span className="text-gray-600">Performance Level:</span>
          <p className={`text-xl font-bold ${performance.color}`}>{performance.level}</p>
          <p className="text-gray-600 mt-2">{performance.message}</p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          Try Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('Share feature would go here!')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
        >
          Share Your Score
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Summary;
