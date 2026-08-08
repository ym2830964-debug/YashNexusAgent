import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, X, CheckCircle2, Send, Sparkles, User, Clock } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserFeedback } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
}

const DEFAULT_FEEDBACKS: UserFeedback[] = [
  {
    id: 'f-1',
    candidateName: 'Alex Rivera',
    rating: 5,
    category: 'AI Question Quality',
    comment: 'The adaptive follow-up questions probed deep into system design trade-offs!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'f-2',
    candidateName: 'Jordan Lee',
    rating: 5,
    category: 'Interview Depth',
    comment: 'Realistic technical depth comparing HNSW vs IVF vector indexes.',
    createdAt: new Date().toISOString()
  }
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  candidateName = 'Alex Rivera'
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<UserFeedback['category']>('AI Question Quality');
  const [comment, setComment] = useState<string>('');
  const [name, setName] = useState<string>(candidateName);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recentFeedbacks, setRecentFeedbacks] = useState<UserFeedback[]>(DEFAULT_FEEDBACKS);

  // Fetch recent feedback entries from Firestore safely
  useEffect(() => {
    if (!isOpen) return;

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
          setRecentFeedbacks(list);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'feedbacks');
      }
    };

    fetchFeedbacks();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    const newFb: UserFeedback = {
      id: 'fb-' + Date.now(),
      candidateName: name || 'Anonymous User',
      rating,
      category,
      comment: comment.trim(),
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
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedbacks');
    }

    setRecentFeedbacks(prev => [newFb, ...prev]);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0B1120] border border-slate-800 p-6 shadow-2xl space-y-6 text-slate-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-[#Space_Grotesk]">
              Give Platform Feedback
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Saved in real-time to Firestore DB
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-emerald-300 font-[#Space_Grotesk]">
              Feedback Received!
            </h3>
            <p className="text-xs text-slate-300">
              Thank you! Your feedback has been recorded in the database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Overall Experience Rating
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
                <span className="text-xs font-mono text-cyan-300 ml-2 font-bold">
                  {rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as UserFeedback['category'])}
                className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="AI Question Quality">AI Question Quality</option>
                <option value="Interview Depth">Interview Depth & Realism</option>
                <option value="User Experience">User Experience & UI</option>
                <option value="Bug / Feature Request">Bug / Feature Request</option>
                <option value="General">General Feedback</option>
              </select>
            </div>

            {/* User Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate name"
                className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Comment Area */}
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">
                Your Feedback & Comments
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your interview experience, questions quality, or feature ideas..."
                className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs font-mono shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Firestore...' : 'Submit Feedback'}</span>
            </button>

          </form>
        )}

        {/* Live Recent Feedbacks Preview */}
        {recentFeedbacks.length > 0 && (
          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Recent Firestore Feedback Submissions ({recentFeedbacks.length}):
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {recentFeedbacks.map((fb) => (
                <div key={fb.id} className="p-2.5 rounded-xl bg-[#050816] border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-300 font-bold">{fb.candidateName}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{fb.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-[11px] italic">"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
