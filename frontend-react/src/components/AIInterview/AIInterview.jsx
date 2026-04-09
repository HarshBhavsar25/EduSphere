import { useState, useEffect, useRef, useCallback } from 'react';
import './AIInterview.css';

const ROLES = [
  'Software Engineer', 'Full Stack Developer', 'Data Scientist',
  'Product Manager', 'Backend Developer', 'Frontend Developer',
  'DevOps Engineer', 'Machine Learning Engineer', 'Business Analyst',
];
const DIFFICULTY = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'es-ES', label: 'Español' },
];

/* ── Voice cache: loaded once, shared ───────────────────── */
let cachedVoices = [];
function getVoices() {
  if (cachedVoices.length) return cachedVoices;
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}
// Pre-warm voices on load
if (typeof window !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  // Trigger initial load
  cachedVoices = window.speechSynthesis.getVoices();
}

function pickVoice(langCode) {
  const voices = getVoices();
  if (!voices.length) return null;
  const langPrefix = langCode.slice(0, 2); // e.g. 'hi', 'en', 'fr'

  // 1. Exact lang match
  let v = voices.find(v => v.lang === langCode);
  // 2. Prefix match
  if (!v) v = voices.find(v => v.lang.startsWith(langPrefix));
  // 3. Any voice
  if (!v) v = voices[0];
  return v;
}

function detectEmotion(text) {
  const t = text.toLowerCase();
  if (/confident|sure|definitely|absolutely|expert|passion|strong|excel/.test(t))
    return { label: 'Confident', color: '#10b981', icon: '💪' };
  if (/nervous|anxious|um+|uh+|not sure|maybe|i think|possibly/.test(t))
    return { label: 'Nervous', color: '#f59e0b', icon: '😰' };
  if (/excited|love|amazing|fantastic|great experience|passionate/.test(t))
    return { label: 'Enthusiastic', color: '#6366f1', icon: '🚀' };
  if (/sorry|unfortunately|don.t know|unsure|struggle|failed|couldn.t/.test(t))
    return { label: 'Unsure', color: '#ef4444', icon: '😟' };
  return { label: 'Neutral', color: '#64748b', icon: '😐' };
}

/* ─── Animated Avatar ───────────────────────────────────────── */
function AvatarRing({ isTalking, isListening }) {
  return (
    <div className={`avatar-container ${isTalking ? 'talking' : ''} ${isListening ? 'listening' : ''}`}>
      {[1, 2, 3].map(r => (
        <div key={r}
          className={`avatar-ring ring-${r} ${isTalking ? 'ring-talking' : ''} ${isListening ? 'ring-listening' : ''}`}
        />
      ))}
      <div className="avatar-core">
        <div className="avatar-face">
          <div className="avatar-eyes">
            <div className={`eye left-eye ${isTalking ? 'blinking' : ''}`} />
            <div className={`eye right-eye ${isTalking ? 'blinking' : ''}`} />
          </div>
          <div className={`avatar-mouth ${isTalking ? 'mouth-talking' : 'mouth-neutral'}`} />
          {isTalking && (
            <div className="voice-bars">
              {[1, 2, 3, 4, 5].map(b => <div key={b} className={`vbar vbar-${b}`} />)}
            </div>
          )}
        </div>
        <div className="avatar-label">
          <span className="ai-name">ARIA</span>
          <span className="ai-title">AI Interviewer</span>
        </div>
      </div>
    </div>
  );
}

function ScoreMeter({ score }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="score-meter">
      <div className="score-track">
        <div className="score-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-label" style={{ color }}>{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
export default function AIInterview() {
  const [step, setStep] = useState('setup');
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [language, setLanguage] = useState('en-US');

  const [messages, setMessages] = useState([]);
  const [qCount, setQCount] = useState(0);

  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState({ label: 'Neutral', color: '#64748b', icon: '😐' });
  const [silenceCountdown, setSilenceCountdown] = useState(null); // seconds till auto-submit

  // Results
  const [scores, setScores] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  const historyRef = useRef([]);
  const recognitionRef = useRef(null);
  const autoListenRef = useRef(true);
  const chatEndRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTextRef = useRef('');           // accumulate final results
  const langRef = useRef(language);          // stable ref to current lang

  // Keep langRef in sync
  useEffect(() => { langRef.current = language; }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearSilenceTimer();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, []);

  /* ── Silence timer helpers ───────────────────────────── */
  function clearSilenceTimer() {
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setSilenceCountdown(null);
  }

  function startSilenceTimer(onTimeout) {
    clearSilenceTimer();
    let remaining = 2; // 2-second silence auto-submit
    setSilenceCountdown(remaining);
    silenceTimerRef.current = setInterval(() => {
      remaining -= 1;
      setSilenceCountdown(remaining);
      if (remaining <= 0) {
        clearSilenceTimer();
        onTimeout();
      }
    }, 1000);
  }

  /* ── TTS — no lag, voice pre-resolved ───────────────── */
  const speak = useCallback((text, onDone) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langRef.current;

    // Resolve voice — try cache first, fallback on event
    const resolveAndSpeak = () => {
      const voice = pickVoice(langRef.current);
      if (voice) utter.voice = voice;
      utter.rate = 0.92;
      utter.pitch = 1.05;
      utter.volume = 1;
      utter.onstart = () => setIsTalking(true);
      utter.onend = () => {
        setIsTalking(false);
        if (onDone) onDone();
      };
      utter.onerror = () => {
        setIsTalking(false);
        if (onDone) onDone();
      };
      window.speechSynthesis.speak(utter);
    };

    const voices = getVoices();
    if (voices.length) {
      resolveAndSpeak();
    } else {
      // Wait for voices to load (first-load case)
      const prev = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = prev;
        resolveAndSpeak();
      };
    }
  }, []);

  /* ── Voice Recognition — continuous with silence auto-submit ── */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) {}
    }
    clearSilenceTimer();
    window.speechSynthesis.cancel();
    setIsTalking(false);

    finalTextRef.current = '';
    setTranscript('');

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = langRef.current;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTextRef.current += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      const combined = (finalTextRef.current + interim).trim();
      setTranscript(combined);
      if (combined) setCurrentEmotion(detectEmotion(combined));

      // Reset silence timer on every speech event
      if (combined) {
        startSilenceTimer(() => {
          // Auto-submit after silence
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (_) {}
          }
        });
      }
    };

    rec.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
      const text = finalTextRef.current.trim() || transcript;
      if (text && autoListenRef.current) {
        submitAnswerRef.current(text);
      }
    };

    rec.onerror = (e) => {
      if (e.error === 'no-speech') {
        // Restart recognition silently if no speech detected
        if (autoListenRef.current && !isProcessing) {
          setTimeout(() => {
            if (autoListenRef.current) startListening();
          }, 300);
        }
      } else {
        setIsListening(false);
        clearSilenceTimer();
      }
    };

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }, []); // no deps — uses refs

  /* Stable ref so rec.onend can call the latest submitAnswer */
  const submitAnswerRef = useRef(null);

  const stopManually = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsListening(false);
    const text = finalTextRef.current.trim() || transcript;
    if (text) submitAnswerRef.current?.(text);
  }, [transcript]);

  /* ── Call Backend ────────────────────────────────────── */
  const callBackend = useCallback(async (message) => {
    const res = await fetch('/api/ai/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        message,
        history: historyRef.current,
        role,
        difficulty,
        language,
        unlimited: true,
      }),
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  }, [role, difficulty, language]);

  /* ── Submit Answer ───────────────────────────────────── */
  const submitAnswer = useCallback(async (text) => {
    if (!text || isProcessing) return;
    const emotion = detectEmotion(text);
    setCurrentEmotion(emotion);
    setMessages(m => [...m, { role: 'user', text, emotion }]);
    historyRef.current.push({ role: 'user', content: text });
    setTranscript('');
    finalTextRef.current = '';
    setIsProcessing(true);

    try {
      const data = await callBackend(text);
      const reply = data.reply || '';
      const score = data.score ?? null;
      const fb = data.feedback ?? null;

      historyRef.current.push({ role: 'assistant', content: reply });
      setMessages(m => [...m, { role: 'ai', text: reply, score, feedback: fb }]);
      if (score !== null) setScores(s => [...s, score]);
      if (fb) setFeedbacks(f => [...f, fb]);
      setQCount(q => q + 1);

      speak(reply, () => {
        if (autoListenRef.current) startListening();
      });
    } catch {
      const fallbackMsg = "I had a small hiccup. Could you please elaborate more on that?";
      setMessages(m => [...m, { role: 'ai', text: fallbackMsg }]);
      speak(fallbackMsg, () => {
        if (autoListenRef.current) startListening();
      });
    } finally {
      setIsProcessing(false);
    }
  }, [callBackend, isProcessing, speak, startListening]);

  // Keep submitAnswerRef always pointing to latest
  useEffect(() => { submitAnswerRef.current = submitAnswer; }, [submitAnswer]);

  /* ── Start ───────────────────────────────────────────── */
  async function startInterview() {
    setStep('interview');
    setMessages([]);
    historyRef.current = [];
    setScores([]); setFeedbacks([]);
    setQCount(0);
    autoListenRef.current = true;
    setIsProcessing(true);
    finalTextRef.current = '';

    try {
      const data = await callBackend('__START__');
      const reply = data.reply || "Hello! I'm ARIA. Let's begin the interview!";
      historyRef.current.push({ role: 'assistant', content: reply });
      setMessages([{ role: 'ai', text: reply }]);
      setQCount(1);
      speak(reply, () => { if (autoListenRef.current) startListening(); });
    } catch {
      const fallback = "Hello! I'm ARIA, your AI interviewer. Please introduce yourself.";
      setMessages([{ role: 'ai', text: fallback }]);
      speak(fallback, () => { if (autoListenRef.current) startListening(); });
    } finally {
      setIsProcessing(false);
    }
  }

  /* ── Finish Interview ────────────────────────────────── */
  async function finishInterview() {
    autoListenRef.current = false;
    clearSilenceTimer();
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} }
    window.speechSynthesis.cancel();
    setIsListening(false);
    setIsTalking(false);
    setIsFinishing(true);
    setIsProcessing(true);

    try {
      const data = await callBackend('__FINISH__');
      const reply = data.reply || "Thank you for the interview!";
      const of = data.overall_feedback || reply;
      historyRef.current.push({ role: 'assistant', content: reply });
      setOverallFeedback(of);
      speak(reply, () => setStep('results'));
    } catch {
      setOverallFeedback("Thank you for the interview! Overall you showed good potential.");
      setStep('results');
    } finally {
      setIsProcessing(false);
      setIsFinishing(false);
    }
  }

  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  /* ══════════ SETUP SCREEN ════════════════════════════════ */
  if (step === 'setup') {
    return (
      <div className="interview-page">
        <div className="interview-bg-orbs">
          <div className="orb-1" /><div className="orb-2" /><div className="orb-3" />
        </div>
        <div className="setup-container">
          <div className="setup-avatar-wrap">
            <AvatarRing isTalking={false} isListening={false} />
          </div>
          <div className="setup-card">
            <div className="setup-header">
              <h1>AI Mock Interview</h1>
              <p>Practice with <span className="highlight-name">ARIA</span> — professional AI interviewer. Speak naturally, get real feedback.</p>
            </div>
            <div className="setup-features">
              {['🎤 Hands-free voice', '🔇 Auto silence detect', '🌐 Multilingual', '🧠 Emotion AI', '📊 Live scoring'].map(f => (
                <div className="feature-chip" key={f}>{f}</div>
              ))}
            </div>
            <div className="setup-form">
              <div className="form-row">
                <label>Target Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Difficulty</label>
                <div className="difficulty-pills">
                  {DIFFICULTY.map(d => (
                    <button key={d} className={`pill ${difficulty === d ? 'active' : ''}`}
                      onClick={() => setDifficulty(d)}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="setup-note">
              <i className="fas fa-info-circle" /> ARIA will <strong>automatically listen</strong> after speaking. Just pause and it will detect silence and submit your answer.
            </div>
            <button className="btn-start" onClick={startInterview}>
              <i className="fas fa-microphone" /> Begin Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════ RESULTS SCREEN ══════════════════════════════ */
  if (step === 'results') {
    const grade = avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : avgScore >= 40 ? 'Average' : 'Needs Improvement';
    const gradeColor = avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#6366f1' : avgScore >= 40 ? '#f59e0b' : '#ef4444';
    return (
      <div className="interview-page">
        <div className="interview-bg-orbs"><div className="orb-1" /><div className="orb-2" /></div>
        <div className="results-container">
          <div className="results-header">
            <AvatarRing isTalking={false} isListening={false} />
            <div className="result-score-block">
              <h1>Interview Complete 🎉</h1>
              <div className="overall-score" style={{ color: gradeColor }}>
                {avgScore}<span>%</span>
              </div>
              <div className="grade-badge" style={{ background: gradeColor + '22', border: `1px solid ${gradeColor}`, color: gradeColor }}>
                {grade}
              </div>
              <p className="overall-feedback-text">{overallFeedback}</p>
              <div className="result-meta">
                <span>📋 {qCount} Questions</span>
                <span>🌐 {LANGUAGES.find(l => l.code === language)?.label}</span>
                <span>🎯 {role}</span>
              </div>
            </div>
          </div>

          {feedbacks.length > 0 && (
            <div className="results-breakdown">
              <h2>📋 Detailed Performance Breakdown</h2>
              <div className="qa-list">
                {feedbacks.map((fb, i) => (
                  <div className="qa-card" key={i}>
                    <div className="qa-card-header">
                      <span className="q-num">Q{i + 1}</span>
                      {scores[i] != null && <ScoreMeter score={scores[i]} />}
                    </div>
                    <p className="qa-feedback">{fb}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="results-actions">
            <button className="btn-retry" onClick={() => { window.speechSynthesis.cancel(); setStep('setup'); }}>
              🔄 Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════ INTERVIEW SCREEN ════════════════════════════ */
  const statusText = isProcessing ? 'ARIA is thinking…'
    : isTalking ? 'ARIA is speaking…'
    : isListening ? (silenceCountdown !== null ? `Submitting in ${silenceCountdown}s…` : 'Listening…')
    : 'Ready';

  const statusClass = isProcessing ? 'processing' : isTalking ? 'talking' : isListening ? 'listening' : 'idle';

  return (
    <div className="interview-page">
      <div className="interview-bg-orbs"><div className="orb-1" /><div className="orb-2" /><div className="orb-3" /></div>
      <div className="interview-layout">

        {/* Left: Avatar Panel */}
        <div className="avatar-panel">
          <AvatarRing isTalking={isTalking} isListening={isListening} />

          <div className="interviewer-info">
            <div className="info-tag"><i className="fas fa-briefcase" /> {role}</div>
            <div className="info-tag"><i className="fas fa-signal" /> {difficulty}</div>
            <div className="info-tag"><i className="fas fa-globe" /> {LANGUAGES.find(l => l.code === language)?.label}</div>
            <div className="info-tag"><i className="fas fa-question-circle" /> {qCount} Questions asked</div>
          </div>

          {scores.length > 0 && (
            <div className="live-score-panel">
              <span>Live Avg Score</span>
              <ScoreMeter score={avgScore} />
            </div>
          )}

          <div className="emotion-panel">
            <span className="emotion-icon">{currentEmotion.icon}</span>
            <div>
              <div className="emotion-label" style={{ color: currentEmotion.color }}>{currentEmotion.label}</div>
              <div className="emotion-sub">Detected tone</div>
            </div>
          </div>

          <button
            className="btn-finish"
            onClick={finishInterview}
            disabled={isProcessing || isFinishing}
          >
            {isFinishing
              ? <><i className="fas fa-spinner fa-spin" /> Generating Report…</>
              : <><i className="fas fa-flag-checkered" /> Finish &amp; Get Report</>
            }
          </button>
        </div>

        {/* Right: Chat */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-title">
              <span className={`status-dot ${statusClass}`} />
              {statusText}
            </div>
            <div className="header-controls">
              <span className="lang-chip">
                <i className="fas fa-globe" /> {LANGUAGES.find(l => l.code === language)?.label}
              </span>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg-wrapper ${m.role}`}>
                {m.role === 'ai' && <div className="msg-avatar-sm">A</div>}
                <div className={`msg-bubble ${m.role}`}>
                  <p>{m.text}</p>
                  {m.score != null && (
                    <div className="msg-score"><ScoreMeter score={m.score} /></div>
                  )}
                  {m.emotion && (
                    <div className="msg-emotion" style={{ color: m.emotion.color }}>
                      {m.emotion.icon} {m.emotion.label}
                    </div>
                  )}
                  {m.feedback && (
                    <div className="msg-feedback"><i className="fas fa-comment-alt" /> {m.feedback}</div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="msg-wrapper ai">
                <div className="msg-avatar-sm">A</div>
                <div className="msg-bubble ai typing-bubble"><span /><span /><span /></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Zone — responsive */}
          <div className="voice-zone">
            {/* Mobile avatar strip */}
            <div className="mobile-avatar-strip">
              <div className="mobile-status-row">
                <span className={`status-dot ${statusClass}`} />
                <span className="mobile-status-text">{statusText}</span>
                <span className="mobile-emotion">{currentEmotion.icon} {currentEmotion.label}</span>
              </div>
            </div>

            {transcript && (
              <div className="transcript-preview">
                <i className="fas fa-microphone-alt" /> {transcript}
                {silenceCountdown !== null && (
                  <span className="silence-chip">Auto-send in {silenceCountdown}s</span>
                )}
              </div>
            )}

            {/* Auto-listen status bar */}
            <div className="voice-status-bar">
              <div className={`voice-indicator ${isListening ? 'active' : isTalking ? 'speaking' : isProcessing ? 'processing' : ''}`}>
                <div className="vi-dot" />
                <span>
                  {isListening
                    ? silenceCountdown !== null
                      ? `Silence detected — auto-submitting in ${silenceCountdown}s`
                      : '🎙 Listening… speak your answer'
                    : isTalking
                    ? '🔊 ARIA is speaking — mic starts automatically after'
                    : isProcessing
                    ? '⏳ Processing your answer…'
                    : '✅ Ready — mic will start after ARIA speaks'}
                </span>
              </div>
              <div className="voice-actions">
                {isListening && (
                  <button className="btn-mic recording" onClick={stopManually}>
                    <i className="fas fa-paper-plane" /> Send Now
                  </button>
                )}
                {!isListening && !isTalking && !isProcessing && (
                  <button className="btn-mic" onClick={startListening}>
                    <i className="fas fa-microphone" /> Speak
                  </button>
                )}
                {/* Mobile finish */}
                <button
                  className="btn-finish-mobile"
                  onClick={finishInterview}
                  disabled={isProcessing || isFinishing}
                >
                  {isFinishing ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-flag-checkered" />}
                  {isFinishing ? ' Report…' : ' Finish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
