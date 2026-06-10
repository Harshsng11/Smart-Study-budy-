export interface ImportantTopic {
  id: string;
  title: string;
  importance: 'High' | 'Medium' | 'Critical';
  concept: string;
  explanation: string;
  keyPoints: string[];
}

export interface VivaQuestion {
  id: string;
  question: string;
  answer: string;
  hint: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UnitSummary {
  unitNumber: number;
  unitTitle: string;
  summaryText: string;
  keyTerms: { term: string; definition: string }[];
}

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  summaries: UnitSummary[];
  topics: ImportantTopic[];
  vivaQuestions: VivaQuestion[];
  quizQuestions: QuizQuestion[];
}

export interface UserProgress {
  completedQuizIds: Record<string, number>; // quizId: high score
  masteredVivaIds: string[]; // vivaIds marked as "mastered"
  completedTopicIds: string[]; // topics read/checked
  customNotes: CustomNote[];
  studyPlanner: StudyPlan | null;
}

export interface CustomNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  inferredKeywords: string[];
  autoSummary: string[];
  autoFlashcards: { question: string; answer: string }[];
}

export interface StudyPlanDay {
  day: number;
  dateStr: string;
  tasks: { id: string; label: string; done: boolean; subjectId: string }[];
}

export interface StudyPlan {
  id: string;
  targetExam: string;
  examDate: string;
  createdAt: string;
  days: StudyPlanDay[];
}
