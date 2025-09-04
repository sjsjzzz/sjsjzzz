export enum SurveySection {
  Anxiety = 'anxiety',
  Depression = 'depression',
  Insomnia = 'insomnia',
}

export interface Question {
  id: string;
  section: SurveySection;
  text: string;
}

export interface AnswerOption {
  text: string;
  value: number;
}

export interface Answers {
  [questionId: string]: number;
}

export interface ScoreInterpretation {
  level: string;
  description: string;
  color: string;
  lifestyle: string;
  treatment: string;
}

export interface PatientInfo {
  name: string;
  birthdate: string;
}

export interface ResultItem {
  section: SurveySection;
  title: string;
  displayTitle: string;
  score: number;
  maxScore: number;
  interpretation: ScoreInterpretation;
}

export interface SurveyResult {
  id: string;
  patientInfo: PatientInfo;
  date: string;
  results: ResultItem[];
}
