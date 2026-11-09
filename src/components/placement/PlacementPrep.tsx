import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { requestMockInterviewEvaluation } from '../../services/api';
import {
  Briefcase,
  Code2,
  Users2,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Play,
  Award,
  RefreshCw,
  Send,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import { InterviewQuestion } from '../../types';

const TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 't1',
    category: 'Technical',
    subCategory: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    question: 'How do you detect a cycle in a linked list and find the start node of the cycle?',
    answerSummary: `Use Floyd's Cycle Detection Algorithm (Slow and Fast Pointers):
1. Initialize two pointers: slow = head, fast = head.
2. Advance slow by 1 step (slow = slow.next) and fast by 2 steps (fast = fast.next.next).
3. If fast == null or fast.next == null, there is no cycle.
4. If slow and fast meet, a cycle exists.
5. To find the entrance to the cycle: Reset slow = head, keep fast at the meeting point. Move both pointers 1 step at a time until they meet again. That meeting point is the entry of the cycle!
Complexity: O(N) Time, O(1) Auxiliary Space.`,
    codeSnippet: `ListNode* detectCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode *entry = head;
            while (entry != slow) {
                entry = entry->next;
                slow = slow->next;
            }
            return entry;
        }
    }
    return nullptr;
}`,
  },
  {
    id: 't2',
    category: 'Technical',
    subCategory: 'Operating Systems',
    difficulty: 'Medium',
    question: 'Explain Virtual Memory, Paging, and the role of the TLB (Translation Lookaside Buffer).',
    answerSummary: `Virtual memory gives each process the illusion of a large, contiguous address space while utilizing non-contiguous physical RAM pages and disk swap space.
- Page Table: Maps virtual page numbers (VPN) to physical page frame numbers (PFN).
- TLB: A high-speed hardware cache located on the CPU memory management unit (MMU) storing recent VPN-to-PFN mappings.
- TLB Hit vs Miss: If the virtual page is in the TLB (TLB Hit ~1 CPU cycle), physical memory is accessed directly. On TLB miss, a page table walk is performed (costing 50-100 cycles), and the TLB is updated.
- Page Fault: Occurs when the referenced virtual page is not currently in physical memory; triggers an OS trap to fetch the page from disk swap space into an available frame (using LRU or FIFO page replacement).`,
  },
  {
    id: 't3',
    category: 'Technical',
    subCategory: 'Database Systems',
    difficulty: 'Hard',
    question: 'What is the difference between Optimistic vs Pessimistic Concurrency Control in DBMS?',
    answerSummary: `Pessimistic Concurrency Control (PCC):
- Assumes transaction conflicts will happen frequently.
- Acquires locks (Shared locks for reads, Exclusive locks for writes) before performing operations (Two-Phase Locking - 2PL).
- Prevents dirty reads and non-repeatable reads, but introduces locking overhead, reduced concurrency, and potential deadlocks.

Optimistic Concurrency Control (OCC):
- Assumes conflicts are rare.
- Phases: 1) Read & Compute Phase (records local modifications), 2) Validation Phase (checks if any other transaction committed changes to overlapping data), 3) Write Phase (commits or aborts).
- Ideal for read-heavy workloads with rare write collisions.`,
  },
];

const HR_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'hr1',
    category: 'HR',
    difficulty: 'Medium',
    question: 'Tell me about a time you experienced a major conflict or disagreement in a technical team project.',
    answerSummary: `Use the STAR Framework:
- Situation: During our 4th-semester software lab project, our 4-person team had a deadline in 48 hours, and two teammates disagreed sharply on whether to use SQL or MongoDB for our data schema.
- Task: As the project lead, I needed to resolve the technical deadlock quickly without alienating either team member and keep our deliverable on schedule.
- Action: I called a 20-minute time-boxed design review. We wrote down our query access patterns on a whiteboard. Seeing that our domain had strict ACID banking requirements and relations between students and exam halls, it became mathematically obvious that PostgreSQL suited our schema best. We also agreed to use JSONB columns for flexible event metadata so the MongoDB advocate felt their architectural concerns were heard.
- Result: We finalized the schema that evening, integrated the APIs smoothly, and earned an 'A' grade with zero merge conflicts.`,
  },
  {
    id: 'hr2',
    category: 'HR',
    difficulty: 'Easy',
    question: 'Why do you want to join our engineering organization specifically?',
    answerSummary: `Key Strategy:
1. Demonstrate specific company knowledge: Mention a real product, open-source repository, or engineering blog post they published.
2. Align their mission with your personal projects: Connect your distributed systems or UI work to their platform challenge.
3. Express long-term growth mindset: Highlight how their mentorship and high engineering bar will allow you to grow from an SDE-1 into an impactful system owner.`,
  },
];

const APTITUDE_QUESTIONS = [
  {
    id: 'ap1',
    topic: 'Time & Work',
    question: 'Pipe A can fill a tank in 12 hours, while Pipe B can empty it in 18 hours. If both pipes are opened together when the tank is half full, how much time will it take to fill the rest of the tank?',
    options: ['12 hours', '18 hours', '24 hours', '36 hours'],
    correct: 1, // 18 hours
    solution: 'Net filling rate per hour = (1/12) - (1/18) = (3 - 2)/36 = 1/36 of the tank per hour. To fill the remaining half tank (1/2), time = (1/2) / (1/36) = 18 hours.',
  },
  {
    id: 'ap2',
    topic: 'Permutations & Probability',
    question: 'In how many different ways can the letters of the word "ENGINEERING" be arranged?',
    options: ['277,200', '166,320', '332,640', '138,600'],
    correct: 0, // 277,200
    solution: 'Total letters = 11. Counts: E = 3, N = 3, G = 2, I = 2, R = 1. Total arrangements = 11! / (3! * 3! * 2! * 2!) = 39,916,800 / (6 * 6 * 2 * 2) = 39,916,800 / 144 = 277,200.',
  },
];

export const PlacementPrep: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'technical' | 'hr' | 'aptitude' | 'mock'>('technical');
  const [expandedId, setExpandedId] = useState<string | null>('t1');

  // Aptitude interactive test state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showAptitudeSolutions, setShowAptitudeSolutions] = useState(false);

  // Mock interview state
  const [mockQuestion, setMockQuestion] = useState(
    'Explain how you would design an URL Shortener service like Bit.ly. Focus on key hash generation, collision resolution, and database selection.'
  );
  const [mockAnswer, setMockAnswer] = useState('');
  const [mockRole, setMockRole] = useState('Software Development Engineer (SDE-1)');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleRunMockInterview = async () => {
    if (!mockAnswer.trim()) {
      showToast('Please draft your answer before running the AI evaluation.', 'error');
      return;
    }

    setEvaluating(true);
    setEvaluationFeedback(null);

    try {
      const res = await requestMockInterviewEvaluation(
        mockQuestion,
        mockAnswer,
        activeTab === 'hr' ? 'hr' : 'technical',
        mockRole
      );
      if (res.feedback) {
        setEvaluationFeedback(res.feedback);
      } else if (res.evaluation) {
        setEvaluationFeedback(`### Evaluation Score: ${res.evaluation.score}/10
**Key Strengths:**
${res.evaluation.strengths.map((s: string) => `- ${s}`).join('\n')}

**Opportunities for Improvement:**
${res.evaluation.improvements.map((i: string) => `- ${i}`).join('\n')}

**Benchmark Model Answer:**
${res.evaluation.stellarAnswer}`);
      }
      showToast('Interview answer evaluated by AI Recruiter!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to evaluate interview response', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Briefcase className="w-4 h-4" />
            <span>Placement Preparation Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Campus Recruitment & Interview Mastery
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Technical questions, behavioral STAR frameworks, aptitude practice & AI mock assessments.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto shadow-xs">
          {[
            { id: 'technical', label: 'Technical (DSA/CS)' },
            { id: 'hr', label: 'HR Behavioral' },
            { id: 'aptitude', label: 'Quantitative Aptitude' },
            { id: 'mock', label: 'AI Mock Interview' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metric Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Core Technical PYQs</span>
          <div className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white mt-1">
            250+
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
            DSA, OS, DBMS & Networks
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Target Role</span>
          <div className="text-base font-bold text-neutral-900 dark:text-white mt-1 truncate">
            SDE-1 / Software Eng
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
            Tier-1 Tech & High-Growth
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Aptitude Success Rate</span>
          <div className="text-2xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            85%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Speed: 1.2 min/question
          </div>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span className="text-xs text-neutral-500">Mock Assessments</span>
          <div className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            12
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            Avg Score: 8.4 / 10
          </div>
        </div>
      </div>

      {/* 1. TECHNICAL QUESTIONS TAB */}
      {activeTab === 'technical' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500 flex items-center justify-between">
            <span>High-frequency engineering interview questions asked at Google, Microsoft, and Amazon</span>
            <span>Click question to reveal comprehensive solution & code</span>
          </div>

          <div className="space-y-3">
            {TECHNICAL_QUESTIONS.map((q) => {
              const isOpen = expandedId === q.id;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          {q.subCategory}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            q.difficulty === 'Hard'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                        {q.question}
                      </h3>
                    </div>

                    <div className="p-1 rounded-md text-neutral-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3 text-xs leading-relaxed">
                      <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-sans">
                        {q.answerSummary}
                      </div>

                      {q.codeSnippet && (
                        <div className="mt-2 rounded-lg bg-neutral-950 text-neutral-100 p-3 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                          <pre>{q.codeSnippet}</pre>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setMockQuestion(q.question);
                            setActiveTab('mock');
                          }}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Practice this in AI Mock Interview →</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HR BEHAVIORAL QUESTIONS TAB */}
      {activeTab === 'hr' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500">
            Master the STAR framework (Situation, Task, Action, Result) to impress senior engineering leaders.
          </div>

          <div className="space-y-3">
            {HR_QUESTIONS.map((q) => {
              const isOpen = expandedId === q.id;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                  >
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                        Behavioral / HR
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                        {q.question}
                      </h3>
                    </div>
                    <div className="text-neutral-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                      {q.answerSummary}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setMockQuestion(q.question);
                            setActiveTab('mock');
                          }}
                          className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Practice your STAR response in AI Mock Mode →</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. APTITUDE QUESTIONS TAB */}
      {activeTab === 'aptitude' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Timed Quantitative & Reasoning Test Simulator</span>
            <button
              onClick={() => setShowAptitudeSolutions(!showAptitudeSolutions)}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {showAptitudeSolutions ? 'Hide Explanations' : 'Check Answers & Explanations'}
            </button>
          </div>

          <div className="space-y-4">
            {APTITUDE_QUESTIONS.map((item, qIdx) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Question {qIdx + 1} · {item.topic}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                  {item.question}
                </p>

                {/* Option radios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[item.id] === optIdx;
                    const isCorrect = item.correct === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({ ...prev, [item.id]: optIdx }))
                        }
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          showAptitudeSolutions && isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : showAptitudeSolutions && isSelected && !isCorrect
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200'
                            : isSelected
                            ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900'
                            : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {showAptitudeSolutions && isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Solution Reveal */}
                {showAptitudeSolutions && (
                  <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/60 rounded-lg text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans mt-2">
                    <span className="font-bold text-neutral-900 dark:text-white">Explanation: </span>
                    {item.solution}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI MOCK INTERVIEW MODE */}
      {activeTab === 'mock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Question & Student Answer draft (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Mock Interview Simulation
                </span>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                  Live Technical & Behavioral Assessment
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Interview Question
                </label>
                <textarea
                  rows={2}
                  value={mockQuestion}
                  onChange={(e) => setMockQuestion(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Answer (Explain your thought process, complexity, edge cases, or STAR story)
                </label>
                <textarea
                  rows={8}
                  value={mockAnswer}
                  onChange={(e) => setMockAnswer(e.target.value)}
                  placeholder="e.g. To design a URL shortener, I would first calculate throughput: 100M URLs per day implies ~1,200 writes/sec. Using Base62 encoding on a 64-bit ID yields 62^7 combinations (~3.5 trillion URLs)..."
                  className="w-full p-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={handleRunMockInterview}
                disabled={evaluating || !mockAnswer.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI Interviewer Evaluating Rubric...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evaluate My Answer & Score</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: AI Interviewer Rubric & Feedback (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[420px] flex flex-col justify-between">
              <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Interviewer Assessment & Rubric
                </span>
                <span className="text-[11px] text-neutral-400">Standard FAANG / Tier-1 Criteria</span>
              </div>

              <div className="flex-1 py-4">
                {evaluating ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                    <RefreshCw className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
                    <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Analyzing technical precision & clarity...
                    </div>
                    <p className="text-[11px] text-neutral-400 max-w-xs">
                      Evaluating edge cases, trade-offs, and communication conciseness
                    </p>
                  </div>
                ) : evaluationFeedback ? (
                  <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                    {evaluationFeedback}
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-2 text-xs text-neutral-400">
                    <Briefcase className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
                    <p>Draft your response on the left and submit to receive instant AI scoring and critique.</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Tip: Structure answers starting with the broad intuition before diving into code or math details.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
