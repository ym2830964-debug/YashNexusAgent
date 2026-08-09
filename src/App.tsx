import React, { useState, useEffect } from 'react';
import { NavigationTab, CandidateProfile, InterviewState, EvaluationReport, TopicTrack } from './types';
import { DEFAULT_CANDIDATE, INITIAL_CHAT_MESSAGES, INITIAL_EVALUATION_REPORT } from './data/initialData';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeatureGrid } from './components/FeatureGrid';
import { InterviewRoom } from './components/InterviewRoom';
import { CandidateJourney } from './components/CandidateJourney';
import { ArchitectureView } from './components/ArchitectureView';
import { AnalyticsView } from './components/AnalyticsView';
import { FeedbackReport } from './components/FeedbackReport';
import { FeedbackModal } from './components/FeedbackModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [candidate, setCandidate] = useState<CandidateProfile>(DEFAULT_CANDIDATE);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  const [interviewState, setInterviewState] = useState<InterviewState>({
    currentQuestionIndex: 1,
    maxQuestions: 10,
    currentTrack: 'RAG Systems',
    currentDifficulty: 'Advanced',
    coveredTopics: ['RAG Systems'],
    messages: INITIAL_CHAT_MESSAGES,
    isAudioMuted: false,
    isInterpreting: false,
    interviewStatus: 'in_progress',
    startTime: '10:00 AM'
  });

  const [report, setReport] = useState<EvaluationReport>(INITIAL_EVALUATION_REPORT);

  // Load candidate profile from Firestore safely on mount
  useEffect(() => {
    let isMounted = true;
    const path = 'candidates/alex_rivera';
    const candidateRef = doc(db, 'candidates', 'alex_rivera');
    
    getDoc(candidateRef).then((docSnap) => {
      if (!isMounted) return;
      if (docSnap.exists()) {
        setCandidate(docSnap.data() as CandidateProfile);
      }
    }).catch(err => {
      handleFirestoreError(err, OperationType.GET, path);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save evaluation report safely
  const saveEvaluationReport = (data: EvaluationReport) => {
    const reportId = `report_${Date.now()}`;
    const path = `evaluationReports/${reportId}`;
    try {
      const reportRef = doc(db, 'evaluationReports', reportId);
      setDoc(reportRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, path));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  // Switch track and jump straight to interview
  const handleSelectTrackAndStart = async (track: TopicTrack) => {
    setActiveTab('interview');
    setInterviewState(prev => ({
      ...prev,
      currentTrack: track,
      isInterpreting: true
    }));

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          selectedTrack: track,
          difficulty: interviewState.currentDifficulty
        })
      });

      const data = await res.json();
      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        coveredTopics: Array.from(new Set([...prev.coveredTopics, track])),
        messages: [
          ...prev.messages,
          {
            id: 'start-' + Date.now(),
            sender: 'interviewer',
            text: data.questionText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            topic: track,
            difficulty: prev.currentDifficulty,
            suggestedAnswers: data.suggestedAnswers
          }
        ],
        isInterpreting: false
      }));
    } catch (e) {
      console.error("Failed to start new track:", e);
      setInterviewState(prev => ({ ...prev, isInterpreting: false }));
    }
  };

  // Finish interview & generate report
  const handleFinishInterview = async () => {
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          messages: interviewState.messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data);

        // Save evaluation report to Firestore safely
        saveEvaluationReport(data);
      }
    } catch (e) {
      console.error("Failed to generate dynamic evaluation report, using fallback report:", e);
    }
    setActiveTab('feedback');
  };

  // Restart interview
  const handleRestartInterview = () => {
    setInterviewState({
      currentQuestionIndex: 1,
      maxQuestions: 10,
      currentTrack: 'RAG Systems',
      currentDifficulty: 'Advanced',
      coveredTopics: ['RAG Systems'],
      messages: INITIAL_CHAT_MESSAGES,
      isAudioMuted: false,
      isInterpreting: false,
      interviewStatus: 'in_progress',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setActiveTab('interview');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 font-sans selection:bg-cyan-500 selection:text-[#050816]">
      
      {/* Fixed Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidate={candidate}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
      />

      {/* Global Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        candidateName={candidate.name}
      />

      {/* Main Content Area */}
      <main className="min-h-[calc(100vh-4rem)]">
        {activeTab === 'home' && (
          <>
            <HeroSection setActiveTab={setActiveTab} />
            <FeatureGrid onSelectTrackAndStart={handleSelectTrackAndStart} />
          </>
        )}

        {activeTab === 'interview' && (
          <InterviewRoom
            candidate={candidate}
            interviewState={interviewState}
            setInterviewState={setInterviewState}
            onFinishInterview={handleFinishInterview}
            isAudioMuted={isAudioMuted}
          />
        )}

        {activeTab === 'journey' && (
          <CandidateJourney
            candidate={candidate}
            setActiveTab={setActiveTab}
            onSelectTrackAndStart={handleSelectTrackAndStart}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView onSelectTrackAndStart={handleSelectTrackAndStart} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView candidate={candidate} />
        )}

        {activeTab === 'feedback' && (
          <FeedbackReport
            report={report}
            onRestartInterview={handleRestartInterview}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050816] py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-slate-300 font-bold">The Interview Agent</span> • Build the Interviewer, Not the Interview.
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-950 via-blue-950 to-purple-950 border border-cyan-800/60 text-cyan-300 font-bold tracking-wider text-[11px] shadow-sm">
              DEVELOPED BY TEAM NOVA NEXUS
            </span>
            <span className="text-slate-500 text-[10px]">
              Powered by Gemini 3.6 Flash
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
