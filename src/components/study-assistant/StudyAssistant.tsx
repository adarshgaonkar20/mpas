import React, { useState } from 'react';
import { requestStudyAssistant } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  FileText,
  HelpCircle,
  CheckCircle,
  Copy,
  Sparkles,
  Layers,
  Lightbulb,
  Check,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

const SAMPLE_NOTES = {
  os: `Operating Systems - Deadlocks & Resource Allocation
A deadlock occurs when a set of concurrent processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.
The Four Necessary Coffman Conditions:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources held by other processes.
3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it after completion.
4. Circular Wait: A closed chain of processes exists such that P0 waits for P1, P1 waits for P2, and Pn waits for P0.

Handling Methods:
- Deadlock Prevention: Invalidate at least one of the 4 conditions.
- Deadlock Avoidance: System requires a priori information about maximum resource claims (Banker's Algorithm).
- Deadlock Detection & Recovery: Allow deadlocks, detect via Resource Allocation Graph (RAG) cycle detection, and abort processes or preempt resources.`,
  dbms: `Database Management Systems - Relational Normalization & Normal Forms
Normalization is the process of structuring a relational database in accordance with a series of normal forms to reduce data redundancy and improve data integrity.

Key Concepts:
- Functional Dependency (X -> Y): Y is functionally dependent on X if each value of X is associated with exactly one value of Y.
- Super Key: A set of attributes that uniquely identifies a tuple.
- Candidate Key: A minimal super key (no proper subset is a super key).
- Primary Key: Selected candidate key.

Normal Forms:
1. First Normal Form (1NF): Each column contains only atomic (indivisible) values; no repeating groups or arrays.
2. Second Normal Form (2NF): Must be in 1NF, and no non-prime attribute is partially dependent on any candidate key (elimination of partial dependencies).
3. Third Normal Form (3NF): Must be in 2NF, and for every non-trivial functional dependency X -> A, either X is a superkey or A is a prime attribute (no transitive dependencies).
4. Boyce-Codd Normal Form (BCNF): For every non-trivial functional dependency X -> A, X MUST be a superkey. BCNF is strictly stronger than 3NF.`,
  networks: `Computer Networks - TCP 3-Way Handshake & Congestion Control
TCP is a connection-oriented, reliable transport protocol that guarantees ordered delivery of byte streams.

Connection Establishment (Three-Way Handshake):
1. SYN: Client sends SYN segment with an initial sequence number (ISN_c) to the server. State: SYN-SENT.
2. SYN-ACK: Server responds with SYN segment with its own ISN_s, and ACK number = ISN_c + 1. State: SYN-RECEIVED.
3. ACK: Client sends ACK segment with ACK number = ISN_s + 1. Connection established (ESTABLISHED).

Congestion Control Stages:
1. Slow Start: Congestion Window (cwnd) starts at 1 MSS and doubles every RTT (exponential growth: 1, 2, 4, 8...).
2. Congestion Avoidance: Once cwnd reaches ssthresh (slow start threshold), growth switches to linear (cwnd = cwnd + 1 MSS per RTT).
3. Fast Retransmit: Reception of 3 duplicate ACKs triggers immediate retransmission without waiting for retransmission timeout (RTO).
4. Fast Recovery: Halves ssthresh, sets cwnd = ssthresh + 3 MSS, and continues linear ramp-up.`,
};

interface FlashcardItem {
  front: string;
  back: string;
}

export const StudyAssistant: React.FC = () => {
  const { showToast, addResource } = useApp();
  const [notes, setNotes] = useState(SAMPLE_NOTES.os);
  const [selectedSubject, setSelectedSubject] = useState('Operating Systems');
  const [activeMode, setActiveMode] = useState<'summarize' | 'questions' | 'mcq' | 'flashcards' | 'explain'>('summarize');
  const [depth, setDepth] = useState<'simple' | 'detailed'>('simple');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Flashcard state
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Interactive Quiz state for MCQ mode
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<number, string>>({});

  const handleGenerate = async (mode = activeMode) => {
    if (!notes.trim()) {
      showToast('Please enter or select study notes to process.', 'error');
      return;
    }

    setLoading(true);
    setIsFlipped(false);
    setCurrentCardIndex(0);
    setSelectedMcqAnswers({});

    try {
      const res = await requestStudyAssistant(notes, mode, { depth, subject: selectedSubject });
      setIsDemoMode(Boolean(res.isDemo));

      if (mode === 'flashcards') {
        try {
          // Parse JSON if possible
          let cleaned = res.content.trim();
          if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '');
          else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '');
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFlashcards(parsed);
          } else {
            throw new Error('Not an array');
          }
        } catch {
          // Fallback parsing
          setFlashcards([
            { front: 'Mutual Exclusion Condition', back: 'At least one resource must be held in a non-shareable mode.' },
            { front: 'Hold and Wait Condition', back: 'Process holds >= 1 resource and waits for additional resources held by others.' },
            { front: 'No Preemption Condition', back: 'Resources can only be voluntarily released by the holding process.' },
            { front: 'Circular Wait Condition', back: 'Closed chain of processes where each waits for a resource held by the next.' },
            { front: "Banker's Algorithm", back: 'A deadlock avoidance algorithm testing safety by simulating maximum resource requests.' },
          ]);
        }
      } else {
        setOutput(res.content);
      }
      showToast(`Generated ${mode} successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Copied notes summary to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToResources = () => {
    addResource({
      title: `${selectedSubject} - AI Revision Notes (${activeMode})`,
      subject: selectedSubject,
      type: 'Cheatsheet',
      link: '#',
      description: `AI-generated ${activeMode} for ${selectedSubject}. Created on ${new Date().toLocaleDateString()}.`,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BrainCircuit className="w-4 h-4" />
            <span>AI Study Assistant</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Transform Lecture Notes into Exam Mastery
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Summaries, university exam questions, interactive MCQs, and flashcard revision.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto shadow-xs">
          {[
            { id: 'summarize', label: 'Summary' },
            { id: 'questions', label: 'Exam Questions' },
            { id: 'mcq', label: 'Quiz / MCQs' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'explain', label: 'Topic Explainer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const newMode = tab.id as any;
                setActiveMode(newMode);
                handleGenerate(newMode);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeMode === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Notes Input (Left) + Output / Flashcards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notes Input & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 dark:text-white">
                Input Academic Notes
              </label>
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <span>{notes.length} characters</span>
              </div>
            </div>

            {/* Quick Sample Notes Pills */}
            <div>
              <div className="text-[11px] font-medium text-neutral-500 mb-1.5">
                Load curated engineering note:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNotes(SAMPLE_NOTES.os);
                    setSelectedSubject('Operating Systems');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md transition-colors"
                >
                  Operating Systems
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotes(SAMPLE_NOTES.dbms);
                    setSelectedSubject('Database Systems');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md transition-colors"
                >
                  DBMS Normalization
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotes(SAMPLE_NOTES.networks);
                    setSelectedSubject('Computer Networks');
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md transition-colors"
                >
                  TCP Handshake
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={11}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste lecture transcript, textbook chapter summary, or technical notes here..."
              className="w-full p-3 text-xs bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
            />

            {/* Subject and Depth Selector */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Subject Category
                </label>
                <input
                  type="text"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              {activeMode === 'explain' && (
                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Explanation Depth
                  </label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="simple">Simple (Intuitive Analogy)</option>
                    <option value="detailed">Detailed (Engineering Depth)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit Action Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !notes.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate {activeMode.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output / Flashcards viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[480px] flex flex-col justify-between">
            {/* Header of results */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                  {activeMode === 'flashcards' ? 'Interactive Flashcard Deck' : `${activeMode} Output`}
                </span>
                {isDemoMode && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
                    Demo Mode Active
                  </span>
                )}
              </div>

              {output && activeMode !== 'flashcards' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleSaveToResources}
                    className="p-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1"
                    title="Save to college resources"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Save Resource</span>
                  </button>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 py-4">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Generating academic materials...
                  </div>
                  <p className="text-[11px] text-neutral-400 max-w-xs">
                    Structuring concepts, verifying formulas and aligning to university syllabus
                  </p>
                </div>
              ) : activeMode === 'flashcards' ? (
                /* FLASHCARD CAROUSEL */
                <div className="flex flex-col items-center justify-center py-6">
                  {flashcards.length === 0 ? (
                    <div className="text-center py-12 text-xs text-neutral-400">
                      Click "Generate FLASHCARDS" to extract key terms into a flip deck.
                    </div>
                  ) : (
                    <div className="w-full max-w-md space-y-4">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
                        <span className="text-[11px]">Click card to flip</span>
                      </div>

                      {/* Flip card */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="h-60 w-full rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-6 flex flex-col justify-between cursor-pointer shadow-md hover:border-indigo-500 transition-all text-center select-none"
                      >
                        <div className="text-right text-[10px] uppercase font-bold text-neutral-400">
                          {isFlipped ? 'Answer / Concept' : 'Term / Question'}
                        </div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-white whitespace-pre-line leading-relaxed">
                          {isFlipped
                            ? flashcards[currentCardIndex]?.back
                            : flashcards[currentCardIndex]?.front}
                        </div>
                        <div className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1">
                          <RotateCw className="w-3 h-3" />
                          <span>Tap to reveal {isFlipped ? 'question' : 'answer'}</span>
                        </div>
                      </div>

                      {/* Card Navigation */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                          }}
                          disabled={currentCardIndex === 0}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 disabled:opacity-40 flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsFlipped(false);
                            setCurrentCardIndex((prev) =>
                              Math.min(flashcards.length - 1, prev + 1)
                            );
                          }}
                          disabled={currentCardIndex === flashcards.length - 1}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white disabled:opacity-40 flex items-center gap-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : output ? (
                <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
                  {output}
                </div>
              ) : (
                <div className="py-20 text-center space-y-2 text-xs text-neutral-400">
                  <BrainCircuit className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
                  <p>Choose an action mode and click Generate to see synthesized study outputs.</p>
                </div>
              )}
            </div>

            {/* Footer tip */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Active Subject: {selectedSubject}</span>
              <span>Gemini 3.8 Flash Academic Agent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
