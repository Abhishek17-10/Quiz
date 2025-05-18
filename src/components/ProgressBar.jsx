import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-300 rounded-full mb-2">
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
