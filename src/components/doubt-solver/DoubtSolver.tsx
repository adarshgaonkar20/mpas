import React, { useState, useRef, useEffect } from 'react';
import { requestDoubtSolver } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Trash2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isDemo?: boolean;
}

const SUGGESTED_DOUBTS = [
  'How does Banker\'s Algorithm determine if a state is safe? Show with an allocation matrix.',
  'Derive the time complexity of Dijkstra\'s algorithm with min-heap vs adjacency matrix.',
  'Explain 3NF vs BCNF with a concrete relational functional dependency example.',
  'How does TCP 3-way handshake prevent duplicate connection attempts?',
  'What is the difference between paging and segmentation in Virtual Memory?',
];

export const DoubtSolver: React.FC = () => {
  const { showToast } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I am your CampusMate AI Academic Doubt Solver. 🎓

Ask any conceptual, algorithmic, or mathematical doubt from your coursework. I'll provide:
1. **Clear Governing Principles**
2. **Step-by-Step Derivations / Mathematical Steps**
3. **Clean Code & Concrete Examples**
4. **Common Exam Traps & Edge Cases**

What subject or concept are you studying right now?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Computer Science & Engineering');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryToSend = inputQuery) => {
    const text = queryToSend.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await requestDoubtSolver(text, history, subject);

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'model',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: res.isDemo,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      showToast(err.message || 'Error communicating with AI tutor', 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'model',
          content: 'I encountered an error solving this academic doubt. Please verify your connection or try rephrasing the question.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied answer to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: 'Chat cleared. Ask a new doubt or pick one of the suggestions below!',
        timestamp: 'Just now',
      },
    ]);
    showToast('Conversation reset', 'info');
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <span>AI Doubt Solver</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                Step-by-Step
              </span>
            </h1>
            <p className="text-[11px] text-neutral-500">
              Rigorous, formula-verified engineering explanations with examples
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-xs text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested prompts strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-semibold text-neutral-400 whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Popular Doubts:
        </span>
        {SUGGESTED_DOUBTS.map((doubt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(doubt)}
            className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:border-emerald-500 transition-colors whitespace-nowrap shrink-0"
          >
            {doubt.length > 40 ? doubt.slice(0, 40) + '...' : doubt}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`rounded-xl p-3.5 text-xs shadow-xs transition-colors ${
                msg.role === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-neutral-100'
                  : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-neutral-400">
                <span className="font-semibold">
                  {msg.role === 'user' ? 'You' : 'CampusMate Academic Tutor'}
                </span>
                <div className="flex items-center gap-1.5">
                  {msg.isDemo && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Demo Mode
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              <div className="leading-relaxed font-sans whitespace-pre-line space-y-2">
                {msg.content}
              </div>

              {msg.role === 'model' && msg.id !== 'welcome' && (
                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy answer'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white shrink-0 flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing doubt, checking formulas & derivation steps...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box */}
      <div className="shrink-0 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type your academic question (e.g. 'Derive quicksort recurrence relation using master theorem')..."
            className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <span>Target Syllabus: Computer Science & Engineering Core</span>
          <span className="italic">Step-by-step academic guidance. Verify university syllabus guidelines.</span>
        </div>
      </div>
    </div>
  );
};
