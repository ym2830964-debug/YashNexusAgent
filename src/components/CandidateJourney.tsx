import React from 'react';
import { CandidateProfile, NavigationTab, TopicTrack } from '../types';
import { 
  UserCheck, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Database, 
  BrainCircuit, 
  Layers, 
  Cpu, 
  Play
} from 'lucide-react';

interface CandidateJourneyProps {
  candidate: CandidateProfile;
  setActiveTab: (tab: NavigationTab) => void;
  onSelectTrackAndStart: (track: TopicTrack) => void;
}

export const CandidateJourney: React.FC<CandidateJourneyProps> = ({
  candidate,
  setActiveTab,
  onSelectTrackAndStart
}) => {
  const timelineMilestones = [
    {
      day: 'Day 1',
      title: 'AI Foundations & LLM Architecture',
      track: 'Prompt Engineering' as TopicTrack,
      status: 'Completed',
      description: 'Understanding attention mechanisms, context limits, tokenization, and temperature sampling.',
      topics: ['Transformers', 'Context Windows', 'Tokens & Cost Optimization']
    },
    {
      day: 'Day 8',
      title: 'Prompt Engineering & Structured Output',
      track: 'Prompt Engineering' as TopicTrack,
      status: 'Completed',
      description: 'Chain-of-thought prompting, function calling, JSON schema enforcement, and tool use.',
      topics: ['Few-Shot Learning', 'JSON Schema Enforcement', 'Function Calling']
    },
    {
      day: 'Day 15',
      title: 'Retrieval-Augmented Generation (RAG)',
      track: 'RAG Systems' as TopicTrack,
      status: 'Completed',
      description: 'Building production RAG pipelines with semantic chunking, dense embeddings, and cross-encoder reranking.',
      topics: ['Semantic Chunking', 'Hybrid Search (BM25 + Dense)', 'Cross-Encoder Reranking']
    },
    {
      day: 'Day 20',
      title: 'Agentic AI & Autonomous Workflows',
      track: 'Agentic AI' as TopicTrack,
      status: 'Completed',
      description: 'Designing autonomous agent loops with tool selection, memory buffers, and failure recovery.',
      topics: ['ReAct Framework', 'Tool Calling Orchestration', 'Agent Memory']
    },
    {
      day: 'Day 25',
      title: 'Model Context Protocol (MCP)',
      track: 'Model Context Protocol (MCP)' as TopicTrack,
      status: 'Completed',
      description: 'Integrating standardized MCP server tools, resources, and secure authorization for enterprise agents.',
      topics: ['MCP Architecture', 'Tool Schema Standardization', 'Enterprise Authorization']
    },
    {
      day: 'Day 31',
      title: 'Production AI Systems & Deployment',
      track: 'AI Deployment & Production' as TopicTrack,
      status: 'Completed',
      description: 'Scaling LLMs with vLLM, streaming, monitoring embedding drift, and SLA latency guardrails.',
      topics: ['vLLM & Quantization', 'P99 Latency SLA', 'Drift & Quality Guardrails']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800 text-cyan-300 text-xs font-mono mb-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Engineering Learning Journey</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-[#Space_Grotesk]">
            Candidate Journey & <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Milestones</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track completed curriculum modules and launch targeted AI technical interviews.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('interview')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center gap-2 self-start md:self-auto border border-blue-400/30"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Launch Practice Interview</span>
        </button>
      </div>

      {/* Candidate Profile Overview Card */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        <div className="md:col-span-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-xl shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-[#050816] rounded-[15px] flex items-center justify-center font-black text-xl text-cyan-300 font-mono">
              AR
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">{candidate.name}</h2>
            <p className="text-xs text-slate-400 font-mono">{candidate.roleTitle}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
              {candidate.cohort}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Modules Completed</div>
            <div className="text-xl font-bold text-cyan-300 font-mono mt-1">6 / 6</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Readiness Rating</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{candidate.overallReadinessScore}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Target Level</div>
            <div className="text-xs font-bold text-purple-300 font-mono mt-2">Senior / Staff</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Status</div>
            <div className="text-xs font-bold text-cyan-400 font-mono mt-2">Interview Ready</div>
          </div>
        </div>

      </div>

      {/* Interactive Learning Journey Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-[#Space_Grotesk] text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          Interactive Learning Timeline
        </h2>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
          {timelineMilestones.map((milestone, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#050816] shadow-md shadow-cyan-500/50 group-hover:scale-125 transition-transform" />

              <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-5 hover:border-slate-700 transition-all shadow-lg hover:shadow-cyan-950/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {milestone.day}
                    </span>
                    <h3 className="font-bold text-base text-slate-100 font-[#Space_Grotesk]">
                      {milestone.title}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => onSelectTrackAndStart(milestone.track)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border border-blue-500/40 text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto transition-all"
                  >
                    <Play className="w-3 h-3 text-cyan-400" />
                    <span>Practice Interview</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {milestone.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {milestone.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                      • {t}
                    </span>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
