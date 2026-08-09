import React, { useState, useEffect, useRef } from 'react';
import { 
  ChatMessage, 
  TopicTrack, 
  DifficultyLevel, 
  CandidateProfile, 
  InterviewState 
} from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Volume2, 
  VolumeX, 
  Activity, 
  Award, 
  RotateCcw, 
  Code, 
  BrainCircuit, 
  Sliders, 
  ChevronRight, 
  Loader2,
  Terminal,
  Zap,
  Check,
  AlertCircle,
  Mic,
  MicOff,
  ExternalLink
} from 'lucide-react';

interface InterviewRoomProps {
  candidate: CandidateProfile;
  interviewState: InterviewState;
  setInterviewState: React.Dispatch<React.SetStateAction<InterviewState>>;
  onFinishInterview: () => void;
  isAudioMuted: boolean;
  setIsAudioMuted?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  candidate,
  interviewState,
  setInterviewState,
  onFinishInterview,
  isAudioMuted,
  setIsAudioMuted
}) => {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInputText, setCodeInputText] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Aoede' | 'Puck' | 'Charon'>('Kore');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Available interviewer voice options
  const interviewerVoices = [
    { id: 'Kore', label: 'Kore (Clear & Professional Female)', desc: 'Crisp articulation & professional tone' },
    { id: 'Aoede', label: 'Aoede (Expressive & Warm Female)', desc: 'Warm, natural conversational voice' },
    { id: 'Puck', label: 'Puck (Energetic Male)', desc: 'Clear, direct male voice' },
    { id: 'Charon', label: 'Charon (Deep Male)', desc: 'Authoritative & measured' },
  ];

  // Stop audio playback immediately when muted
  useEffect(() => {
    if (isAudioMuted) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setPlayingAudioId(null);
    }
  }, [isAudioMuted]);

  // Clean up speech recognition & recording tracks on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Helper to convert audio blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Toggle Live Microphone Recording & Dictation
  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
      return;
    }

    setMicError(null);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setMicError("Microphone access is restricted in this browser frame. Click 'Open in New Tab' to launch in a full window and grant microphone permissions.");
        setIsListening(false);
        return;
      }

      // Request explicit microphone access via MediaDevices API
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      // Determine best available audio codec
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }

        try {
          const recorder = new MediaRecorder(stream, { mimeType });
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.start(250);
        } catch (recorderErr) {
          console.warn("MediaRecorder init notice:", recorderErr);
        }
      }

      setIsListening(true);
      setRecordingSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Start Web Speech API for real-time live streaming text if browser supports it
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let finalStr = '';
            let interimStr = '';
            for (let i = 0; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalStr += transcript + ' ';
              } else {
                interimStr += transcript;
              }
            }
            const combined = (finalStr + interimStr).trim();
            if (combined) {
              setInputText(combined);
            }
          };

          recognition.onerror = (err: any) => {
            console.warn("WebSpeech recognition notice:", err?.error || err);
            if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
              setMicError("Microphone permission was blocked. Grant permission in your browser bar or click 'Open in New Tab'.");
            }
          };

          recognitionRef.current = recognition;
          recognition.start();
        } catch (speechErr) {
          console.warn("SpeechRecognition start notice:", speechErr);
        }
      }
    } catch (err: any) {
      console.warn("Microphone access permission notice:", err?.name || err);
      setIsListening(false);
      const errStr = (err?.message || err?.name || String(err)).toLowerCase();
      const isPermissionDenied = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || errStr.includes('permission') || errStr.includes('denied');
      
      if (isPermissionDenied) {
        setMicError("Microphone access was restricted by your browser iframe permissions. Click 'Open in New Tab' to grant microphone access in a standalone window, or use 'Simulate Voice Input' to test live spoken responses.");
      } else {
        setMicError("Unable to access microphone input device. You can type your response or try Voice Simulation.");
      }
    }
  };

  // Pre-warm Web Speech API voices for instant playback
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  const stopListening = async () => {
    setIsListening(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // If real-time speech recognition already captured candidate response, no delay needed
    if (inputText.trim()) {
      setIsTranscribing(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      return;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      setIsTranscribing(true);
      recorder.onstop = async () => {
        try {
          const mimeType = recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          if (audioBlob.size > 800) {
            const base64Audio = await blobToBase64(audioBlob);
            const res = await fetch('/api/interview/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.transcript && data.transcript.trim()) {
                setInputText(prev => {
                  const newTranscript = data.transcript.trim();
                  if (prev.includes(newTranscript) || newTranscript.includes(prev)) {
                    return prev.length > newTranscript.length ? prev : newTranscript;
                  }
                  return prev ? `${prev} ${newTranscript}` : newTranscript;
                });
              }
            }
          }
        } catch (transcribeErr) {
          console.warn("Audio transcription error:", transcribeErr);
        } finally {
          setIsTranscribing(false);
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
          }
        }
      };

      recorder.stop();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  const availableTracks: TopicTrack[] = [
    'RAG Systems',
    'Vector Databases',
    'Agentic AI',
    'Model Context Protocol (MCP)',
    'Prompt Engineering',
    'AI Deployment & Production'
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewState.messages, isSubmitting]);

  // Handle switching track
  const handleTrackChange = async (newTrack: TopicTrack) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setInterviewState(prev => ({
      ...prev,
      currentTrack: newTrack,
      isInterpreting: true
    }));

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: candidate.name,
          selectedTrack: newTrack,
          difficulty: interviewState.currentDifficulty
        })
      });
      const data = await res.json();

      const newMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'interviewer',
        text: data.questionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: newTrack,
        difficulty: interviewState.currentDifficulty
      };

      setInterviewState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        messages: [...prev.messages, newMsg],
        coveredTopics: Array.from(new Set([...prev.coveredTopics, newTrack])),
        isInterpreting: false
      }));

      if (!isAudioMuted && data.questionText) {
        playTTSVoice(data.questionText);
      }
    } catch (err) {
      console.error(err);
      setInterviewState(prev => ({ ...prev, isInterpreting: false }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Answer Live
  const handleSubmitAnswer = async (overrideAnswer?: string) => {
    const textToSend = overrideAnswer || inputText;
    if ((!textToSend.trim() && !codeInputText.trim()) || isSubmitting) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }

    const fullAnswerText = codeInputText.trim() 
      ? `${textToSend.trim()}\n\n\`\`\`typescript\n${codeInputText.trim()}\n\`\`\``
      : textToSend.trim();

    setIsSubmitting(true);

    // 1. Add candidate message immediately
    const userMsg: ChatMessage = {
      id: 'cand-' + Date.now(),
      sender: 'candidate',
      text: fullAnswerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeSnippet: codeInputText.trim() || undefined
    };

    setInterviewState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isInterpreting: true
    }));

    setInputText('');
    setCodeInputText('');

    try {
      // 2. Call backend evaluation & follow-up generator API
      const res = await fetch('/api/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: [...interviewState.messages, userMsg],
          candidateAnswer: fullAnswerText,
          topic: interviewState.currentTrack,
          currentDifficulty: interviewState.currentDifficulty
        })
      });

      const data = await res.json();

      // Update candidate message with evaluation scores
      setInterviewState(prev => {
        const updatedMsgs = prev.messages.map(m => {
          if (m.id === userMsg.id) {
            return {
              ...m,
              evaluation: data.evaluation
            };
          }
          return m;
        });

        const nextAIQuestion: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'interviewer',
          text: data.followUpQuestion || "Thank you. Let's move to the next architecture requirement.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: prev.currentTrack,
          difficulty: (data.nextDifficulty as DifficultyLevel) || prev.currentDifficulty
        };

        return {
          ...prev,
          messages: [...updatedMsgs, nextAIQuestion],
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentDifficulty: (data.nextDifficulty as DifficultyLevel) || prev.currentDifficulty,
          isInterpreting: false
        };
      });

      // Play voice if unmuted
      if (!isAudioMuted && data.followUpQuestion) {
        playTTSVoice(data.followUpQuestion);
      }

    } catch (err) {
      console.error("Error submitting answer:", err);
      // Fallback AI message to ensure chat never breaks
      setInterviewState(prev => {
        const fallbackAIQuestion: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'interviewer',
          text: `Thank you for sharing your perspective on **${prev.currentTrack}**.\n\n**Next Adaptive Question:** How would your proposed architecture handle sudden 10x traffic bursts or high memory pressure on vector indexes?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          topic: prev.currentTrack,
          difficulty: prev.currentDifficulty
        };
        return {
          ...prev,
          messages: [...prev.messages, fallbackAIQuestion],
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          isInterpreting: false
        };
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Play TTS voice instantly using Web Speech Synthesis (<20ms) or fallback to server audio
  const playTTSVoice = async (text: string, msgId?: string) => {
    if (msgId) setPlayingAudioId(msgId);

    // If currently muted and user explicitly triggers voice, unmute voice
    if (isAudioMuted && setIsAudioMuted) {
      setIsAudioMuted(false);
    }

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#(.*?)\n/g, '$1. ')
      .replace(/[*#`_~]/g, '')
      .trim();

    // 1. Instant client-side Web Speech API (< 20ms response time!)
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Cancel any lingering speech immediately
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && (
            v.name.includes('Google') || 
            v.name.includes('Natural') || 
            v.name.includes('Samantha') || 
            v.name.includes('Karen') ||
            v.name.includes('Daniel')
          )
        ) || voices.find(v => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0; // Instant, natural speaking speed
        utterance.pitch = 1.0;
        utterance.onend = () => setPlayingAudioId(null);
        utterance.onerror = () => setPlayingAudioId(null);

        window.speechSynthesis.speak(utterance);
        return; // Voice started instantly!
      } catch (speechSynthesisErr) {
        console.warn("Instant Web Speech API notice:", speechSynthesisErr);
      }
    }

    // 2. Server TTS fallback if client speechSynthesis is unavailable
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const res = await fetch('/api/interview/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voiceName: selectedVoice })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
          currentAudioRef.current = audio;
          audio.onended = () => {
            setPlayingAudioId(null);
            currentAudioRef.current = null;
          };
          audio.onerror = () => {
            setPlayingAudioId(null);
            currentAudioRef.current = null;
          };
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn("Server TTS failed:", e);
    } finally {
      setPlayingAudioId(null);
    }
  };

  const renderFormattedMessage = (text: string, isAI: boolean) => {
    if (!isAI) {
      return <div className="whitespace-pre-wrap font-sans text-left">{text}</div>;
    }

    const paragraphs = text.split('\n\n');
    return (
      <div className="space-y-3 font-sans text-left">
        {paragraphs.map((p, idx) => {
          const trimmed = p.trim();

          if (trimmed.startsWith('**Verdict:**')) {
            const isCorrect = trimmed.includes('Correct') && !trimmed.includes('Incorrect') && !trimmed.includes('Partially');
            const isIncorrect = trimmed.includes('Incorrect');
            const isPartial = trimmed.includes('Partially');

            const badgeBg = isCorrect
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200 shadow-emerald-950/30'
              : isIncorrect
              ? 'bg-red-950/80 border-red-700/80 text-red-200 shadow-red-950/30'
              : isPartial
              ? 'bg-amber-950/80 border-amber-700/80 text-amber-200 shadow-amber-950/30'
              : 'bg-blue-950/80 border-blue-700/80 text-blue-200';

            return (
              <div key={idx} className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md ${badgeBg}`}>
                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isIncorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                {isPartial && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span className="font-mono">{trimmed.replace(/\*\*/g, '')}</span>
              </div>
            );
          }

          if (trimmed.startsWith('**Why it is wrong') || trimmed.startsWith('**Evaluation & Corrections:') || trimmed.startsWith('**Detailed Explanation:')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-100 text-xs sm:text-sm space-y-1.5 shadow-inner">
                <div className="font-mono font-bold text-red-300 text-xs flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Why it is Wrong & Correct Solution:</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                  {trimmed.replace(/\*\*(Why it is wrong & Explanation|Evaluation & Corrections|Detailed Explanation):\*\*/g, '').trim()}
                </div>
              </div>
            );
          }

          if (trimmed.startsWith('**Evaluation:**')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-100 text-xs sm:text-sm space-y-1.5 shadow-inner">
                <div className="font-mono font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Answer Assessment:</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                  {trimmed.replace(/\*\*Evaluation:\*\*/g, '').trim()}
                </div>
              </div>
            );
          }

          if (trimmed.startsWith('**Direct Answer & Explanation:**')) {
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-100 text-xs sm:text-sm space-y-1.5 shadow-inner">
                <div className="font-mono font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct Answer & Technical Explanation:</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                  {trimmed.replace(/\*\*Direct Answer & Explanation:\*\*/g, '').trim()}
                </div>
              </div>
            );
          }

          if (trimmed.startsWith('**Next Interview Question')) {
            return (
              <div key={idx} className="pt-2 border-t border-slate-800 text-cyan-100 font-medium space-y-1">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Next Technical Question
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-100">
                  {trimmed.replace(/\*\*Next Interview Question.*?\*\*:/g, '').trim()}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: Candidate Intelligence & Progress */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Candidate Intelligence Card */}
          <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white font-mono shadow-md shadow-cyan-500/20">
                  AR
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{candidate.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{candidate.roleTitle}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {/* Candidate Journey Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Readiness Rating:</span>
                <span className="text-cyan-400 font-bold">{candidate.overallReadinessScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" 
                  style={{ width: `${candidate.overallReadinessScore}%` }}
                />
              </div>
            </div>

            {/* Topics Covered Checklist */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Interview Topics Progress:</span>
              <div className="space-y-1.5 text-xs">
                {availableTracks.map((topic) => {
                  const isCovered = interviewState.coveredTopics.includes(topic);
                  const isCurrent = interviewState.currentTrack === topic;
                  return (
                    <button
                      key={topic}
                      onClick={() => handleTrackChange(topic)}
                      className={`w-full text-left px-3 py-2 rounded-lg font-mono text-[11px] flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50 shadow-sm'
                          : isCovered
                          ? 'bg-slate-900/80 text-emerald-300 border border-emerald-900/40'
                          : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800/60 border border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCovered ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : isCurrent ? (
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{topic}</span>
                      </div>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Live
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Live Session Counter Card */}
          <div className="rounded-2xl bg-[#0B1120] border border-slate-800 p-5 shadow-xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Interview Telemetry
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Question</div>
                <div className="text-lg font-extrabold text-cyan-300 font-mono">
                  {interviewState.currentQuestionIndex} / {interviewState.maxQuestions}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">Current Level</div>
                <div className="text-xs font-bold text-purple-300 font-mono mt-1">
                  {interviewState.currentDifficulty}
                </div>
              </div>
            </div>

            {/* Complete Interview Action */}
            <button
              id="finish-interview-btn"
              onClick={onFinishInterview}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all border border-emerald-400/30"
            >
              <Award className="w-4 h-4" />
              <span>Finish & View Feedback Report</span>
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: AI Interview Conversation Window */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-[#0B1120] border border-slate-800 shadow-2xl flex flex-col h-[750px] overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-[#050816]/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/30">
                  <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100 font-[#Space_Grotesk]">Senior AI Technical Interviewer</h3>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                      Gemini 3.6
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Topic Track: <span className="text-cyan-300 font-semibold">{interviewState.currentTrack}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Voice Model Selector Dropdown */}
                <div className="relative group">
                  <select
                    id="interview-voice-selector"
                    value={selectedVoice}
                    onChange={(e: any) => setSelectedVoice(e.target.value)}
                    className="appearance-none bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono px-2.5 py-1.5 pr-6 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    title="Select Interviewer Voice Model"
                  >
                    {interviewerVoices.map(v => (
                      <option key={v.id} value={v.id} className="bg-slate-900 text-slate-200">
                        Voice: {v.id} {v.id === 'Kore' ? '(Clear)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </div>
                </div>

                {setIsAudioMuted && (
                  <button
                    id="interview-voice-toggle-btn"
                    onClick={() => setIsAudioMuted(prev => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-sm ${
                      !isAudioMuted
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20 shadow-cyan-500/10'
                        : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={isAudioMuted ? "Turn Voice ON (Unmute Interviewer Voice)" : "Turn Voice OFF (Mute Interviewer Voice)"}
                  >
                    {!isAudioMuted ? (
                      <>
                        <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span>Voice ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-400" />
                        <span>Voice OFF</span>
                      </>
                    )}
                  </button>
                )}

                <span className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-purple-300">
                  Difficulty: {interviewState.currentDifficulty}
                </span>
              </div>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#050816]/60 font-sans">
              
              {interviewState.messages.map((msg) => {
                const isAI = msg.sender === 'interviewer';

                return (
                  <div 
                    key={msg.id}
                    className={`flex gap-3.5 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    {isAI ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px] shrink-0 shadow-md">
                        <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-cyan-300" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 shrink-0 flex items-center justify-center font-bold text-xs text-white font-mono shadow-md">
                        AR
                      </div>
                    )}

                    {/* Message Box */}
                    <div className={`space-y-2 max-w-[85%] ${isAI ? '' : 'text-right'}`}>
                      
                      {/* Meta header */}
                      <div className={`flex items-center gap-2 text-[11px] font-mono text-slate-400 ${isAI ? '' : 'justify-end'}`}>
                        <span className="font-bold text-slate-300">
                          {isAI ? 'The Interview Agent' : candidate.name}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        {msg.topic && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-[9px] text-cyan-400">
                            {msg.topic}
                          </span>
                        )}
                        {isAI && (
                          <button
                            onClick={() => playTTSVoice(msg.text, msg.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors ml-1"
                            title="Listen to interviewer voice (Clear audio)"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === msg.id ? 'text-cyan-400 animate-pulse' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Main Text Content */}
                      <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-lg ${
                        isAI 
                          ? 'bg-[#0B1120] text-slate-100 border-slate-800 shadow-blue-950/20' 
                          : 'bg-blue-950/70 text-slate-100 border-blue-800/80'
                      }`}>
                        {renderFormattedMessage(msg.text, isAI)}

                        {/* Code snippet rendering */}
                        {msg.codeSnippet && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto text-left">
                            <pre>{msg.codeSnippet}</pre>
                          </div>
                        )}
                      </div>

                      {/* Real-Time Answer Evaluation Score Chip for Candidate Answers */}
                      {!isAI && msg.evaluation && (
                        <div className="p-3 rounded-xl bg-[#0B1120] border border-slate-800 text-left space-y-2 shadow-md">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-cyan-400 font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" /> Real-time Answer Feedback
                            </span>
                            <span className="text-emerald-400 font-bold">
                              Overall: {Math.round((msg.evaluation.clarityScore + msg.evaluation.depthScore + msg.evaluation.systemDesignScore + msg.evaluation.tradeOffsScore) / 4)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                            <div className="p-1 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block">Clarity</span>
                              <span className="text-cyan-300 font-bold">{msg.evaluation.clarityScore}%</span>
                            </div>
                            <div className="p-1 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block">Depth</span>
                              <span className="text-blue-300 font-bold">{msg.evaluation.depthScore}%</span>
                            </div>
                            <div className="p-1 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block">Design</span>
                              <span className="text-purple-300 font-bold">{msg.evaluation.systemDesignScore}%</span>
                            </div>
                            <div className="p-1 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 block">Trade-offs</span>
                              <span className="text-emerald-300 font-bold">{msg.evaluation.tradeOffsScore}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}

              {/* AI Thinking Indicator */}
              {(isSubmitting || interviewState.isInterpreting) && (
                <div className="flex gap-3 items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 w-fit text-xs font-mono text-cyan-300">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>The Interview Agent is analyzing your engineering logic & generating follow-up...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Controls Panel */}
            <div className="p-4 border-t border-slate-800 bg-[#0B1120] space-y-3">
              
              {/* Live Voice Microphone Dictation Banner */}
              {isListening && (
                <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-800/80 flex items-center justify-between text-xs font-mono text-red-300 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="font-semibold text-red-200">Recording Live Candidate Voice...</span>
                    <span className="px-2 py-0.5 rounded bg-red-900/60 border border-red-700/50 text-red-100 font-mono text-[11px]">
                      {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:{((recordingSeconds % 60)).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={stopListening}
                    className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-sans text-xs font-semibold shadow transition-colors"
                  >
                    Done & Transcribe
                  </button>
                </div>
              )}

              {/* Transcribing Audio Banner */}
              {isTranscribing && (
                <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/80 flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                  <span>Processing spoken response via Gemini AI Audio Transcription...</span>
                </div>
              )}

              {/* Microphone Error Notice */}
              {micError && (
                <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-amber-200 shadow-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-300 block">Microphone Access Notice</span>
                      <span>{micError}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        const sampleSpokenResponses = [
                          "In our production architecture, we mitigate vector query latency by employing Product Quantization (PQ) on an HNSW index, paired with a Redis semantic cache for frequent query embeddings.",
                          "For high throughput under 10x traffic spikes, we decouple embedding generation using an asynchronous Kafka queue and scale our read-replicas horizontally.",
                          "We implement an agentic router using MCP tools that evaluates query intent before choosing between dense vector search and sparse keyword retrieval."
                        ];
                        const randomResponse = sampleSpokenResponses[Math.floor(Math.random() * sampleSpokenResponses.length)];
                        setInputText(randomResponse);
                        setMicError(null);
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/60 text-[11px] font-sans font-semibold flex items-center gap-1 transition-colors"
                      title="Insert a sample spoken candidate answer to test live voice submission"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Simulate Spoken Voice
                    </button>
                    <button
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-700 text-amber-100 text-[11px] font-sans font-semibold flex items-center gap-1 transition-colors"
                      title="Open application in a full browser tab to grant microphone access"
                    >
                      <ExternalLink className="w-3 h-3" /> Open in New Tab
                    </button>
                    <button
                      onClick={() => setMicError(null)}
                      className="text-amber-400 hover:text-amber-200 text-[11px] underline px-1"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Code Input Toggle */}
              {showCodeInput && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <Code className="w-4 h-4" /> Code / Architecture snippet (TypeScript / JSON / Diagram)
                    </span>
                    <button 
                      onClick={() => setShowCodeInput(false)}
                      className="text-slate-500 hover:text-slate-300 text-[10px]"
                    >
                      Hide
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={codeInputText}
                    onChange={(e) => setCodeInputText(e.target.value)}
                    placeholder="e.g. const index = new HNSWIndex({ dim: 1536, M: 16, efConstruction: 200 });"
                    className="w-full p-2.5 rounded-lg bg-[#050816] text-xs font-mono text-cyan-300 border border-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {/* Live Microphone Dictation Button */}
                <button
                  onClick={toggleListening}
                  title={isListening ? "Stop live voice recording" : "Speak answer live with microphone"}
                  className={`p-3 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-lg shadow-red-500/10 animate-pulse'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Attach Code Button */}
                <button
                  onClick={() => setShowCodeInput(!showCodeInput)}
                  title="Attach Code Snippet"
                  className={`p-3 rounded-xl border transition-all ${
                    showCodeInput || codeInputText
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Code className="w-4 h-4" />
                </button>

                <textarea
                  id="candidate-answer-input"
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder="Provide your live response explaining architectural decisions, trade-offs, and system design... (Type or click Mic to speak live)"
                  className="flex-1 p-3 rounded-xl bg-[#050816] border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 resize-none font-sans"
                />

                <button
                  id="submit-candidate-answer-btn"
                  onClick={() => handleSubmitAnswer()}
                  disabled={(!inputText.trim() && !codeInputText.trim()) || isSubmitting}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs font-mono shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all border border-blue-400/30 shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Live</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>Shift + Enter for new line • Click Mic to dictate live</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live Candidate Response Required
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
