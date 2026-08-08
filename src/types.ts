export type NavigationTab = 
  | 'home' 
  | 'interview' 
  | 'journey' 
  | 'architecture' 
  | 'analytics' 
  | 'feedback';

export type TopicTrack = 
  | 'RAG Systems' 
  | 'Vector Databases' 
  | 'Agentic AI' 
  | 'Model Context Protocol (MCP)' 
  | 'Prompt Engineering' 
  | 'AI Deployment & Production';

export type DifficultyLevel = 'Foundational' | 'Intermediate' | 'Advanced' | 'Staff/Principal';

export interface AnswerEvaluation {
  clarityScore: number; // 0 - 100
  depthScore: number;   // 0 - 100
  systemDesignScore: number; // 0 - 100
  tradeOffsScore: number;    // 0 - 100
  feedbackHighlights: string[];
  suggestedFollowUpTopic?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  topic?: TopicTrack;
  difficulty?: DifficultyLevel;
  evaluation?: AnswerEvaluation;
  codeSnippet?: string;
  suggestedAnswers?: string[];
  isThinking?: boolean;
}

export interface CandidateProfile {
  name: string;
  roleTitle: string;
  cohort: string;
  targetCompany: string;
  completedModules: {
    id: string;
    title: string;
    completed: boolean;
    day: number;
    description: string;
  }[];
  strengths: string[];
  growthAreas: string[];
  overallReadinessScore: number;
}

export interface InterviewState {
  currentQuestionIndex: number;
  maxQuestions: number;
  currentTrack: TopicTrack;
  currentDifficulty: DifficultyLevel;
  coveredTopics: TopicTrack[];
  messages: ChatMessage[];
  isAudioMuted: boolean;
  isInterpreting: boolean;
  interviewStatus: 'idle' | 'in_progress' | 'completed';
  startTime?: string;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technicalDetails: string[];
  iconName: string;
  latencyMs: number;
  metrics: { label: string; value: string }[];
}

export interface EvaluationReport {
  candidateName: string;
  date: string;
  overallScore: number; // e.g. 86
  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Improvement';
  categoryScores: {
    technicalKnowledge: number;
    systemDesign: number;
    problemSolving: number;
    communication: number;
  };
  strongUnderstandings: string[];
  recommendedGrowthAreas: string[];
  questionSummaries: {
    questionNumber: number;
    topic: TopicTrack;
    question: string;
    candidateAnswer: string;
    aiFeedback: string;
    score: number;
  }[];
}

export interface UserFeedback {
  id?: string;
  candidateName: string;
  rating: number; // 1 to 5
  category: 'AI Question Quality' | 'Interview Depth' | 'User Experience' | 'Bug / Feature Request' | 'General';
  comment: string;
  createdAt: string;
}

