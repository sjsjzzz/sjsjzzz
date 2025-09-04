import React, { useMemo } from 'react';
import type { Answers } from '../types/index';
import { SurveySection } from '../types/index';
import { SECTIONS, SECTION_DETAILS, QUESTIONS, ANSWER_OPTIONS, INSOMNIA_CUSTOM_OPTIONS } from '../constants/questions';
import Card from './Card';
import ProgressBar from './ProgressBar';

interface QuestionnaireScreenProps {
  currentSectionIndex: number;
  answers: Answers;
  onAnswerChange: (questionId: string, value: number) => void;
  onNextSection: () => void;
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({
  currentSectionIndex,
  answers,
  onAnswerChange,
  onNextSection,
}) => {
  const currentSection = SECTIONS[currentSectionIndex];
  const sectionDetails = SECTION_DETAILS[currentSection];
  
  const sectionQuestions = useMemo(() => 
    QUESTIONS.filter(q => q.section === currentSection),
    [currentSection]
  );
  
  const isSectionComplete = useMemo(() => 
    sectionQuestions.every(q => answers[q.id] !== undefined),
    [answers, sectionQuestions]
  );

  return (
    <Card>
      <ProgressBar currentStep={currentSectionIndex + 1} totalSteps={SECTIONS.length} />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">{sectionDetails.title}</h2>
        <p className="mt-2 text-slate-600">{sectionDetails.description}</p>
      </div>
      
      <div className="space-y-8">
        {sectionQuestions.map((question, index) => {
          const options = currentSection === SurveySection.Insomnia && INSOMNIA_CUSTOM_OPTIONS[question.id]
            ? INSOMNIA_CUSTOM_OPTIONS[question.id]
            : ANSWER_OPTIONS[currentSection];

          return (
            <div key={question.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-700 mb-4">{`${index + 1}. ${question.text}`}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onAnswerChange(question.id, option.value)}
                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200 border transform active:scale-95
                      ${answers[question.id] === option.value
                        ? 'bg-primary text-white border-primary-dark shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-primary-light hover:border-primary hover:scale-105'
                      }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-10 text-center">
        <button
          onClick={onNextSection}
          disabled={!isSectionComplete}
          className="px-10 py-3 bg-primary text-white font-bold rounded-full transition-colors duration-300 shadow-lg
            disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none
            hover:bg-primary-dark"
        >
          {currentSectionIndex < SECTIONS.length - 1 ? '다음' : '결과 보기'}
        </button>
      </div>
    </Card>
  );
};

export default QuestionnaireScreen;