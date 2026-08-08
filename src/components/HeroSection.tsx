import React from 'react';
import { NavigationTab } from '../types';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Terminal, 
  Zap, 
  Activity,
  Layers,
  Database,
  BrainCircuit,
  Award
} from 'lucide-react';

interface HeroSectionProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-[#050816] via-[#0B1120] to-[#050816] text-slate-100">
      
      {/* Background Futuristic Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#172033_1px,transparent_1px),linear-gradient(to_bottom,#172033_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Hero Headline & Vision */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-inner shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Enterprise AI Engineering Hackathon Edition</span>
            </div>

            {/* Main Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-[#Space_Grotesk] leading-none">
              Meet Your AI <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Technical Interviewer
              </span>
            </h1>

            {/* Key Value Subheading */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <p className="text-sm font-bold text-cyan-400 tracking-wide font-mono uppercase">
                "Build the Interviewer, Not the Interview."
              </p>
              <p className="text-xs text-slate-300 mt-1">
                An autonomous AI interviewer that understands your learning journey, evaluates your engineering decisions, and prepares you for real-world AI system interviews.
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-base text-slate-300 leading-relaxed font-sans">
              Practice enterprise AI interviews with an adaptive interviewer that understands <span className="text-cyan-300 font-semibold">RAG</span>, <span className="text-blue-300 font-semibold">Vector Databases</span>, <span className="text-purple-300 font-semibold">Agentic AI</span>, <span className="text-emerald-300 font-semibold">MCP</span>, deployment, and production AI systems.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero-btn-start"
                onClick={() => setActiveTab('interview')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/30"
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>Start Interview</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </button>

              <button
                id="hero-btn-how-it-works"
                onClick={() => setActiveTab('architecture')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1120] hover:bg-slate-900 text-slate-200 font-medium text-sm border border-slate-800 hover:border-slate-700 transition-all"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-mono block mb-2">Evaluates Knowledge In:</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {['RAG Architecture', 'Vector Databases', 'Agentic Workflows', 'Model Context Protocol (MCP)', 'vLLM & Deployment'].map((topic) => (
                  <span key={topic} className="px-2.5 py-1 rounded-md bg-slate-900/80 text-slate-300 border border-slate-800 flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Futuristic AI Interview Visualization */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-[#0B1120] border border-slate-800 p-5 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
              
              {/* Top Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    AI_INTERVIEW_AGENT_LIVE_SESSION.exe
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Gemini 3.6 Active
                  </span>
                </div>
              </div>

              {/* AI Interviewer Avatar & Dialogue Card */}
              <div className="space-y-4">
                
                {/* AI Interviewer Prompt */}
                <div className="flex gap-3 items-start p-3.5 rounded-xl bg-slate-900/90 border border-blue-900/40">
                  <div className="relative flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/30">
                    <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-cyan-300" />
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 font-mono">AI Interviewer (Senior AI Engineer)</span>
                      <span className="text-[10px] text-slate-400 font-mono">10:02 AM</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      "Explain the architecture behind your RAG system, and why you selected HNSW indexing over IVF vector quantization."
                    </p>
                  </div>
                </div>

                {/* Candidate Response */}
                <div className="flex gap-3 items-start p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 ml-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white font-mono">
                    AR
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 font-mono">Candidate (Alex Rivera)</span>
                      <span className="text-[10px] text-slate-400 font-mono">10:03 AM</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      "We used dense embeddings with vector search combined with HNSW indexing to maintain sub-20ms search latency at top-10 recall..."
                    </p>
                  </div>
                </div>

                {/* Real-Time Evaluation Badges Panel */}
                <div className="p-3 rounded-xl bg-[#050816] border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                      <Activity className="w-3.5 h-3.5" /> Real-time Response Evaluation
                    </span>
                    <span className="text-emerald-400 font-bold">Score: 92%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono">Clarity</div>
                      <div className="text-xs font-bold text-cyan-300 font-mono">94%</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono">Depth</div>
                      <div className="text-xs font-bold text-blue-300 font-mono">88%</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono">System Design</div>
                      <div className="text-xs font-bold text-purple-300 font-mono">92%</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-mono">Trade-offs</div>
                      <div className="text-xs font-bold text-emerald-300 font-mono">86%</div>
                    </div>
                  </div>
                </div>

                {/* Knowledge Graph Mini Visualization */}
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-purple-400" />
                    Knowledge Context Graph:
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">RAG</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">HNSW</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">Agents</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
