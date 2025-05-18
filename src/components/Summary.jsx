import React from 'react';

const Summary = ({ score }) => {
  return (
    <div className="text-center p-6 bg-green-100 text-black rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
      <p className="text-xl mb-4">Your Score: {score} / 10</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900"
      >
        Retry Quiz
      </button>
    </div>
  );
};

export default Summary;
