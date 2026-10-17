import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Mic,
  MicOff,
  ShieldCheck,
  HelpCircle,
  FileText
} from 'lucide-react';
import { aiAssessmentService } from '../../services/aiAssessmentService';
import { storageService } from '../../services/storageService';

export function Stage2GeminiConversation({ onProceedToStage3, onBackToStage1 }) {
  const context = storageService.getStage1Context();
  const savedConversation = storageService.getStage2Conversation() || [];

  const [messages, setMessages] = useState(() => {
    if (savedConversation && savedConversation.length > 0) {
      return savedConversation;
    }
    // Initial welcome message tailored to context
    const studentName = context?.educationLevel ? `${context.educationLevel} student` : 'student';
    const firstSubject = context?.enjoyedSubjects?.[0] || 'your favorite topics';
    return [
      {
        id: 'msg-0',
        sender: 'ai',
        text: `Hi there! I'm your ZHERO Career Exploration partner. I've noted that you're currently exploring as a ${studentName} with an interest in ${firstSubject}. Rather than taking a generic quiz, let's talk about what genuinely excites you. To kick things off: What kind of activity or project makes you curious enough to lose track of time?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiPowered: true,
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ configured: false, model: 'Checking...', provider: '' });
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeFallbackNotice, setActiveFallbackNotice] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check Gemini connection status on load
  useEffect(() => {
    aiAssessmentService.checkStatus().then((status) => {
      setApiStatus(status);
    });

    // Check optional Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      recognitionRef.current = recog;
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Persist conversation
    storageService.saveStage2Conversation(messages);
  }, [messages]);

  const userTurnsCount = messages.filter((m) => m.sender === 'user').length;
  const isReadyForSynthesis = userTurnsCount >= 3;

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Call server-side Gemini API
    const response = await aiAssessmentService.sendChatMessage(newHistory, context);

    if (!response.isAiPowered && response.fallbackReason) {
      setActiveFallbackNotice(response.fallbackReason);
    }

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: response.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiPowered: response.isAiPowered,
      model: response.model,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSynthesize = () => {
    storageService.saveStage2Conversation(messages);
    onProceedToStage3();
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '3rem' }}>

      {/* Main Conversation Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #EAE7E2',
        boxShadow: '0 4px 20px rgba(23, 23, 23, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
        maxHeight: '680px',
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #EAE7E2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8F8F7',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#171717' }}>
              Conversational Career Discovery
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#77736F', marginTop: '2px' }}>
              Take your time to reply in full sentences. There are no wrong answers.
            </p>
          </div>

          {/* Depth Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid #EAE7E2',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#171717' }}>
              Evidence depth: {userTurnsCount}/4
            </span>
            <div style={{
              width: '60px',
              height: '6px',
              backgroundColor: '#EAE7E2',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (userTurnsCount / 4) * 100)}%`,
                backgroundColor: '#FE6904',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: isUser ? '#171717' : '#FE6904',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  boxShadow: isUser ? 'none' : '0 4px 10px rgba(254, 105, 4, 0.25)',
                }}>
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Bubble */}
                <div style={{
                  backgroundColor: isUser ? '#171717' : '#F8F8F7',
                  color: isUser ? '#FFFFFF' : '#171717',
                  padding: '1rem 1.25rem',
                  borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  border: isUser ? 'none' : '1px solid #EAE7E2',
                  fontSize: '0.925rem',
                  lineHeight: '1.55',
                  boxShadow: '0 2px 6px rgba(23,23,23,0.02)',
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginTop: '4px',
                    fontSize: '0.7rem',
                    color: isUser ? 'rgba(255,255,255,0.7)' : '#77736F',
                  }}>
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              alignSelf: 'flex-start',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                backgroundColor: '#FE6904',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}>
                <Bot size={18} />
              </div>
              <div style={{
                backgroundColor: '#F8F8F7',
                padding: '0.85rem 1.25rem',
                borderRadius: '4px 16px 16px 16px',
                border: '1px solid #EAE7E2',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#77736F',
                fontSize: '0.85rem',
              }}>
                <Sparkles size={16} color="#FE6904" style={{ animation: 'spin 2s linear infinite' }} />
                <span>Reflecting on your perspective...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action Callout if ready for Stage 3 */}
        {isReadyForSynthesis && (
          <div style={{
            margin: '0 1.5rem 0.5rem 1.5rem',
            padding: '0.875rem 1.25rem',
            backgroundColor: '#FFE5CE',
            borderRadius: '12px',
            border: '1px solid #FA9B2A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#FE6904" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                You've provided strong qualitative evidence! You can continue chatting or generate your preliminary report now.
              </span>
            </div>
            <button
              onClick={handleSynthesize}
              style={{
                backgroundColor: '#FE6904',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(254, 105, 4, 0.25)',
              }}
            >
              Synthesize Report <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #EAE7E2',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your candid thoughts or ask clarifying questions..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #EAE7E2',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#171717',
              backgroundColor: '#F8F8F7',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FE6904')}
            onBlur={(e) => (e.target.style.borderColor = '#EAE7E2')}
          />

          {/* Optional Voice recognition button if supported */}
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Optional voice dictation'}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #EAE7E2',
                backgroundColor: isListening ? '#FFE5CE' : '#F8F8F7',
                color: isListening ? '#FE6904' : '#77736F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              height: '44px',
              padding: '0 20px',
              backgroundColor: !input.trim() || isLoading ? '#EAE7E2' : '#FE6904',
              color: !input.trim() || isLoading ? '#77736F' : '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Navigation Footer */}
      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={onBackToStage1}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid #EAE7E2',
            padding: '10px 18px',
            borderRadius: '10px',
            color: '#171717',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Review Profile & Consent
        </button>

        <button
          onClick={handleSynthesize}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#171717',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Proceed to Preliminary Report <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
