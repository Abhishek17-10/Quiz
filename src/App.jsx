import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { questions } from './data/questions';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import Timer from './components/Timer';
import Summary from './components/Summary';
import ThreeBG from './ThreeBG';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  // State management
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(() => Number(localStorage.getItem('score')) || 0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // Track answered questions
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion('medium'));
  const [showSummary, setShowSummary] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null); // To track correct/incorrect for feedback
  const [streak, setStreak] = useState(0); // Track correct answer streak
  const [timeLeft, setTimeLeft] = useState(15); // Track time remaining for bonus points
  const [totalPoints, setTotalPoints] = useState(0); // Total points including time bonuses
  const [animateScore, setAnimateScore] = useState(false); // For score animation
  const containerRef = useRef(null);

  // Memoize sound effects for better performance
  const soundEffects = useMemo(() => ({
    correct: new Audio('/correct.mp3'),
    wrong: new Audio('/wrong.mp3'),
    timeout: new Audio('/timeout.mp3'),
    finish: new Audio('/finish.mp3')
  }), []);

  // Try to play sound (will fail silently if no user interaction yet)
  const playSound = (type) => {
    try {
      if (soundEffects[type]) {
        soundEffects[type].volume = 0.5;
        soundEffects[type].currentTime = 0;
        soundEffects[type].play().catch(() => {});
      }
    } catch (e) {
      // Ignore errors - browsers may block autoplay
    }
  };

  function getRandomQuestion(level) {
    const pool = questions[level];
    
    // Filter out questions we've already seen
    const availableQuestions = pool.filter(q => 
      !answeredQuestions.some(answered => answered.text === q.text)
    );
    
    // If we've seen all questions in this difficulty, reset
    if (availableQuestions.length === 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  // Go to next question, reset flip & timer
  const nextQuestion = useCallback((correct, timeRemaining) => {
    // Update score & difficulty
    if (correct) {
      // Base score + time bonus (faster answers = more points)
      const timeBonus = Math.floor(timeRemaining * 0.5);
      const questionPoints = 10 + timeBonus;
      
      setTotalPoints(prev => prev + questionPoints);
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setDifficulty(prev => {
        // Make it more challenging as the streak increases
        if (streak >= 2) return 'hard';
        return (prev === 'medium' ? 'hard' : 'medium');
      });
    } else {
      setStreak(0); // Reset streak on wrong answer
      setDifficulty(prev => (prev === 'medium' ? 'easy' : 'medium'));
    }
    
    // Track answered question
    setAnsweredQuestions(prev => [...prev, currentQuestion]);

    if (questionIndex >= 9) {
      setShowSummary(true);
      localStorage.setItem('score', score + (correct ? 1 : 0));
      localStorage.setItem('totalPoints', totalPoints + (correct ? (10 + Math.floor(timeRemaining * 0.5)) : 0));
      playSound('finish');
      return;
    }

    // Get next question & increment index
    const nextQ = getRandomQuestion(difficulty);
    setCurrentQuestion(nextQ);
    setQuestionIndex(prev => prev + 1);

    setFlipped(false);
    setIsCorrect(null);
    setResetTimerSignal(prev => prev + 1);
  }, [difficulty, questionIndex, score, currentQuestion, streak, totalPoints, soundEffects]);

  const handleAnswer = (selected) => {
    if (flipped) return; // Prevent multiple answers while flipping

    const correct = selected === currentQuestion.answer;
    setFlipped(true);
    setIsCorrect(correct);
    setAnimateScore(true);
    
    // Play sound based on result
    playSound(correct ? 'correct' : 'wrong');

    // Flip animation duration ~1s, then go to next question
    setTimeout(() => {
      nextQuestion(correct, timeLeft);
    }, 1500);
  };

  // Reset animation after it completes
  useEffect(() => {
    if (animateScore) {
      const timer = setTimeout(() => setAnimateScore(false), 800);
      return () => clearTimeout(timer);
    }
  }, [animateScore]);

  // Background dust particle effect
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center" ref={containerRef}>
      <ThreeBG />
      
      <div className="z-10 p-4 max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {showSummary ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Summary 
                score={score} 
                totalPoints={totalPoints}
                maxStreak={streak}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Adaptive Quiz
                </h1>
                <div className="text-sm text-gray-300 mb-4">
                  Difficulty: 
                  <span className={`ml-1 font-bold ${
                    difficulty === 'easy' ? 'text-green-400' : 
                    difficulty === 'medium' ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {difficulty.toUpperCase()}
                  </span>
                </div>
              </motion.div>
              
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm">Question {questionIndex + 1}/10</div>
                <motion.div 
                  className="flex items-center" 
                  animate={animateScore ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-yellow-300 font-bold mr-2">
                    {streak > 0 && 
                      <span className="inline-flex items-center">
                        <span className="mr-1">🔥</span>
                        <span>{streak}</span>
                      </span>
                    }
                  </div>
                  <div className="bg-purple-900 px-3 py-1 rounded-full text-white">
                    {totalPoints} pts
                  </div>
                </motion.div>
              </div>
              
              <ProgressBar progress={(questionIndex) * 10} />
              
              <Timer
                duration={15}
                resetSignal={resetTimerSignal}
                onTimeout={() => {
                  if (!flipped) {
                    playSound('timeout');
                    handleAnswer(''); 
                  }
                }}
                onTimeUpdate={setTimeLeft}
              />
              
              <QuestionCard
                question={currentQuestion}
                flipped={flipped}
                onAnswer={handleAnswer}
                isCorrect={isCorrect}
                difficulty={difficulty}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;


