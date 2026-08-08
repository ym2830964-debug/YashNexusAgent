import { CandidateProfile, ArchitectureNode, EvaluationReport, ChatMessage } from '../types';

export const DEFAULT_CANDIDATE: CandidateProfile = {
  name: "Alex Rivera",
  roleTitle: "Senior AI Systems Engineer Candidate",
  cohort: "Cohort 2026 - Enterprise AI Track",
  targetCompany: "Top-Tier AI Lab / Enterprise AI Platform",
  completedModules: [
    { id: '1', title: 'Retrieval-Augmented Generation', completed: true, day: 1, description: 'Dense & sparse retrieval, hybrid search, cross-encoder reranking.' },
    { id: '2', title: 'Vector Databases', completed: true, day: 8, description: 'HNSW indexing, IVFFlat, vector quantization, pgvector vs Pinecone.' },
    { id: '3', title: 'Prompt Engineering & Structured Output', completed: true, day: 15, description: 'Chain-of-thought, JSON schema enforcement, function calling.' },
    { id: '4', title: 'Agentic AI Systems', completed: true, day: 20, description: 'Autonomous agent loops, tool calling, memory management, task decomposition.' },
    { id: '5', title: 'Model Context Protocol (MCP)', completed: true, day: 25, description: 'Standardized server/client tools, dynamic resource routing, authorization.' },
    { id: '6', title: 'AI Deployment & Production Systems', completed: true, day: 31, description: 'LLM latency optimization, streaming, monitoring, vLLM, fallback strategies.' },
  ],
  strengths: [
    'RAG Architecture & Retrieval Optimization',
    'Agentic Tool Calling & Reasoning Loops',
    'Vector Indexing Trade-offs (HNSW vs IVF)',
    'Model Context Protocol Integration'
  ],
  growthAreas: [
    'Production Latency Guardrails & vLLM Quantization',
    'Multi-tenant Vector Partitioning at 100M+ Scale',
    'Advanced Real-time Streaming Fallback Mechanisms'
  ],
  overallReadinessScore: 88
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'interviewer',
    text: "Welcome Alex. I am your AI Technical Interviewer today. I've reviewed your candidate profile and curriculum milestones across RAG, Vector Databases, Agentic AI, and MCP.\n\nLet's start with System Architecture:\n**Can you explain the architecture behind a production-grade Retrieval-Augmented Generation (RAG) system, and how you handle vector search accuracy versus latency trade-offs?**",
    timestamp: '10:00 AM',
    topic: 'RAG Systems',
    difficulty: 'Advanced'
  }
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'node-1',
    title: 'Candidate Profile Intelligence',
    subtitle: 'Learner Context Ingestion',
    description: 'Ingests completed engineering missions, GitHub commit history, past interview scores, and knowledge gap metrics.',
    technicalDetails: [
      'Ingests candidate cohort metrics and skill taxonomy',
      'Calculates candidate dynamic mastery matrix',
      'Feeds target domain requirements into prompt context'
    ],
    iconName: 'UserCheck',
    latencyMs: 12,
    metrics: [
      { label: 'Ingestion Rate', value: '< 15ms' },
      { label: 'Profile Depth', value: '6 Modules' }
    ]
  },
  {
    id: 'node-2',
    title: 'Curriculum & Candidate Database',
    subtitle: 'Cloud SQL (us-west1) PostgreSQL & Drizzle',
    description: 'Fully provisioned PostgreSQL Cloud SQL database in us-west1 storing candidate profiles, session transcripts, feedback logs, and evaluation reports with Drizzle ORM.',
    technicalDetails: [
      'Cloud SQL PostgreSQL Developer Edition active in region us-west1',
      'Schema defined via Drizzle ORM (users, candidate_profiles, interview_sessions, evaluation_reports, feedbacks)',
      'Enterprise rubric benchmarks and candidate evaluation records persisted'
    ],
    iconName: 'Database',
    latencyMs: 18,
    metrics: [
      { label: 'Database Region', value: 'us-west1' },
      { label: 'Engine', value: 'PostgreSQL Cloud SQL' }
    ]
  },
  {
    id: 'node-3',
    title: 'AI Reasoning Engine',
    subtitle: 'Adaptive Difficulty Logic',
    description: 'Dynamically analyzes answer depth, system design rigor, and trade-off awareness to adjust follow-up question complexity.',
    technicalDetails: [
      'Powered by Gemini 3.6 Flash reasoning model',
      'Evaluates answer clarity, technical depth, and design validity',
      'Outputs difficulty delta (+1 / -1 level) in real time'
    ],
    iconName: 'Cpu',
    latencyMs: 180,
    metrics: [
      { label: 'Reasoning Model', value: 'Gemini 3.6 Flash' },
      { label: 'Adaptive Latency', value: '~180ms' }
    ]
  },
  {
    id: 'node-4',
    title: 'Autonomous Interview Agent',
    subtitle: 'Senior Engineer Persona',
    description: 'Acts as a Senior/Principal AI Engineer conducting the interview with realistic, probing follow-ups ("Why that DB?", "How do you handle 10M vectors?").',
    technicalDetails: [
      'Contextual persona prompting with strict technical accuracy',
      'Natural conversational cadence with technical follow-up loops',
      'Real-time Audio synthesis option via Gemini TTS API'
    ],
    iconName: 'Bot',
    latencyMs: 210,
    metrics: [
      { label: 'Persona', value: 'Senior AI Engineer' },
      { label: 'Voice TTS', value: 'Gemini Audio' }
    ]
  },
  {
    id: 'node-5',
    title: 'Context-Aware Conversation Memory',
    subtitle: 'Sliding Context Window',
    description: 'Maintains multi-turn context throughout the 10-question interview without forgetting early architecture choices made by candidate.',
    technicalDetails: [
      'Sliding context buffer with semantic summarization',
      'Tracks candidate architectural claims and decisions',
      'Detects contradictions or inconsistent system design choices'
    ],
    iconName: 'BrainCircuit',
    latencyMs: 35,
    metrics: [
      { label: 'Context Limit', value: '1M Tokens' },
      { label: 'Memory Type', value: 'Semantic Graph' }
    ]
  },
  {
    id: 'node-6',
    title: 'Real-Time Evaluation System',
    subtitle: '4-Vector Scoring Matrix',
    description: 'Scores every candidate answer on Clarity (25%), Technical Depth (25%), System Design (25%), and Trade-offs Analysis (25%).',
    technicalDetails: [
      'Structured schema output with micro-evaluations per turn',
      'Instant feedback chips shown in candidate chat interface',
      'Accumulates quantitative domain scores across 6 core pillars'
    ],
    iconName: 'BarChart3',
    latencyMs: 45,
    metrics: [
      { label: 'Pillars Evaluated', value: '4 Key Vectors' },
      { label: 'Accuracy', value: 'Enterprise Grade' }
    ]
  },
  {
    id: 'node-7',
    title: 'Personalized Feedback Engine',
    subtitle: 'Comprehensive Hiring Report',
    description: 'Generates detailed end-of-interview report with overall percentage score, strength analysis, recommended growth areas, and hiring recommendation.',
    technicalDetails: [
      'Overall hiring readiness score (0-100%)',
      'Category score breakdowns & question-by-question audit',
      'Actionable recommendations for enterprise AI engineering roles'
    ],
    iconName: 'Award',
    latencyMs: 350,
    metrics: [
      { label: 'Report Speed', value: '< 1s' },
      { label: 'Hiring Rating', value: 'Staff/Senior Standard' }
    ]
  }
];

export const INITIAL_EVALUATION_REPORT: EvaluationReport = {
  candidateName: "Alex Rivera",
  date: "August 8, 2026",
  overallScore: 86,
  hiringRecommendation: "Strong Hire",
  categoryScores: {
    technicalKnowledge: 90,
    systemDesign: 85,
    problemSolving: 82,
    communication: 88,
  },
  strongUnderstandings: [
    "RAG architecture & retrieval pipeline design (hybrid search with cross-encoders)",
    "Vector Database indexing trade-offs (HNSW recall vs IVF memory footprint)",
    "Agentic tool orchestration and Model Context Protocol (MCP) tool schemas",
    "Structured JSON schema enforcement and prompt chaining"
  ],
  recommendedGrowthAreas: [
    "Production monitoring & vector drift detection at scale (100M+ vectors)",
    "Advanced streaming LLM fallback handling for low-latency sub-100ms APIs",
    "Fine-grained multi-tenant security isolation within MCP servers"
  ],
  questionSummaries: [
    {
      questionNumber: 1,
      topic: "RAG Systems",
      question: "Explain the architecture behind your production RAG system and vector search trade-offs.",
      candidateAnswer: "Used dense HNSW vector retrieval with BM25 hybrid search, re-ranking with Cohere cross-encoder to balance top-k accuracy.",
      aiFeedback: "Excellent understanding of hybrid search patterns and cross-encoder precision gains.",
      score: 92
    },
    {
      questionNumber: 2,
      topic: "Vector Databases",
      question: "Why did you choose Pinecone/Qdrant over pgvector for 50M embeddings?",
      candidateAnswer: "Selected dedicated vector database for distributed HNSW indexing and lower p99 latency guarantees under heavy write loads.",
      aiFeedback: "Solid architectural reasoning around index maintenance overhead in relational stores.",
      score: 88
    },
    {
      questionNumber: 3,
      topic: "Agentic AI",
      question: "How do you prevent loops and handle tool failures in autonomous AI agents?",
      candidateAnswer: "Implemented a maximum iteration threshold, state machine guardrails, and deterministic tool schema validation.",
      aiFeedback: "Strong practical knowledge of agent stability patterns and recovery mechanisms.",
      score: 85
    },
    {
      questionNumber: 4,
      topic: "Model Context Protocol (MCP)",
      question: "What problem does MCP solve in enterprise AI agent architectures?",
      candidateAnswer: "MCP provides a unified standard for connecting AI models to enterprise tools, databases, and APIs securely.",
      aiFeedback: "Clear articulation of protocol benefits and separation of concerns.",
      score: 84
    }
  ]
};
