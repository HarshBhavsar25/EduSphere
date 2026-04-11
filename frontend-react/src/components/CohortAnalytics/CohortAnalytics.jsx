import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { FLOORS } from '../../config/locations';
import FloorPlan from './FloorPlan';
import { Activity, BellRing, Bot, Map, Users, AlertTriangle, Zap, Send, Maximize2, Minimize2, Mic, MicOff } from 'lucide-react';
import './CohortAnalytics.css';

const DEFAULT_PROMPTS = [
  "Are there any mass gatherings right now?",
  "Locate the most crowded area.",
  "What is the system status?",
  "Are there any security alerts?"
];

// Fallback checking for Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const CohortAnalytics = () => {
  const { selectedFloor, handleFloorSelect, selectedRoom, occupancyData, alerts, isConnected } = useCampus();
  
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'ai', text: 'Hello! I am Grok CampusAI. Ask me anything about the live student distribution or anomalies.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize Speech recognition hook
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsRecording(false);
        // Automatically submit the voice query
        submitToGrok(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, []);

  const mapRef = React.useRef(null);
  const statsRef = React.useRef(null);
  const alertsRef = React.useRef(null);
  const chatRef = React.useRef(null);
  const chatBottomRef = React.useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isTyping]);

  const toggleNativeFullscreen = (ref) => {
    if (!document.fullscreenElement) {
      if (ref.current && ref.current.requestFullscreen) {
        ref.current.requestFullscreen().catch((err) => {
          console.error(`Error enabling native fullscreen: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  const toggleVoiceMode = () => {
    if (!recognition) return alert('Your browser does not support Voice Recognition.');
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const submitToGrok = async (userMessage) => {
    if (!userMessage.trim()) return;

    setChatLog(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          occupancyData,
          alerts
        })
      });
      const data = await response.json();

      if (data.success) {
        setChatLog(prev => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        setChatLog(prev => [...prev, { role: 'error', text: 'Error: ' + data.error }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'error', text: 'Failed to connect to AI engine.' }]);
    }
    setIsTyping(false);
  };

  const handleAskGrok = (e) => {
    e.preventDefault();
    submitToGrok(chatInput);
  };
  
  // Calculate total students on campus
  const totalStudents = Object.values(occupancyData).reduce((a, b) => a + b, 0);
  
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="title-bar">
          <h2><Activity className="icon-mr" size={24} color="#0ea5e9" /> Campus Intelligence</h2>
          <div className="status-indicator">
            <span className={`dot ${isConnected ? 'live' : 'offline'}`}></span>
            {isConnected ? 'LIVE (Compass)' : 'OFFLINE'}
          </div>
        </div>
        
        {/* Floor Selector Map */}
        <div className="floor-selector">
          <div className="floor-label"><Map size={16} /> Levels:</div>
          {FLOORS.map((floor) => (
            <button
              key={floor.id}
              className={`floor-btn ${selectedFloor === floor.id ? 'active' : ''}`}
              onClick={() => handleFloorSelect(floor.id)}
            >
              {floor.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 2D Map Area */}
      <div ref={mapRef} className={`map-container panel-transition`}>
        <button className="expand-toggle-map" onClick={() => toggleNativeFullscreen(mapRef)} title="Toggle Map Fullscreen">
          <Maximize2 size={18} />
        </button>
        <FloorPlan currentFloor={selectedFloor} />
      </div>
      
      {/* Bottom Data Grid */}
      <div className="info-layout">
        
        {/* STATS PANEL */}
        <div ref={statsRef} className={`info-panel panel-transition`}>
          <div className="panel-header-row">
            <h3><Users size={18} color="#0ea5e9" /> Global Overview</h3>
            <button className="expand-toggle" onClick={() => toggleNativeFullscreen(statsRef)}>
              <Maximize2 size={16} />
            </button>
          </div>
          
          {selectedRoom ? (
            <div className="room-stats transition-slide-up">
              <div className="stat-card primary">
                <span className="stat-label">Selected Zone</span>
                <span className="stat-value highlight">{selectedRoom}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Live Occupancy</span>
                <span className="stat-value live-data">
                  {occupancyData[selectedRoom] !== undefined ? occupancyData[selectedRoom] : '—'}
                </span>
              </div>
            </div>
          ) : (
            <div className="global-stats transition-slide-up">
               <div className="stat-card">
                <span className="stat-label">Total Simulated</span>
                <span className="stat-value live-data">{totalStudents || 1000}</span>
              </div>
              <p className="placeholder-text">Click any zone on the map above to view detailed telemetry.</p>
            </div>
          )}
        </div>

        {/* ALERTS PANEL */}
        <div ref={alertsRef} className={`alerts-panel panel-transition`}>
          <div className="panel-header-row">
            <h3><BellRing size={18} color="#f43f5e" /> Active Alerts</h3>
            <button className="expand-toggle" onClick={() => toggleNativeFullscreen(alertsRef)}>
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="alerts-list">
            {alerts && alerts.length > 0 ? (
              alerts.map(a => (
                <div key={a.id} className={`alert-card ${a.severity}`}>
                  <div className="alert-header">
                    <AlertTriangle size={14} />
                    <span className="alert-type">{a.type}</span>
                  </div>
                  <div className="alert-loc">{a.location}</div>
                  <div className="alert-msg">{a.message}</div>
                </div>
              ))
            ) : (
              <div className="no-alerts-card">
                <Zap size={24} color="#10b981" />
                <p>Campus operating at optimal flow.</p>
              </div>
            )}
          </div>
        </div>

        {/* GROK AI PANEL */}
        <div ref={chatRef} className={`ai-chat-panel panel-transition`}>
          <div className="panel-header-row">
            <h3>
              <Bot size={18} color="#8b5cf6" /> 
              Grok CampusAI
              {isRecording && <span className="recording-dot"></span>}
            </h3>
            <button className="expand-toggle" onClick={() => toggleNativeFullscreen(chatRef)} title="Native Fullscreen mode">
               <Maximize2 size={16} />
            </button>
          </div>
          <div className="chat-window">
            {chatLog.map((msg, idx) => (
              <div key={idx} className={`chat-wrapper ${msg.role}`}>
                <div className={`chat-msg ${msg.role}`}>
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-wrapper ai">
                <div className="chat-msg ai typing">Analyzing data...</div>
              </div>
            )}
            {isRecording && (
              <div className="chat-wrapper user">
                <div className="chat-msg user typing voice-pulsing">Listening to voice...</div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div className="default-prompts-container">
            {DEFAULT_PROMPTS.map((prompt, idx) => (
              <button 
                key={idx} 
                className="prompt-chip" 
                onClick={() => submitToGrok(prompt)}
                disabled={isTyping || isRecording}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleAskGrok} className="chat-input-form">
            <button 
              type="button" 
              className={`mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleVoiceMode}
              title="Voice Mode"
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <input 
              type="text" 
              placeholder={isRecording ? "Listening..." : "Query live campus data..."} 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isRecording}
            />
            <button type="submit" disabled={isTyping || isRecording}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CohortAnalytics;
