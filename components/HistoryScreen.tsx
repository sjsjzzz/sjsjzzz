import React, { useState, useEffect } from 'react';
import type { SurveyResult } from '../types';
import Card from './Card';

interface HistoryScreenProps {
  onCompare: (ids: string[]) => void;
  onNewTest: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ onCompare, onNewTest }) => {
  const [history, setHistory] = useState<SurveyResult[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('surveyResults');
      if (savedResults) {
        const parsedResults: SurveyResult[] = JSON.parse(savedResults);
        // Sort by date, newest first
        parsedResults.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
        setHistory(parsedResults);
      }
    } catch (error) {
      console.error("기록을 불러오는 데 실패했습니다.", error);
    }
  }, []);

  const handleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length < 2) {
          return [...prev, id];
        }
        return prev; // Limit selection to 2
      }
    });
  };

  const isCompareDisabled = selected.length !== 2;

  return (
    <Card>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">지난 결과 보기</h1>
        <p className="mt-2 text-slate-600">비교하고 싶은 두 개의 결과를 선택하세요.</p>
      </div>

      {history.length === 0 ? (
        <p className="text-center text-slate-500 py-10">저장된 결과가 없습니다.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {history.map(result => (
            <div
              key={result.id}
              onClick={() => handleSelect(result.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selected.includes(result.id)
                  ? 'bg-primary-light border-primary shadow-md scale-105'
                  : 'bg-white border-slate-200 hover:border-primary-dark'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{result.patientInfo.name}님</p>
                  <p className="text-sm text-slate-500">{result.date}</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end" style={{maxWidth: '50%'}}>
                  {result.results.map(r => (
                    <span key={r.section} className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${r.interpretation.color}`}>
                      {r.title}: {r.interpretation.level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => onCompare(selected)}
          disabled={isCompareDisabled}
          className="px-10 py-3 bg-secondary-dark text-white font-bold rounded-full transition-colors duration-300 shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          결과 비교하기 ({selected.length}/2)
        </button>
        <button
          onClick={onNewTest}
          className="px-10 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors duration-300 shadow-lg"
        >
          새 설문 시작하기
        </button>
      </div>
    </Card>
  );
};

export default HistoryScreen;
