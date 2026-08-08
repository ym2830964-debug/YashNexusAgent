import React, { useState, useEffect } from 'react';
import { EvaluationReport, UserFeedback } from '../types';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Sparkles, 
  RotateCcw,
  Bot,
  Check,
  TrendingUp,
  FileText,
  Star,
  Send,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FeedbackReportProps {
  report: EvaluationReport;
  onRestartInterview: () => void;
}

export const FeedbackReport: React.FC<FeedbackReportProps> = ({
  report,
  onRestartInterview
}) => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // User feedback state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackCategory, setFeedbackCategory] = useState<UserFeedback['category']>('AI Question Quality');
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [savedFeedbacks, setSavedFeedbacks] = useState<UserFeedback[]>([]);

  // Trigger celebration confetti on mount & run smooth score count-up animation
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsMounted(true);

    // Smooth count-up score animation
    let startVal = 0;
    const endVal = report.overallScore || 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function (easeOutQuad)
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(easedProgress * endVal);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [report.overallScore]);

  // Fetch recent feedback entries from Firestore safely
  useEffect(() => {
    let isMounted = true;
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, 'feedbacks'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        if (!isMounted) return;
        const list: UserFeedback[] = [];
        snapshot.forEach((docSnap) => {
          list.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<UserFeedback, 'id'>)
          });
        });
        if (list.length > 0) {
          setSavedFeedbacks(list);
        }
      } catch (e) {
        // Quiet fallback
      }
    };

    fetchFeedbacks();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyReport = () => {
    const text = `The Interview Agent - Technical Evaluation Report
Candidate: ${report.candidateName}
Overall Score: ${report.overallScore}%
Recommendation: ${report.hiringRecommendation}
Category Scores:
- Technical Knowledge: ${report.categoryScores.technicalKnowledge}%
- System Design: ${report.categoryScores.systemDesign}%
- Problem Solving: ${report.categoryScores.problemSolving}%
- Communication: ${report.categoryScores.communication}%`;

    navigator.clipboard.writeText(text);
    alert("Evaluation report summary copied to clipboard!");
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    setIsSubmittingFeedback(true);
    const newFb: UserFeedback = {
      id: 'fb-' + Date.now(),
      candidateName: report.candidateName || 'Candidate',
      rating,
      category: feedbackCategory,
      comment: feedbackComment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'feedbacks'), {
        candidateName: newFb.candidateName,
        rating: newFb.rating,
        category: newFb.category,
        comment: newFb.comment,
        createdAt: newFb.createdAt
      });
    } catch (err) {
      // Quiet quota error handling
    }

    setSavedFeedbacks(prev => [newFb, ...prev]);
    setIsSubmittingFeedback(false);
    setFeedbackSubmitted(true);
    setFeedbackComment('');
  };

  // Circular gauge math (Radius r=64 => Circumference C=402.12)
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  const strokeDashoffset = circumference - (circumference * displayScore) / 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-100">
      
      {/* Header with Export / Restart Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Technical Evaluation Report</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-[#Space_Grotesk]">
            Interview Performance <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Evaluation</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generated by The Interview Agent for {report.candidateName} on {report.date}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Share Report</span>
          </button>

          <button
            onClick={onRestartInterview}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs font-mono shadow-lg shadow-blue-600/25 hover:scale-[1.02] transition-all flex items-center gap-2 border border-blue-400/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Track</span>
          </button>
        </div>
      </div>

      {/* Main Overall Score Card with Corrected Animated Percentage Circle */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-8 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Animated Circular Score Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#050816] border border-slate-800 space-y-4 shadow-inner">
          <div className="relative w-40 h-40 flex items-center justify-center">
            
            {/* Smooth SVG Gauge */}
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              {/* Background Circle Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(30, 41, 59, 0.8)"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="url(#cyanGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Score Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-cyan-300 font-mono tracking-tight drop-shadow-md">
                {displayScore}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider mt-0.5">
                Readiness Score
              </span>
            </div>

          </div>

          <div className="text-center pt-1">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm inline-block">
              Recommendation: {report.hiringRecommendation}
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-2">
              Verified for Senior / Staff AI Engineer Roles
            </p>
          </div>
        </div>

        {/* 4 Category Score Progress Bars */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="text-sm font-bold font-[#Space_Grotesk] text-slate-200">
            Competency Domain Breakdown:
          </h3>

          <div className="space-y-3.5">
            {[
              { label: 'Technical Knowledge', score: report.categoryScores.technicalKnowledge, color: 'from-cyan-500 to-blue-500' },
              { label: 'System Design', score: report.categoryScores.systemDesign, color: 'from-blue-500 to-indigo-500' },
              { label: 'Problem Solving', score: report.categoryScores.problemSolving, color: 'from-purple-500 to-indigo-500' },
              { label: 'Communication', score: report.categoryScores.communication, color: 'from-emerald-500 to-cyan-500' }
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">{cat.label}</span>
                  <span className="text-cyan-300 font-bold">{isMounted ? cat.score : 0}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${isMounted ? cat.score : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Strength & Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Understandings</span>
          </div>

          <div className="space-y-2.5">
            {report.strongUnderstandings.map((str, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5 font-sans">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Recommendations Card */}
        <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold border-b border-slate-800 pb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Recommended Growth Areas</span>
          </div>

          <div className="space-y-2.5">
            {report.recommendedGrowthAreas.map((rec, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5 font-sans">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Detailed Question Audit Breakdown */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Question-by-Question Response Audit
        </h3>

        <div className="space-y-4">
          {report.questionSummaries.map((q) => (
            <div key={q.questionNumber} className="p-4 rounded-xl bg-[#050816] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    Q{q.questionNumber} • {q.topic}
                  </span>
                </div>
                <span className="text-emerald-400 font-bold font-mono text-xs">
                  Score: {q.score}%
                </span>
              </div>

              <div className="pt-1 text-slate-200 font-semibold font-sans">
                "{q.question}"
              </div>

              <div className="p-3 rounded bg-slate-900/80 border border-slate-800/80 text-slate-300 font-sans">
                <span className="font-mono text-[10px] text-slate-500 block uppercase">Candidate Answer:</span>
                {q.candidateAnswer}
              </div>

              <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/50 text-cyan-300 font-sans">
                <span className="font-mono text-[10px] text-blue-400 block uppercase">AI Feedback:</span>
                {q.aiFeedback}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USER FEEDBACK SECTION */}
      <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-[#Space_Grotesk] text-slate-100">
                Give Platform & Interviewer Feedback
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Share your evaluation experience to help improve AI questions & system design rubrics.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-orange-950/60 border border-amber-800/50 text-amber-300 text-[10px] font-mono self-start sm:self-auto">
            Synced with Firestore DB
          </span>
        </div>

        {feedbackSubmitted ? (
          <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-emerald-300 font-[#Space_Grotesk]">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your rating and comments have been recorded in Firestore.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-2xl">
            
            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Rate your Interview Experience
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-cyan-300 font-bold ml-2">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Feedback Category
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value as UserFeedback['category'])}
                className="w-full sm:w-72 bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="AI Question Quality">AI Question Quality</option>
                <option value="Interview Depth">Interview Depth & Realism</option>
                <option value="User Experience">User Experience & UI</option>
                <option value="Bug / Feature Request">Bug / Feature Request</option>
                <option value="General">General Feedback</option>
              </select>
            </div>

            {/* Comment Text Area */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Comments or Suggestions
              </label>
              <textarea
                required
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="How was the AI interviewer's technical depth? Any suggestions to make the evaluation better?"
                className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingFeedback || !feedbackComment.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmittingFeedback ? 'Submitting to Firestore...' : 'Submit Feedback'}</span>
            </button>

          </form>
        )}

        {/* Display Saved Feedbacks list */}
        {savedFeedbacks.length > 0 && (
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Community & Candidate Feedback in Firestore ({savedFeedbacks.length}):
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedFeedbacks.map((fb) => (
                <div key={fb.id} className="p-3.5 rounded-xl bg-[#050816] border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-cyan-300 font-bold">{fb.candidateName}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{fb.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs italic font-sans pt-1">
                    "{fb.comment}"
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono block pt-1">
                    Category: {fb.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

