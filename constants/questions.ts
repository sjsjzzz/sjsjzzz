import type { Question, AnswerOption, ScoreInterpretation } from '../types/index';
import { SurveySection } from '../types/index';

export const SECTIONS: SurveySection[] = [SurveySection.Anxiety, SurveySection.Depression, SurveySection.Insomnia];

export const SECTION_DETAILS: Record<SurveySection, { title: string; description: string }> = {
  [SurveySection.Anxiety]: {
    title: '😟 불안 척도 (GAD-7)',
    description: '지난 2주 동안 아래 문제들로 인해 얼마나 자주 방해를 받았는지 표시해주세요.',
  },
  [SurveySection.Depression]: {
    title: '😔 우울 척도 (PHQ-9)',
    description: '지난 2주 동안 아래 문제들로 인해 얼마나 자주 방해를 받았는지 표시해주세요.',
  },
  [SurveySection.Insomnia]: {
    title: '😴 불면증 척도 (ISI)',
    description: '지난 2주 동안의 수면 양상에 대해 가장 적절한 숫자를 선택해주세요.',
  },
};

export const QUESTIONS: Question[] = [
  // Anxiety (GAD-7)
  { id: 'anxiety-1', section: SurveySection.Anxiety, text: '신경이 과민해지거나 안절부절못하고 조마조마한 느낌이 들었다.' },
  { id: 'anxiety-2', section: SurveySection.Anxiety, text: '걱정을 멈출 수 없거나 조절할 수 없었다.' },
  { id: 'anxiety-3', section: SurveySection.Anxiety, text: '여러 가지 것들에 대해 너무 많이 걱정했다.' },
  { id: 'anxiety-4', section: SurveySection.Anxiety, text: '편안하게 있기가 어려웠다.' },
  { id: 'anxiety-5', section: SurveySection.Anxiety, text: '너무 안절부절못해서 가만히 앉아 있기가 어려웠다.' },
  { id: 'anxiety-6', section: SurveySection.Anxiety, text: '쉽게 짜증이 나거나 신경질이 났다.' },
  { id: 'anxiety-7', section: SurveySection.Anxiety, text: '끔찍한 일이 일어날 것 같은 두려움을 느꼈다.' },

  // Depression (PHQ-9)
  { id: 'depression-1', section: SurveySection.Depression, text: '거의 모든 활동에 대한 흥미나 즐거움이 거의 없었다.' },
  { id: 'depression-2', section: SurveySection.Depression, text: '기분이 가라앉거나, 우울하거나, 희망이 없다고 느꼈다.' },
  { id: 'depression-3', section: SurveySection.Depression, text: '잠들기 어렵거나, 계속 잠을 자기가 어렵거나, 혹은 너무 많이 잤다.' },
  { id: 'depression-4', section: SurveySection.Depression, text: '피곤하거나 기운이 거의 없다고 느꼈다.' },
  { id: 'depression-5', section: SurveySection.Depression, text: '식욕이 없거나 혹은 너무 많이 먹었다.' },
  { id: 'depression-6', section: SurveySection.Depression, text: '자신을 부정적으로 생각했다. (예: 실패자, 가족을 실망시킴)' },
  { id: 'depression-7', section: SurveySection.Depression, text: '신문을 읽거나 TV를 보는 것과 같은 일에 집중하기가 어려웠다.' },
  { id: 'depression-8', section: SurveySection.Depression, text: '다른 사람들이 알아챌 정도로 너무 느리게 움직이거나 말을 했다. 혹은 이와는 반대로, 너무 초조해하거나 안절부절못해서 평소보다 훨씬 더 많이 돌아다녔다.' },
  { id: 'depression-9', section: SurveySection.Depression, text: '차라리 죽는 것이 낫겠다고 생각하거나, 어떻게든 자신을 해칠 것이라고 생각했다.' },

  // Insomnia (ISI)
  { id: 'insomnia-1', section: SurveySection.Insomnia, text: '잠들기 어려운 정도' },
  { id: 'insomnia-2', section: SurveySection.Insomnia, text: '잠을 유지하기 어려운 정도' },
  { id: 'insomnia-3', section: SurveySection.Insomnia, text: '너무 일찍 깨는 문제' },
  { id: 'insomnia-4', section: SurveySection.Insomnia, text: '현재 수면 문제에 대해 얼마나 만족/불만족하십니까?' },
  { id: 'insomnia-5', section: SurveySection.Insomnia, text: '수면 문제가 일상 기능(예: 주간 피로, 기분, 업무/학업 수행, 집중력, 기억력, 활력 등)에 어느 정도 지장을 줍니까?' },
  { id: 'insomnia-6', section: SurveySection.Insomnia, text: '다른 사람들은 당신의 수면 문제로 인해 삶의 질이 저하되었다고 어느 정도 생각합니까?' },
  { id: 'insomnia-7', section: SurveySection.Insomnia, text: '현재의 수면 문제에 대해 어느 정도 걱정/고민하십니까?' },
];

export const ANSWER_OPTIONS: Record<SurveySection, AnswerOption[]> = {
  [SurveySection.Anxiety]: [
    { text: '전혀 없음', value: 0 },
    { text: '며칠 동안', value: 1 },
    { text: '7일 이상', value: 2 },
    { text: '거의 매일', value: 3 },
  ],
  [SurveySection.Depression]: [
    { text: '전혀 없음', value: 0 },
    { text: '며칠 동안', value: 1 },
    { text: '7일 이상', value: 2 },
    { text: '거의 매일', value: 3 },
  ],
  [SurveySection.Insomnia]: [
    { text: '없음', value: 0 },
    { text: '가벼움', value: 1 },
    { text: '중간', value: 2 },
    { text: '심각함', value: 3 },
    { text: '매우 심각함', value: 4 },
  ],
};

export const INSOMNIA_CUSTOM_OPTIONS: Record<string, AnswerOption[]> = {
    'insomnia-4': [
        { text: '매우 만족', value: 0 },
        { text: '만족', value: 1 },
        { text: '약간 만족', value: 2 },
        { text: '불만족', value: 3 },
        { text: '매우 불만족', value: 4 },
    ],
    'insomnia-5': [
        { text: '전혀 지장 없음', value: 0 },
        { text: '약간', value: 1 },
        { text: '어느 정도', value: 2 },
        { text: '많이', value: 3 },
        { text: '매우 많이', value: 4 },
    ],
    'insomnia-6': [
        { text: '전혀 아님', value: 0 },
        { text: '약간', value: 1 },
        { text: '어느 정도', value: 2 },
        { text: '많이', value: 3 },
        { text: '매우 많이', value: 4 },
    ],
    'insomnia-7': [
        { text: '전혀 걱정 안 함', value: 0 },
        { text: '약간', value: 1 },
        { text: '어느 정도', value: 2 },
        { text: '많이', value: 3 },
        { text: '매우 많이', value: 4 },
    ],
}


export const SCORE_INTERPRETATIONS: Record<SurveySection, (score: number) => ScoreInterpretation> = {
  [SurveySection.Anxiety]: (score) => {
    if (score <= 4) return { level: '정상', description: '불안 증상이 거의 없습니다.', color: 'bg-green-500', lifestyle: '현재의 좋은 생활 습관을 유지하세요.', treatment: '특별한 치료가 필요하지 않습니다.' };
    if (score <= 9) return { level: '경도', description: '가벼운 수준의 불안이 의심됩니다.', color: 'bg-yellow-500', lifestyle: '규칙적인 운동, 명상, 심호흡 등 스트레스 관리 기법을 시도해보세요.', treatment: '증상이 지속되거나 악화되면 전문가 상담을 고려해볼 수 있습니다.' };
    if (score <= 14) return { level: '중등도', description: '중간 수준의 불안이 의심됩니다.', color: 'bg-orange-500', lifestyle: '스트레스 원인을 파악하고, 전문가와 상담하여 대처 기술을 배우는 것이 좋습니다.', treatment: '상담 치료나 약물 치료 등 적극적인 개입을 고려해야 합니다.' };
    return { level: '중증', description: '심각한 수준의 불안이 의심됩니다.', color: 'bg-red-500', lifestyle: '스스로 관리하기 어려운 수준일 수 있습니다. 즉시 전문가의 도움을 받으세요.', treatment: '정신건강 전문가의 평가와 집중적인 치료가 반드시 필요합니다.' };
  },
  [SurveySection.Depression]: (score) => {
    if (score <= 4) return { level: '정상', description: '우울 증상이 거의 없습니다.', color: 'bg-green-500', lifestyle: '균형 잡힌 식단과 꾸준한 신체 활동을 유지하세요.', treatment: '특별한 치료가 필요하지 않습니다.' };
    if (score <= 9) return { level: '경도', description: '가벼운 수준의 우울감이 의심됩니다.', color: 'bg-yellow-500', lifestyle: '햇볕을 자주 쬐고, 즐거움을 주는 활동에 참여해보세요. 사회적 관계를 유지하는 것이 중요합니다.', treatment: '상태를 지속적으로 관찰하고, 호전되지 않으면 전문가와 상담하는 것이 좋습니다.' };
    if (score <= 14) return { level: '중등도', description: '중간 수준의 우울감이 의심됩니다.', color: 'bg-orange-500', lifestyle: '혼자 해결하기보다 가족이나 친구에게 어려움을 이야기하고 도움을 요청하세요.', treatment: '상담 치료와 함께 약물 치료를 병행하는 것을 고려할 수 있습니다.' };
    if (score <= 19) return { level: '중증도', description: '다소 심각한 수준의 우울감이 의심됩니다.', color: 'bg-red-500', lifestyle: '일상 기능에 어려움이 클 수 있으므로, 중요한 결정을 미루고 전문가의 도움을 우선으로 받으세요.', treatment: '적극적인 약물 치료와 상담 치료가 필요하며, 전문가의 지속적인 관리가 중요합니다.' };
    return { level: '중증', description: '심각한 수준의 우울감이 의심됩니다.', color: 'bg-red-700', lifestyle: '자신을 돌보는 것이 매우 중요합니다. 안전한 환경에서 전문가의 지시에 따라주세요.', treatment: '입원 치료를 포함한 집중적인 정신건강의학적 치료가 시급히 필요합니다.' };
  },
  [SurveySection.Insomnia]: (score) => {
    if (score <= 7) return { level: '정상', description: '임상적으로 유의미한 불면증이 아닙니다.', color: 'bg-green-500', lifestyle: '좋은 수면 위생(일정한 기상 시간, 자기 전 스마트폰 사용 자제 등)을 계속 실천하세요.', treatment: '특별한 치료가 필요하지 않습니다.' };
    if (score <= 14) return { level: '경도', description: '가벼운 수준의 불면증(역치하 불면증)입니다.', color: 'bg-yellow-500', lifestyle: '수면 환경을 점검하고(온도, 소음, 빛), 카페인 섭취를 줄여보세요. 낮잠은 피하는 것이 좋습니다.', treatment: '수면 위생 교육만으로 호전될 수 있습니다. 개선되지 않으면 전문가와 상담하세요.' };
    if (score <= 21) return { level: '중등도', description: '중간 수준의 불면증이 의심됩니다.', color: 'bg-orange-500', lifestyle: '잠자리에 누워 20분 이상 잠이 오지 않으면 일어나서 이완 활동(독서, 조용한 음악 감상)을 해보세요.', treatment: '불면증 인지행동치료(CBT-I)가 효과적일 수 있습니다. 전문가와 상담을 권장합니다.' };
    return { level: '중증', description: '심각한 수준의 불면증이 의심됩니다.', color: 'bg-red-500', lifestyle: '수면 문제로 인해 주간 기능 저하가 심각할 수 있습니다. 안전에 유의하고 전문가의 지시를 따르세요.', treatment: '전문적인 평가를 통해 원인 질환을 감별하고, 약물 치료를 포함한 적극적인 치료가 필요합니다.' };
  },
};