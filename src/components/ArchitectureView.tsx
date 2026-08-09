import React, { useState } from 'react';
import { ArchitectureNode, TopicTrack } from '../types';
import { ARCHITECTURE_NODES } from '../data/initialData';
import { 
  Cpu, 
  UserCheck, 
  Database, 
  Bot, 
  BrainCircuit, 
  BarChart3, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Zap, 
  Check, 
  Code,
  Play,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ArchitectureViewProps {
  onSelectTrackAndStart?: (track: TopicTrack) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onSelectTrackAndStart }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(ARCHITECTURE_NODES[2]); // Default AI Reasoning Engine
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return UserCheck;
      case 'Database': return Database;
      case 'Cpu': return Cpu;
      case 'Bot': return Bot;
      case 'BrainCircuit': return BrainCircuit;
      case 'BarChart3': return BarChart3;
      case 'Award': return Award;
      default: return Cpu;
    }
  };

  const handleRunSimulation = (node: ArchitectureNode) => {
    setIsSimulating(true);
    setSimStep(1);
    setSimLogs([`Initializing Stage [${node.title}]...`]);

    setTimeout(() => {
      setSimStep(2);
      setSimLogs(prev => [...prev, `[${node.latencyMs}ms] Ingesting schema & context metrics...`]);
    }, 600);

    setTimeout(() => {
      setSimStep(3);
      setSimLogs(prev => [...prev, `Executing Gemini 3.6 Flash reasoning loop for track: ${node.track || 'RAG Systems'}...`]);
    }, 1200);

    setTimeout(() => {
      setSimStep(4);
      setSimLogs(prev => [...prev, `Stage execution successful! System ready for live evaluation.`]);
      setIsSimulating(false);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>7-Stage System Architecture & Intelligence Flow</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-[#Space_Grotesk]">
            The Interview Agent <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">7-Stage Pipeline</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            An end-to-end multi-stage pipeline designed for enterprise AI engineering evaluation with micro-latency reasoning loops and context memory.
          </p>
        </div>

        {onSelectTrackAndStart && (
          <button
            onClick={() => onSelectTrackAndStart(selectedNode?.track || 'RAG Systems')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/40 flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch Practice Interview for Stage</span>
          </button>
        )}
      </div>

      {/* Main Architecture Flowchart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / TOP: Interactive Flow Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              7-Stage Intelligent Pipeline (Click any stage)
            </h2>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              7 Active Stages
            </span>
          </div>

          <div className="space-y-3 relative">
            
            {ARCHITECTURE_NODES.map((node, index) => {
              const Icon = getIcon(node.iconName);
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  
                  {/* Node Box */}
                  <div
                    onClick={() => {
                      setSelectedNode(node);
                      setSimLogs([]);
                      setSimStep(0);
                    }}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border shadow-lg flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-950/90 via-slate-900 to-purple-950/90 border-cyan-400 shadow-cyan-500/30 scale-[1.02]'
                        : 'bg-[#0B1120] hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected 
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-900 text-cyan-400 border border-slate-800'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
                            STAGE 0{index + 1}
                          </span>
                          <h3 className="font-bold text-sm text-slate-100 font-[#Space_Grotesk]">{node.title}</h3>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{node.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 font-mono text-xs shrink-0">
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-400">
                        {node.latencyMs}ms
                      </span>
                      {onSelectTrackAndStart && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNode(node);
                            onSelectTrackAndStart(node.track || 'RAG Systems');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[11px] font-sans font-bold transition-all flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          <span>Test</span>
                        </button>
                      )}
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>
                  </div>

                  {/* Flow Connection Arrow */}
                  {index < ARCHITECTURE_NODES.length - 1 && (
                    <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500/50 to-purple-500/50 mx-auto my-0.5" />
                  )}

                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT / BOTTOM: Node Inspection Panel */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedNode ? (
            <div className="rounded-2xl bg-[#0B1120] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/40 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    {React.createElement(getIcon(selectedNode.iconName), { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 font-[#Space_Grotesk]">{selectedNode.title}</h3>
                    <p className="text-xs text-cyan-400 font-mono">{selectedNode.subtitle}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                  {selectedNode.latencyMs}ms latency
                </span>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                {selectedNode.description}
              </div>

              {/* Action Buttons for Selected Node */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {onSelectTrackAndStart && (
                  <button
                    onClick={() => onSelectTrackAndStart(selectedNode.track || 'RAG Systems')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-950/50 flex items-center justify-center gap-2 border border-blue-400/30 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Launch Interview</span>
                  </button>
                )}

                <button
                  onClick={() => handleRunSimulation(selectedNode)}
                  disabled={isSimulating}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Run Stage Diagnostic</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Simulation Output Console */}
              {simLogs.length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/80 border border-cyan-800/80 font-mono text-xs space-y-1.5 text-cyan-300 shadow-inner">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1">
                    <span>Stage Diagnostic Log</span>
                    {simStep === 4 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> PASS
                      </span>
                    ) : (
                      <span className="text-amber-400">Step {simStep}/4</span>
                    )}
                  </div>
                  {simLogs.map((log, i) => (
                    <div key={i} className="text-[11px] leading-relaxed text-slate-300">
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                {selectedNode.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{m.label}</span>
                    <span className="text-xs font-bold text-cyan-300">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 block">Technical Specifications:</span>
                <div className="space-y-2">
                  {selectedNode.technicalDetails.map((detail, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2 font-mono">
                      <Code className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0B1120] border border-slate-800 text-center text-slate-400 text-xs font-mono">
              Select any architecture node on the left to inspect its technical details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

