import React, { useState } from 'react';
import type { PatientInfo } from '../types/index';
import Card from './Card';

interface WelcomeScreenProps {
  onStart: (patientInfo: PatientInfo) => void;
  onViewHistory: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewHistory }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (name.trim() === '' || birthdate.trim() === '') {
      setError('이름과 생년월일을 모두 입력해주세요.');
      return;
    }
    setError('');
    onStart({ name, birthdate });
  };

  return (
    <Card>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">마음 상태 자가 진단</h1>
        <p className="text-slate-600 mb-8">
          불안, 우울, 불면증에 대한 간단한 설문을 통해 자신의 마음 상태를 점검해보세요.
        </p>
      </div>
      
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-slate-700 mb-1">생년월일</label>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleStart}
          className="w-full px-10 py-3 bg-primary text-white font-bold rounded-full transition-colors duration-300 shadow-lg hover:bg-primary-dark"
        >
          시작하기
        </button>
        <button
          onClick={onViewHistory}
          className="w-full px-10 py-3 bg-slate-200 text-slate-700 font-bold rounded-full transition-colors duration-300 hover:bg-slate-300"
        >
          지난 결과 보기
        </button>
      </div>

      <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-r-lg text-sm">
        <p>
          <strong>참고:</strong> 이 설문은 전문적인 의학적 진단을 대체하지 않습니다. 정신 건강에 대한 우려가 있다면 전문가와 상담하세요.
        </p>
      </div>
    </Card>
  );
};

export default WelcomeScreen;
