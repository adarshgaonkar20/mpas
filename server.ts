import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini SDK with server-side API Key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function callWithTimeout<T>(
  promise: Promise<T>,
  fallbackValue: T,
  timeoutMs = 12000
): Promise<{ data: T; isDemo: boolean }> {
  try {
    let timer: any;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('AI request timeout')), timeoutMs);
    });
    const data = await Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
    return { data, isDemo: false };
  } catch (err) {
    console.warn('Gemini API call timed out or failed, returning fallback:', err);
    return { data: fallbackValue, isDemo: true };
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Status & Capability Check
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'online',
      hasGeminiKey: Boolean(apiKey),
      model: 'gemini-3.8-flash',
      app: 'CampusMate AI',
      timestamp: new Date().toISOString(),
    });
  });

  // 1. AI Study Assistant Endpoint
  app.post('/api/ai/study-assistant', async (req, res) => {
    try {
      const { notes, mode = 'summarize', options = {} } = req.body;

      if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
        res.status(400).json({ error: 'Please provide notes or academic text to analyze.' });
        return;
      }

      const cleanNotes = notes.slice(0, 15000); // Guard rails
      const depth = options.depth || 'simple';
      const subject = options.subject || 'General Engineering';

      const fallback = getFallbackStudyAssistant(mode, cleanNotes, depth, subject);
      if (!ai) {
        res.json({ mode, isDemo: true, content: fallback });
        return;
      }

      let systemPrompt = `You are CampusMate AI Study Assistant, an expert university academic mentor for engineering students in ${subject}.`;
      let userPrompt = '';

      if (mode === 'summarize') {
        userPrompt = `Please synthesize the following study notes into a crisp, high-yield summary.
Structure your output as:
1. 💡 Core Concept (1-2 sentences)
2. 📌 Key Takeaways (4-6 bullet points with bold highlights)
3. 🔬 Critical Formulas / Definitions (if any)
4. ⚠️ Common Exam Pitfalls & Misconceptions

Notes:
${cleanNotes}`;
      } else if (mode === 'questions') {
        userPrompt = `Analyze these study notes and generate essential university exam questions:
Categorize into:
- 🎯 Part A (Short 2-mark definitions & conceptual questions - 4 questions with quick 1-line answers)
- 📝 Part B (Medium 5-mark descriptive / derivation questions - 3 questions with bulleted answer outlines)
- 🏆 Part C (Deep 10-mark comprehensive / problem-solving questions - 2 high-probability questions with key points)

Notes:
${cleanNotes}`;
      } else if (mode === 'mcq') {
        userPrompt = `Generate 5 high-quality multiple choice questions based on these notes to test student comprehension.
For each question, provide:
- The question stem
- 4 labeled options: A), B), C), D)
- The correct option
- A clear, educational explanation of why the correct option is right and common traps.
Format in clean, clear markdown.

Notes:
${cleanNotes}`;
      } else if (mode === 'flashcards') {
        userPrompt = `Convert the most critical terms, laws, theorems, algorithms, and formulas in these notes into 6-8 flashcards.
Format strictly as JSON array of objects with keys "front" (concise concept or question) and "back" (crisp definition, key equation, or mnemonic answer).
Output raw JSON only: [{"front": "...", "back": "..."}].

Notes:
${cleanNotes}`;
      } else if (mode === 'explain') {
        const isDetailed = depth === 'detailed';
        userPrompt = `Explain the core topic in these notes for a student who wants a ${
          isDetailed ? 'deep, rigorous technical breakdown' : 'simple, intuitive explanation with a relatable real-world analogy'
        }.
Use clear headings:
1. 🧠 The Big Picture (What problem does this solve?)
2. 🚗 Intuitive Analogy
3. ⚙️ Step-by-Step Mechanics (How it actually works)
4. 💻 Practical Engineering Example / Code / Math Formula
5. 🎓 University Exam Tip

Notes:
${cleanNotes}`;
      }

      const { data, isDemo } = await callWithTimeout(
        ai.models
          .generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .then((r) => r.text || fallback),
        fallback
      );

      res.json({
        mode,
        isDemo,
        content: data,
      });
    } catch (error: any) {
      console.error('Error in /api/ai/study-assistant:', error);
      res.status(500).json({
        error: error.message || 'Failed to process study notes. Please try again.',
      });
    }
  });

  // 2. AI Doubt Solver Endpoint
  app.post('/api/ai/doubt-solver', async (req, res) => {
    try {
      const { query, history = [], subject = 'Engineering' } = req.body;

      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Please ask a clear doubt or question.' });
        return;
      }

      const fallback = getFallbackDoubtSolution(query, subject);
      if (!ai) {
        res.json({
          isDemo: true,
          answer: fallback,
        });
        return;
      }

      const systemInstruction = `You are CampusMate AI Doubt Solver, an elite engineering professor and patient tutor specializing in ${subject}, Computer Science, Mathematics, Electronics, and Mechanical sciences.
Guidelines:
- Provide clear, step-by-step explanations.
- If mathematical or algorithmic steps exist, show each step clearly with formulas and time/space complexities.
- If code is relevant, provide clean, idiomatic snippets with concise line comments.
- Always be academically honest: if a formula or solution depends on specific assumptions, state them clearly. Never hallucinate fake facts.
- Include 2-3 quick follow-up prompt questions at the end under a "💡 Suggested Next Steps" section.`;

      // Build contents array from history
      const formattedContents: any[] = [];
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'model') {
          formattedContents.push({
            role: item.role,
            parts: [{ text: item.content }],
          });
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: query }],
      });

      const { data, isDemo } = await callWithTimeout(
        ai.models
          .generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .then((r) => r.text || fallback),
        fallback
      );

      res.json({
        isDemo,
        answer: data,
      });
    } catch (error: any) {
      console.error('Error in /api/ai/doubt-solver:', error);
      res.status(500).json({
        error: error.message || 'Error solving doubt. Please try again.',
      });
    }
  });

  // 3. AI Smart Study Planner
  app.post('/api/ai/study-planner', async (req, res) => {
    try {
      const { subjects = [], dailyHours = 3, targetDays = 14 } = req.body;

      if (!subjects || subjects.length === 0) {
        res.status(400).json({ error: 'Please add at least one subject to plan.' });
        return;
      }

      const fallback = getFallbackStudyPlan(subjects, dailyHours, targetDays);
      if (!ai) {
        res.json({
          isDemo: true,
          plan: fallback,
        });
        return;
      }

      const prompt = `Create a realistic, high-yield ${targetDays}-day study roadmap for an engineering student with ${dailyHours} hours of available study time per day.
Subjects & Details:
${JSON.stringify(subjects, null, 2)}

Requirements:
1. Divide the days strategically (Core concepts -> Problem solving -> Revision & Mock tests).
2. Balance hard topics with lighter revision slots.
3. Incorporate Pomodoro or active recall intervals.
4. Provide the schedule with day-by-day objectives and high-priority chapter milestones.`;

      const { data, isDemo } = await callWithTimeout(
        ai.models
          .generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction:
                'You are an expert academic advisor who crafts high-efficiency exam preparation roadmaps for university students.',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .then((r) => r.text || fallback),
        fallback
      );

      res.json({
        isDemo,
        plan: data,
      });
    } catch (error: any) {
      console.error('Error in /api/ai/study-planner:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate study plan.',
      });
    }
  });

  // 4. AI Resume Bullet Enhancer
  app.post('/api/ai/resume-enhancer', async (req, res) => {
    try {
      const { bulletText, role = 'Software Engineer' } = req.body;

      if (!bulletText || typeof bulletText !== 'string') {
        res.status(400).json({ error: 'Bullet text is required.' });
        return;
      }

      const fallbackSuggestions = [
        `Engineered a high-performance ${role} solution, cutting latency by 35% and improving throughput across 500+ daily requests.`,
        `Architected modular components utilizing modern design patterns, accelerating deployment cycles by 2.5x.`,
        `Optimized data ingestion pipeline, reducing memory overhead by 40% while ensuring 99.9% uptime.`,
      ];

      if (!ai) {
        res.json({
          isDemo: true,
          suggestions: fallbackSuggestions,
        });
        return;
      }

      const prompt = `Transform this student resume bullet point into 3 strong, ATS-optimized bullet points for a ${role} position.
Follow the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
Use strong action verbs (Architected, Engineered, Optimized, Streamlined).

Original bullet: "${bulletText}"

Provide exactly 3 alternatives:
1. High-Impact Technical Focus
2. Quantifiable Metric Focus
3. Leadership / Efficiency Focus`;

      const { data, isDemo } = await callWithTimeout(
        ai.models
          .generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction:
                'You are a senior tech recruiter and resume reviewer for top tech companies (FAANG/Tier-1 startups).',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .then((r) => r.text || fallbackSuggestions.join('\n')),
        fallbackSuggestions.join('\n')
      );

      res.json({
        isDemo,
        enhancedText: data,
      });
    } catch (error: any) {
      console.error('Error in /api/ai/resume-enhancer:', error);
      res.status(500).json({
        error: error.message || 'Failed to enhance resume bullet.',
      });
    }
  });

  // 5. AI Mock Interview Evaluator
  app.post('/api/ai/mock-interview', async (req, res) => {
    try {
      const { question, answer, type = 'technical', role = 'Software Engineer' } = req.body;

      if (!question || !answer) {
        res.status(400).json({ error: 'Question and answer are both required.' });
        return;
      }

      const fallbackFeedback = `### Evaluation Score: 8/10
**Key Strengths:**
- Addressed the primary architectural criteria directly with structured reasoning.
- Clear decomposition of problem requirements into manageable modules.

**Opportunities for Improvement:**
- Include precise asymptotic complexities (time vs space trade-offs).
- Detail edge-case handling such as network latency, hardware failure, or concurrent requests.

**Benchmark Model Answer:**
A stellar answer outlines the architectural trade-offs, states key invariants, calculates approximate resource scale, and discusses cache invalidation strategies.`;

      if (!ai) {
        res.json({
          isDemo: true,
          feedback: fallbackFeedback,
        });
        return;
      }

      const prompt = `Evaluate the student's answer to this ${type} interview question for a ${role} position:
Question: "${question}"
Candidate's Answer: "${answer}"

Provide an insightful, constructive critique:
1. Score out of 10
2. What was done well (2 bullet points)
3. What was missed or needs improvement (2 bullet points: e.g. edge cases, complexities, STAR clarity)
4. A model benchmark answer that would impress an interviewer.`;

      const { data, isDemo } = await callWithTimeout(
        ai.models
          .generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction:
                'You are a Principal Engineering Interviewer conducting campus recruitment assessments. Be direct, encouraging, and pedagogically precise.',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          })
          .then((r) => r.text || fallbackFeedback),
        fallbackFeedback
      );

      res.json({
        isDemo,
        feedback: data,
      });
    } catch (error: any) {
      console.error('Error in /api/ai/mock-interview:', error);
      res.status(500).json({
        error: error.message || 'Failed to evaluate interview answer.',
      });
    }
  });

  // In development, hook up Vite middleware
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CampusMate AI server running on http://0.0.0.0:${PORT} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

// Educational Fallbacks for offline / missing API key demonstration
function getFallbackStudyAssistant(mode: string, text: string, depth: string, subject: string): string {
  const preview = text.slice(0, 120).trim() + '...';
  if (mode === 'summarize') {
    return `### 💡 Core Concept
The provided material centers on fundamental principles of **${subject}**, highlighting structural trade-offs, state transitions, and operational invariants.

### 📌 Key Takeaways
- **System Architecture**: High cohesion and decoupled interfaces prevent cascading pipeline failure.
- **Complexity Guarantees**: Core search and insertion operations maintain strict bounds under average and worst-case loads.
- **Resource Management**: Pre-allocation and synchronization primitives prevent race conditions and priority inversion.
- **Verification Strategy**: Validation against edge cases (boundary limits, empty inputs, network partitions) is critical for exam scoring.

### 🔬 Essential Formula / Theorem
$$\\text{Throughput} = \\frac{N}{\\text{Execution Time} + \\text{Overhead}}$$
Ensure you clearly state initial system preconditions before applying derivation steps.

### ⚠️ Common Exam Pitfalls
- Confusing average-case with worst-case bounds.
- Omitting synchronization boundaries in concurrency questions.`;
  }

  if (mode === 'questions') {
    return `### 🎯 Part A (Short 2-Mark Questions)
1. **Define the fundamental criterion described in the notes.**
   *Answer*: It is the formal invariant ensuring process consistency across distributed state boundaries.
2. **State two key differences between synchronous and asynchronous dispatch.**
   *Answer*: Synchronous blocks caller thread execution; asynchronous relies on event loops and callback queues.
3. **What is the worst-case space complexity of the primary algorithm?**
   *Answer*: $\\mathcal{O}(V + E)$ auxiliary space for traversal queues and visited bitsets.

### 📝 Part B (Medium 5-Mark Questions)
1. **Derive the state transition diagram and explain how deadlocks are prevented.**
   *Key points*: Mutual exclusion, Hold & Wait, No Preemption, Circular Wait conditions.
2. **Compare and contrast the primary approaches mentioned in the syllabus.**
   *Key points*: Trade-offs in cache locality, memory footprint, and implementation overhead.

### 🏆 Part C (Comprehensive 10-Mark Questions)
1. **With an architectural schematic, illustrate the complete end-to-end execution flow and explain recovery mechanisms during network partitions.**`;
  }

  if (mode === 'mcq') {
    return `### Question 1
Which of the following conditions is **NOT** required for a deadlock to occur in a concurrent system?
- A) Mutual Exclusion
- B) Preemption
- C) Hold and Wait
- D) Circular Wait
**Correct Answer: B) Preemption**
*Explanation*: Deadlock requires *No Preemption*. If preemption is allowed, the operating system can reclaim resources, breaking the circular dependency.

---

### Question 2
In database transactions, what does the "I" in ACID stand for?
- A) Immutability
- B) Idempotency
- C) Isolation
- D) Integration
**Correct Answer: C) Isolation**
*Explanation*: Isolation guarantees that concurrent transactions execute without interfering with one another, as if serialized.

---

### Question 3
What is the tight worst-case time complexity of QuickSort when the pivot is chosen naively?
- A) $\\mathcal{O}(n \\log n)$
- B) $\\mathcal{O}(n)$
- C) $\\mathcal{O}(n^2)$
- D) $\\mathcal{O}(\\log n)$
**Correct Answer: C) $\\mathcal{O}(n^2)$**
*Explanation*: If the input is already sorted or reverse-sorted and the first/last element is picked as pivot, the partitioning is maximally unbalanced.`;
  }

  if (mode === 'flashcards') {
    return JSON.stringify([
      { front: "What are the 4 Coffman conditions for Deadlock?", back: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait" },
      { front: "What is the Time Complexity of Dijkstra's Algorithm with a Min-Heap?", back: "O((V + E) log V), where V is vertices and E is edges." },
      { front: "What does the CAP Theorem state?", back: "A distributed system can guarantee at most two out of: Consistency, Availability, and Partition Tolerance." },
      { front: "What is Amdahl's Law used for?", back: "To predict the theoretical maximum speedup in execution time of a task using multiple processors." },
      { front: "What is Normalization in DBMS?", back: "The process of organizing data to reduce redundancy and improve data integrity (1NF, 2NF, 3NF, BCNF)." }
    ]);
  }

  return `### 🧠 The Big Picture
Think of this concept like an airport air traffic control tower. When multiple airplanes (processes) request runways (resources), you need unambiguous scheduling protocols so that no plane gets stranded in mid-air waiting indefinitely for another plane to land.

### 🚗 Intuitive Analogy
Imagine four cars arriving simultaneously at a four-way crossroad, and each driver refuses to move until the driver to their right crosses. Everyone is waiting on everyone else—that's a circular wait!

### ⚙️ How It Works (Step-by-Step)
1. **Resource Request**: Process asks for unit authorization.
2. **Safety Check**: System runs a Banker's algorithm simulation to verify whether granting the request leaves the system in a safe state.
3. **Allocation or Suspension**: If safe, state is updated; otherwise, the process is queued.

### 🎓 University Exam Tip
When answering this question in mid-terms or finals, always draw the Resource Allocation Graph (RAG) with circles for processes and rectangles for resources.`;
}

function getFallbackDoubtSolution(query: string, subject: string): string {
  return `### Step-by-Step Solution & Explanation

**Doubt Analysis:**
You asked: *"${query}"* in **${subject}**.

#### 1. Core Principle & Governing Law
Every problem in this domain can be decomposed into:
- State definitions (given parameters and constraints).
- Transition invariant (how the system moves from step $k$ to step $k+1$).
- Boundary conditions (base cases and termination criteria).

#### 2. Systematic Derivation / Execution Steps
Let's analyze the mathematical and algorithmic progression:
1. **Identify the Given State**:
   Verify input constraints (dimensions, positivity, data types).
2. **Formulate the Recurrence or Equation**:
   $$T(n) = a \\cdot T\\left(\\frac{n}{b}\\right) + f(n)$$
   Using Master Theorem, compare $f(n)$ with $n^{\\log_b a}$.
3. **Evaluate Edge Cases**:
   - What happens when $n = 0$ or $n = 1$?
   - Does memory overflow if recursion depth exceeds call-stack limits?

#### 3. Verification & Common Traps
- **Trap**: Forgetting to account for 0-based vs 1-based indexing in array lookups.
- **Check**: Run a quick mental trace on a trivial example (e.g., $n = 3$).

---
💡 **Suggested Next Steps:**
- Would you like a runnable C++ / Python implementation?
- Should we work through a sample exam numerical problem step-by-step?
- Want to practice an interview-style variation of this concept?`;
}

function getFallbackStudyPlan(subjects: any[], dailyHours: number, targetDays: number): string {
  const subjectList = subjects.map((s: any) => s.name || s).join(', ');
  return `### 🎯 ${targetDays}-Day Strategic Engineering Study Plan
**Target Subjects:** ${subjectList}
**Daily Commitment:** ${dailyHours} Hours/Day (${dailyHours * targetDays} Total Study Hours)

#### Phase 1: High-Weightage Concept Foundation (Days 1–${Math.max(2, Math.floor(targetDays * 0.4))})
- **Focus**: Core theorems, architecture diagrams, and derivation mastery.
- **Daily Structure**:
  - *Hour 1*: Active recall of Unit 1 & 2 foundational formulas.
  - *Hour 2*: Working through university previous year questions (PYQs).
  - *Hour 3*: Self-quiz and error log documentation.

#### Phase 2: Numerical Mastery & Problem Sets (Days ${Math.floor(targetDays * 0.4) + 1}–${Math.floor(targetDays * 0.75)})
- **Focus**: Solve minimum 15 numericals per high-yield chapter.
- Implement spaced repetition: review Day 1 mistakes on Day 4.

#### Phase 3: Timed Mock Examinations & Rapid Revision (Final Days)
- Full-syllabus 3-hour timed practice paper under strict exam conditions.
- Flashcard review of high-frequency 2-mark definitions.`;
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
