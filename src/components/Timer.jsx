import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const Timer = ({ onTimeout, duration = 15, resetSignal, onTimeUpdate }) => {
  const [time, setTime] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const controls = useAnimation();
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset timer
    setTime(duration);
    setIsWarning(false);
    setIsCritical(false);

    // Animate timer bar
    controls.start({
      width: '100%',
      transition: { duration: 0 }
    }).then(() => {
      controls.start({
        width: '0%',
        transition: { duration: duration, ease: 'linear' }
      });
    });

    // Create countdown
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        // Check time thresholds for visual/audio warnings
        const newTime = prev - 1;
        
        // Update parent component with remaining time (for score calculations)
        if (onTimeUpdate) {
          onTimeUpdate(newTime);
        }
        
        if (newTime <= 5 && newTime > 3) {
          setIsWarning(true);
          setIsCritical(false);
        } else if (newTime <= 3 && newTime > 0) {
          setIsWarning(false);
          setIsCritical(true);
          
          // Play tick sound for last 3 seconds
          try {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          } catch (e) {
            // Browsers may block audio without user interaction
          }
        }
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          onTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [duration, onTimeout, controls, resetSignal, onTimeUpdate]);

  // Calculate timer color and animation based on remaining time
  const getTimerColor = () => {
    if (isCritical) return 'bg-red-600';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-gradient-to-r from-blue-400 to-purple-500';
  };

  return (
    <div className="w-full max-w-md mx-auto p-2 mb-6">
      {/* Hidden audio element for tick sound */}
      <audio ref={audioRef} src="/tick.mp3" preload="auto"></audio>
      
      <div className="relative w-full h-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        <motion.div
          animate={controls}
          initial={{ width: '100%' }}
          className={`h-full ${getTimerColor()}`}
        />
        
        {/* Pulsing overlay for critical time */}
        <AnimatePresence>
          {isCritical && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="absolute inset-0 bg-red-500"
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-gray-400">Time Remaining</div>
        <motion.div
          animate={{
            scale: isCritical ? [1, 1.2, 1] : 1,
            color: isCritical ? '#FF0000' : isWarning ? '#FFD700' : '#FFFFFF',
          }}
          transition={{ 
            duration: 0.5, 
            repeat: isCritical ? Infinity : 0,
            repeatType: "mirror"
          }}
          className="font-mono font-bold select-none text-lg flex items-center"
        >
          {isCritical && (
            <motion.span 
              className="mr-1 text-red-500"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ⚠️
            </motion.span>
          )}
          <span className={`
            ${isCritical ? 'text-red-500' : isWarning ? 'text-yellow-400' : 'text-white'}
          `}>
            {time}s
          </span>
        </motion.div>
      </div>
      
      {/* Show bonus points indicator */}
      {time > 5 && (
        <div className="text-xs text-right mt-1 text-green-400">
          Time bonus: +{Math.floor(time * 0.5)} pts
        </div>
      )}
    </div>
  );
};

export default Timer;

