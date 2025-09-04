import React, { useMemo, useState } from 'react';
// FIX: `SurveySection` is an enum used as a value at runtime (e.g., `Object.values(SurveySection)`), so it must be imported as a value, not a type.
import { SurveySection } from '../types/index';
import type { Answers, PatientInfo } from '../types/index';
import { QUESTIONS, SCORE_INTERPRETATIONS, SECTION_DETAILS } from '../constants/questions';
import Card from './Card';
import ResultsChart from './ResultsChart';

interface ResultsScreenProps {
  answers: Answers;
  patientInfo: PatientInfo | null;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ answers, patientInfo, onRestart }) => {
  const [isSaved, setIsSaved] = useState(false);

  const results = useMemo(() => {
    return (Object.values(SurveySection) as SurveySection[]).map(section => {
      const sectionQuestions = QUESTIONS.filter(q => q.section === section);
      const score = sectionQuestions.reduce((total, q) => total + (answers[q.id] || 0), 0);
      const interpretation = SCORE_INTERPRETATIONS[section](score);
      
      let maxScore = 0;
      if (section === SurveySection.Insomnia) {
        maxScore = sectionQuestions.length * 4;
      } else {
        maxScore = sectionQuestions.length * 3;
      }

      const fullTitle = SECTION_DETAILS[section].title;
      const titleParts = fullTitle.split(' '); // e.g., ['😟', '불안', '척도', '(GAD-7)']
      
      return {
        section,
        title: titleParts[1], // "불안" - for chart
        displayTitle: `${titleParts[0]} ${titleParts[1]}`, // "😟 불안" - for headers
        score,
        maxScore,
        interpretation,
      };
    });
  }, [answers]);

  const handleSave = () => {
    if (!patientInfo) return;
    const resultToSave = {
      id: new Date().toISOString(),
      patientInfo,
      date: new Date().toLocaleDateString('ko-KR'),
      results,
    };
    try {
      const existingResults = JSON.parse(localStorage.getItem('surveyResults') || '[]');
      localStorage.setItem('surveyResults', JSON.stringify([...existingResults, resultToSave]));
      setIsSaved(true);
    } catch (error) {
      console.error("결과 저장에 실패했습니다.", error);
      alert("결과를 저장하는 데 문제가 발생했습니다.");
    }
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">설문 결과</h1>
        {patientInfo && (
          <p className="mt-2 text-slate-600">
            <span className="font-semibold">{patientInfo.name}</span>님
            (생년월일: {patientInfo.birthdate})의 마음 상태 분석 결과입니다.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full max-w-md mx-auto">
          <ResultsChart results={results} />
        </div>
        <div className="space-y-4">
          {results.map(result => (
            <div key={result.section} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-700">{result.displayTitle}</h3>
                <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${result.interpretation.color}`}>
                  {result.interpretation.level}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{result.interpretation.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 space-y-6">
        {results.map(result => (
          <div key={result.section} className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-baseline mb-2">
               <h3 className="text-xl font-bold text-slate-800">{result.displayTitle} 종합</h3>
               <p className="text-2xl font-bold text-slate-800 shrink-0 ml-4">{result.score}<span className="text-base font-normal text-slate-500"> / {result.maxScore}</span></p>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex">
                <span className="font-semibold w-24 shrink-0">🌱 생활 관리</span>
                <p className="text-slate-700">{result.interpretation.lifestyle}</p>
              </div>
              <div className="flex">
                <span className="font-semibold w-24 shrink-0">⚕️ 치료 제안</span>
                <p className="text-slate-700">{result.interpretation.treatment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-r-lg">
        <h4 className="font-bold">⚠️ 중요 안내</h4>
        <p className="text-sm">
          본 결과는 전문적인 의학적 진단을 대체할 수 없습니다. 정신건강에 대한 우려가 있으시다면, 반드시 전문가와 상담하시기 바랍니다.
        </p>
      </div>

      <div className="mt-10 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="w-full sm:w-auto px-10 py-3 bg-secondary-dark text-white font-bold rounded-full transition-colors duration-300 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isSaved ? '저장 완료 ✓' : '💾 결과 저장하기'}
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-10 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors duration-300 shadow-lg"
        >
          🔄 새 설문 시작하기
        </button>
      </div>
    </Card>
  );
};

export default ResultsScreen;