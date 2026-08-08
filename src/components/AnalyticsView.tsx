import React from 'react';
import { CandidateProfile } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

interface AnalyticsViewProps {
  candidate: CandidateProfile;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ candidate }) => {
  // Radar data across 6 technical domains
  const radarData = [
    { domain: 'RAG Systems', score: 92 },
    { domain: 'Vector DBs', score: 88 },
    { domain: 'Agentic AI', score: 85 },
    { domain: 'MCP Protocol', score: 78 },
    { domain: 'Prompt Eng', score: 90 },
    { domain: 'Production SLA', score: 80 },
  ];

  // Score progression over interview turns
  const progressionData = [
    { turn: 'Q1', score: 78, difficulty: 'Intermediate' },
    { turn: 'Q2', score: 82, difficulty: 'Advanced' },
    { turn: 'Q3', score: 85, difficulty: 'Advanced' },
    { turn: 'Q4', score: 88, difficulty: 'Staff' },
    { turn: 'Q5', score: 86, difficulty: 'Staff' },
    { turn: 'Q6', score: 92, difficulty: 'Staff' },
  ];

  // Category evaluation
  const categoryData = [
    { category: 'Technical Knowledge', score: 90 },
    { category: 'System Design', score: 85 },
    { category: 'Problem Solving', score: 82 },
    { category: 'Communication', score: 88 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Enterprise AI Engineering Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight font-[#Space_Grotesk]">
          Candidate Evaluation <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-sm text-slate-400">
          Real-time performance metrics, domain mastery radar, and hiring readiness trends for {candidate.name}.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Overall Readiness Score</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono">86%</div>
          <p className="text-[11px] text-emerald-400 font-mono">+4% from initial benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Hiring Recommendation</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">Strong Hire</div>
          <p className="text-[11px] text-slate-400 font-mono">Target Level: Senior/Staff</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Highest Domain Mastery</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono">RAG Systems (92%)</div>
          <p className="text-[11px] text-slate-400 font-mono">Hybrid search & cross-encoder</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1120] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Target Growth Area</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">MCP Protocol (78%)</div>
          <p className="text-[11px] text-slate-400 font-mono">Server authorization & routing</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Chart: Domain Mastery */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm font-[#Space_Grotesk] text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Technical Domain Mastery Radar
            </h3>
            <span className="text-[10px] font-mono text-slate-400">6 Pillars</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="domain" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Candidate" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Adaptive Score Progression */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm font-[#Space_Grotesk] text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Adaptive Question Score Progression
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">Scale: 0-100%</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="turn" stroke="#94a3b8" />
                <YAxis domain={[50, 100]} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050816', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Area type="monotone" dataKey="score" stroke="#38bdf8" fillOpacity={1} fill="url(#scoreColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bar Chart: Core Hiring Competencies */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm font-[#Space_Grotesk] text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Core Enterprise Hiring Competencies Breakdown
          </h3>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050816', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#a855f7' }}
              />
              <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
