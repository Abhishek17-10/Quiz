import React, { useEffect, useState, useCallback } from 'react';
import { questions } from './data/questions';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import Timer from './components/Timer';
import Summary from './components/Summary';
import ThreeBG from './ThreeBG';

const App = () => {
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(() => Number(localStorage.getItem('score')) || 0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion('medium'));
  const [showSummary, setShowSummary] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [resetTimerSignal, setResetTimerSignal] = useState(0);

  function getRandomQuestion(level) {
    const pool = questions[level];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Go to next question, reset flip & timer
  const nextQuestion = useCallback((correct) => {
    // Update score & difficulty
    if (correct) {
      setScore(prev => prev + 1);
      setDifficulty(prev => (prev === 'medium' ? 'hard' : 'medium'));
    } else {
      setDifficulty(prev => (prev === 'medium' ? 'easy' : 'medium'));
    }

    if (questionIndex >= 9) {
      setShowSummary(true);
      localStorage.setItem('score', score + (correct ? 1 : 0));
      return;
    }

    // Get next question & increment index
    const nextQ = getRandomQuestion(difficulty);
    setCurrentQuestion(nextQ);
    setQuestionIndex(prev => prev + 1);

    setFlipped(false);
    setResetTimerSignal(prev => prev + 1);
  }, [difficulty, questionIndex, score]);

  const handleAnswer = (selected) => {
    if (flipped) return; // Prevent multiple answers while flipping

    const correct = selected === currentQuestion.answer;
    setFlipped(true);

    // Flip animation duration ~1s, then go to next question
    setTimeout(() => {
      nextQuestion(correct);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <ThreeBG />
      <div className="z-10 p-4 max-w-2xl w-full">
        {showSummary ? (
          <Summary score={score} />
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center mb-4">Adaptive Quiz</h1>
            <ProgressBar progress={(questionIndex + 1) * 10} />
            <Timer
              duration={15}
              resetSignal={resetTimerSignal}
              onTimeout={() => {
                // Timeout acts as incorrect answer (no selection)
                if (!flipped) {
                  handleAnswer(''); 
                }
              }}
            />
            <QuestionCard
              question={currentQuestion}
              flipped={flipped}
              onAnswer={handleAnswer}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;


