
import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200/50">
      {children}
    </div>
  );
};

export default Card;
