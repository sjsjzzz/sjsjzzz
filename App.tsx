import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionnaireScreen from './components/QuestionnaireScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import ComparisonScreen from './components/ComparisonScreen';
import { SECTIONS } from './constants/questions';
import type { Answers, PatientInfo, SurveyResult } from './types';

type Screen = 'welcome' | 'questionnaire' | 'results' | 'history' | 'comparison';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [history, setHistory] = useState<SurveyResult[]>([]);
  const [comparisonSelection, setComparisonSelection] = useState<string[]>([]);

  const loadHistory = useCallback(() => {
    try {
      const savedResults = localStorage.getItem('surveyResults');
      if (savedResults) {
        setHistory(JSON.parse(savedResults));
      }
    } catch (error) {
      console.error("기록을 불러오는 데 실패했습니다.", error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const resetState = useCallback(() => {
    setAnswers({});
    setCurrentSectionIndex(0);
    setPatientInfo(null);
    setComparisonSelection([]);
  }, []);

  const handleStart = (info: PatientInfo) => {
    resetState();
    setPatientInfo(info);
    setScreen('questionnaire');
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      setScreen('results');
    }
  };

  const handleRestart = () => {
    resetState();
    loadHistory(); // Reload history in case new results were saved
    setScreen('welcome');
  };

  const handleViewHistory = () => {
    loadHistory();
    setScreen('history');
  };

  const handleCompare = (ids: string[]) => {
    setComparisonSelection(ids);
    setScreen('comparison');
  };
  
  const handleBackToHistory = () => {
    setComparisonSelection([]);
    setScreen('history');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'questionnaire':
        return (
          <QuestionnaireScreen
            currentSectionIndex={currentSectionIndex}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNextSection={handleNextSection}
          />
        );
      case 'results':
        return <ResultsScreen answers={answers} patientInfo={patientInfo} onRestart={handleRestart} />;
      case 'history':
        return <HistoryScreen onCompare={handleCompare} onNewTest={handleRestart} />;
      case 'comparison':
        return <ComparisonScreen resultIds={comparisonSelection} onBack={handleBackToHistory} />;
      case 'welcome':
      default:
        return <WelcomeScreen onStart={handleStart} onViewHistory={handleViewHistory} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
