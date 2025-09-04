
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-primary-dark">진행 단계</span>
        <span className="text-sm font-medium text-primary-dark">{currentStep} / {totalSteps}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
