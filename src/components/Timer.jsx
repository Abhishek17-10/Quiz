import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Timer = ({ onTimeout, duration = 15 }) => {
  const [time, setTime] = useState(duration);
  const controls = useAnimation();
  const intervalRef = useRef(null);

  useEffect(() => {
    setTime(duration);

    controls.start({
      width: '100%',
      transition: { duration: 0 }
    }).then(() => {
      controls.start({
        width: '0%',
        transition: { duration: duration, ease: 'linear' }
      });
    });

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [duration, onTimeout, controls]);

  const pulse = time <= 5 && time > 0;

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden shadow-inner">
        <motion.div
          animate={controls}
          initial={{ width: '100%' }}
          className="h-full bg-gradient-to-r from-yellow-400 via-red-400 to-red-600 origin-left"
        />
      </div>
      <motion.div
        animate={{
          scale: pulse ? [1, 1.3, 1] : 1,
          color: pulse ? ['#000', '#ff4444', '#000'] : '#facc15',
        }}
        transition={{ duration: 0.8, repeat: pulse ? Infinity : 0 }}
        className="text-center mt-1 text-yellow-400 font-semibold select-none text-lg"
      >
        Time Left: {time}s
      </motion.div>
    </div>
  );
};

export default Timer

