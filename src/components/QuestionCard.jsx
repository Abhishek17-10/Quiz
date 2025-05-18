import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({ question, onAnswer, flipped, isCorrect, difficulty }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState(false);
  const [hintTimer, setHintTimer] = useState(null);

  // Reset on new question
  useEffect(() => {
    setSelectedOption(null);
    setHint(false);
    
    // Clear any existing hint timer
    if (hintTimer) clearTimeout(hintTimer);
    
    // For harder questions, offer hint after 8 seconds
    if (difficulty === 'hard') {
      const timer = setTimeout(() => {
        setHint(true);
      }, 8000);
      setHintTimer(timer);
    }
    
    return () => {
      if (hintTimer) clearTimeout(hintTimer);
    };
  }, [question, difficulty]);

  // Handle when user clicks an option
  const handleAnswer = (selected) => {
    if (flipped) return; // Prevent multiple selections
    
    setSelectedOption(selected);
    
    if (selected !== question.answer) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    
    onAnswer(selected);
  };

  // Determine card background based on difficulty
  const getCardBackground = () => {
    switch(difficulty) {
      case 'easy':
        return 'from-green-100 to-blue-100';
      case 'medium':
        return 'from-yellow-100 to-orange-100';
      case 'hard':
        return 'from-red-100 to-purple-100';
      default:
        return 'from-white to-gray-100';
    }
  };

  // Determine which options to highlight for a hint
  // For hard questions, eliminate 1 wrong answer
  const getHintOptions = () => {
    if (!hint || difficulty !== 'hard') return [];
    
    const wrongOptions = question.options.filter(opt => opt !== question.answer);
    const keepWrong = wrongOptions.slice(0, 2); // Keep 2 wrong answers
    return [question.answer, ...keepWrong];
  };

  const hintOptions = getHintOptions();

  return (
    <motion.div
      layout
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br ${getCardBackground()} backdrop-blur-md rounded-lg p-8 shadow-2xl max-w-3xl w-full mx-auto text-gray-900`}
    >
      {/* Difficulty badge */}
      <div className="absolute top-3 right-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          difficulty === 'easy' ? 'bg-green-500 text-white' : 
          difficulty === 'medium' ? 'bg-yellow-500 text-black' : 
          'bg-red-500 text-white'
        }`}>
          {difficulty.toUpperCase()}
        </span>
      </div>
      
      <motion.h2 
        className="text-3xl font-bold mb-8 text-gray-900"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {question.text}
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {question.options.map((option, index) => {
            // Visual feedback states
            const isSelected = selectedOption === option;
            const isAnswer = question.answer === option;
            const showCorrect = flipped && isAnswer;
            const showWrong = flipped && isSelected && !isAnswer;
            const dimOption = flipped && !isSelected && !isAnswer;
            const highlightHint = hint && hintOptions.includes(option);
            
            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: dimOption ? 0.6 : 1, 
                  y: 0,
                  scale: isSelected ? 1.05 : 1,
                  boxShadow: highlightHint && !flipped ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none'
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={flipped}
                className={`relative flex justify-center items-center h-16 font-semibold py-3 px-5 rounded-lg shadow-md transition-all duration-300 ${
                  showCorrect ? 'bg-green-500 text-white' :
                  showWrong ? 'bg-red-500 text-white' :
                  isSelected ? 'bg-purple-600 text-white' :
                  'bg-white hover:bg-purple-100 text-gray-800 hover:text-purple-800'
                }`}
              >
                {/* Adding option letter prefix */}
                <span className="absolute left-3 opacity-60">
                  {String.fromCharCode(65 + index)}.
                </span>
                
                <span>{option}</span>
                
                {/* Show check/x icon for correct/wrong answers */}
                <AnimatePresence>
                  {showCorrect && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 text-white"
                    >
                      ✓
                    </motion.span>
                  )}
                  {showWrong && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 text-white"
                    >
                      ✗
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Feedback message */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className={`mt-6 p-3 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect 
              ? <p>Correct! Well done!</p> 
              : <p>Wrong! The correct answer is: <strong>{question.answer}</strong></p>
            }
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hint for hard questions */}
      <AnimatePresence>
        {hint && !flipped && difficulty === 'hard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm text-blue-600 italic"
          >
            Hint: Consider the highlighted options
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

