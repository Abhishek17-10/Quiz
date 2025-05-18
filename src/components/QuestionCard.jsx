import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function QuestionCard({ question, onAnswer }) {
  const [isWrong, setIsWrong] = useState(false);

  // Handle when user clicks an option
  const handleAnswer = (selected) => {
    if (selected !== question.answer) {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 600);
    }
    onAnswer(selected);
  };

  return (
    <motion.div
      animate={isWrong ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg p-8 shadow-2xl max-w-3xl w-full mx-auto"
      style={{ userSelect: 'none' }}
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-900">{question.text}</h2>
      <div className="grid grid-cols-2 gap-6">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

