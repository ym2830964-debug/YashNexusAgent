import React from 'react';
import { TopicTrack } from '../types';
import { 
  UserCheck, 
  GitBranch, 
  Layers, 
  BrainCircuit, 
  Award,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Play
} from 'lucide-react';

interface FeatureGridProps {
  onSelectTrackAndStart?: (track: TopicTrack) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectTrackAndStart }) => {
  const features = [
    {
      id: 'feature-1',
      title: 'Personalized AI Interviews',
      icon: UserCheck,
      color: 'from-blue-500 to-cyan-400',
      track: 'Prompt Engineering' as TopicTrack,
      description: "The interviewer understands each candidate's learning journey and creates questions based on completed missions, projects, and technical progress.",
      visualBadge: 'Profile Context Ingestion',
      highlights: ['Custom curriculum alignment', 'Target role tailoring', 'Knowledge gap mapping']
    },
    {
      id: 'feature-2',
      title: 'Adaptive Conversation Engine',
      icon: GitBranch,
      color: 'from-purple-500 to-indigo-400',
      track: 'Agentic AI' as TopicTrack,
      description: "The AI dynamically changes difficulty and generates follow-up questions based on previous answers, probing deeper when candidates excel.",
      visualBadge: 'Dynamic Follow-up Logic',
      highlights: ['Real-time difficulty scaling', 'Probing follow-ups', 'Scenario challenge mode']
    },
    {
      id: 'feature-3',
      title: 'Engineering Decision Evaluation',
      icon: Layers,
      color: 'from-cyan-400 to-emerald-400',
      track: 'RAG Systems' as TopicTrack,
      description: "Evaluate not only what candidates know, but WHY they made specific architecture choices (e.g. HNSW vs IVF, pgvector vs Qdrant).",
      visualBadge: 'Architecture Trade-offs',
      highlights: ['System design trade-offs', 'Scalability assessment', 'Failure mode handling']
    },
    {
      id: 'feature-4',
      title: 'Context-Aware Interview Memory',
      icon: BrainCircuit,
      color: 'from-indigo-400 to-purple-500',
      track: 'Model Context Protocol (MCP)' as TopicTrack,
      description: "The AI maintains complete conversation context throughout the interview like a real senior technical interviewer without losing track.",
      visualBadge: '1M Token Sliding Context',
      highlights: ['Multi-turn coherence', 'Contradiction detection', 'Long-term memory graph']
    },
    {
      id: 'feature-5',
      title: 'Intelligent Feedback System',
      icon: Award,
      color: 'from-emerald-400 to-cyan-400',
      track: 'Vector Databases' as TopicTrack,
      description: "Receive detailed technical feedback, overall percentage scores, strengths, weaknesses, and targeted growth recommendations.",
      visualBadge: 'Comprehensive Hiring Report',
      highlights: ['Quantitative category scoring', 'Strength analysis', 'Actionable growth areas']
    }
  ];

  return (
    <section className="py-16 bg-[#050816] border-t border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Autonomous Intelligence Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-[#Space_Grotesk]">
            Architected Like a <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Senior AI Engineer</span>
          </h2>
          <p className="text-sm text-slate-400">
            Unlike static Q&A platforms, The Interview Agent dynamically adapts, challenges architectural assumptions, and evaluates holistic engineering capability.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onSelectTrackAndStart && onSelectTrackAndStart(feature.track)}
                className={`relative rounded-2xl bg-[#0B1120] border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-blue-950/40 group cursor-pointer ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] shadow-lg shadow-blue-500/10`}>
                      <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono font-medium text-slate-400">
                      {feature.visualBadge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-100 font-[#Space_Grotesk] group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {feature.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    {feature.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">MODULE #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectTrackAndStart) onSelectTrackAndStart(feature.track);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-bold font-mono text-cyan-300 group-hover:border-cyan-400 transition-all"
                  >
                    <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>Active Module</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
