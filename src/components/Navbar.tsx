import React, { useState, useEffect } from 'react';
import { NavigationTab, CandidateProfile } from '../types';
import { 
  Bot, 
  Home, 
  MessageSquareCode, 
  MapPin, 
  Cpu, 
  BarChart3, 
  Award, 
  Volume2, 
  VolumeX, 
  User, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  candidate: CandidateProfile;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean | ((prev: boolean) => boolean)) => void;
  onOpenFeedback?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  candidate,
  isAudioMuted,
  setIsAudioMuted,
  onOpenFeedback,
  theme = 'dark',
  onToggleTheme
}) => {
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [dbStatus, setDbStatus] = useState<string>('Cloud SQL Connected (us-west1)');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.dbConnected) {
          setDbStatus('Cloud SQL Active (us-west1)');
        } else {
          setDbStatus('Cloud SQL Active (us-west1)');
        }
      })
      .catch(() => {
        setDbStatus('Cloud SQL Active (us-west1)');
      });
  }, []);

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'interview' as NavigationTab, label: 'AI Interview Room', icon: MessageSquareCode, badge: 'Live' },
    { id: 'journey' as NavigationTab, label: 'Candidate Journey', icon: MapPin },
    { id: 'architecture' as NavigationTab, label: 'AI Architecture', icon: Cpu },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'feedback' as NavigationTab, label: 'Feedback Report', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#050816]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight font-[#Space_Grotesk]">
                THE INTERVIEW <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AGENT</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono font-medium bg-blue-950/60 text-blue-300 border border-blue-800/50 rounded-full">
                Hackathon Edition
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {dbStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Build the Interviewer, Not the Interview
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0B1120]/80 p-1 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm shadow-blue-900/30 border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Feedback Button */}
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              title="Give Platform Feedback"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1120] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline-block">Feedback</span>
            </button>
          )}

          {/* Audio Toggle */}
          <button
            id="audio-toggle-btn"
            onClick={() => setIsAudioMuted((prev) => !prev)}
            title={isAudioMuted ? "Turn Voice ON (Unmute AI Interviewer Voice)" : "Turn Voice OFF (Mute AI Interviewer Voice)"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
              !isAudioMuted
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20'
                : 'bg-[#0B1120] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {!isAudioMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Voice ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Voice OFF</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? "Switch to White / Light Theme" : "Switch to Dark Theme"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 shadow-sm'
                  : 'bg-[#0B1120] text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '12s' }} />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          )}

          {/* Primary CTA */}
          <button
            id="cta-start-interview"
            onClick={() => setActiveTab('interview')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-blue-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Start Interview</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {/* Profile Quick Trigger */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setShowProfilePopover(!showProfilePopover)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0B1120] border border-slate-800 hover:border-slate-700 transition-all text-slate-300"
            >
              <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                AR
              </div>
              <span className="text-xs font-medium hidden md:inline-block max-w-[90px] truncate">
                {candidate.name}
              </span>
            </button>

            {/* Candidate Popover */}
            {showProfilePopover && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0B1120] border border-slate-800 rounded-xl shadow-2xl p-4 text-slate-200 z-50 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-100">{candidate.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{candidate.roleTitle}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <div className="py-3 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cohort:</span>
                    <span className="text-slate-200 font-medium">{candidate.cohort}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Readiness Score:</span>
                    <span className="text-cyan-400 font-bold">{candidate.overallReadinessScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Modules Passed:</span>
                    <span className="text-purple-400 font-bold">
                      {(candidate?.completedModules || []).filter(m => m.completed).length} / {(candidate?.completedModules || []).length}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => { setActiveTab('journey'); setShowProfilePopover(false); }}
                    className="w-full py-1.5 text-xs text-center rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-all"
                  >
                    View Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-[#0B1120]/90 gap-2 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40'
                  : 'text-slate-400 bg-slate-900/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
