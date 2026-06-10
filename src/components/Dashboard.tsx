import React, { useState } from 'react';
import { SUBJECTS_DATABASE } from '../data';
import { UserProgress } from '../types';
import { 
  BookOpen, BrainCircuit, Award, CheckSquare, Sparkles, BookMarked, 
  Layers, MessageSquare, Terminal, HelpCircle, ArrowRight, Star
} from 'lucide-react';

interface DashboardProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onNavigateToView: (view: 'syllabus' | 'viva' | 'notes' | 'planner') => void;
}

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timeStr: string;
}

export default function Dashboard({ userProgress, onUpdateProgress, onNavigateToView }: DashboardProps) {
  
  // Rule-based offline chatbot conversational states
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Welcome back! I am SyllabusBot, your offline B.Tech Engineering Coach. Ask me about ACID, Normalization levels, CPU cycles, or planning frameworks using the chips below!",
      timeStr: 'System Init'
    }
  ]);

  // Handle pre-recorded student prompts offline
  const handleTriggerChatPrompt = (prompt: string, answer: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = [
      ...chatMessages,
      { sender: 'user', text: prompt, timeStr },
      { sender: 'bot', text: answer, timeStr }
    ];

    setChatMessages(updated);
  };

  // Compute Core Metrics
  const totalSubjectsCount = SUBJECTS_DATABASE.length;
  
  const reviewedUnitsCount = userProgress.completedTopicIds.filter(id => id.includes('-unit-')).length;
  // There are exactly 25 units in total (5 subjects * 5 units)
  const totalUnitsSyllabus = 25;
  const unitsRatio = `${reviewedUnitsCount}/${totalUnitsSyllabus}`;

  const masteredTopicsCount = userProgress.completedTopicIds.filter(id => id.includes('-t')).length;
  // There are exactly 15 key topics in data database (5 subjects * 3 topics)
  const totalTopicsSyllabus = 15;
  const topicsRatio = `${masteredTopicsCount}/${totalTopicsSyllabus}`;

  const masteredVivasCount = userProgress.masteredVivaIds.length;
  // There are exactly 15 viva cards in total (5 subjects * 3 questions)
  const totalVivasSyllabus = 15;
  const vivasRatio = `${masteredVivasCount}/${totalVivasSyllabus}`;

  // Average quiz scores
  const scoreValues = Object.values(userProgress.completedQuizIds);
  const averageQuizAccuracy = scoreValues.length > 0 
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) 
    : 0;

  // Curated, premium mock chatbots prompts & responses
  const CHAT_PROMPTS = [
    {
      query: 'What is ACID?',
      answer: 'ACID guarantees database transaction safety:\n- Atomicity (WAL logs revert failures: "All or nothing")\n- Consistency (Moves only between valid schema states)\n- Isolation (Concurrency controls keep writes quarantined)\n- Durability (Effects survive hardware crashes)'
    },
    {
      query: 'Explain BCNF.',
      answer: 'Boyce-Codd Normal Form is a strict extension of 3rd Normal Form. In BCNF, we decompose database schemas so that for every functional dependency X -> Y, the determinant X MUST be a valid superkey of the table.'
    },
    {
      query: 'Explain CPU Starvation',
      answer: 'Starvation occurs when a processes waits indefinitely because other high-priority tasks monopolize CPU core cycles. Corrected by "Aging": gradually scaling up priority values of waiting tasks based on queue wait times.'
    },
    {
      query: 'What is Belady\'s Anomaly?',
      answer: 'Under FIFO page replacement, adding physical RAM frames can paradoxically increase overall page-fault counts for specific loop reference sequences. Modern LRU caching eliminates this anomaly completely.'
    },
    {
      query: 'How to prepare in 5 days?',
      answer: 'Switch to our "Revision Planner" page to generate daily task lists. General flow: Day 1-2 targets Unit 1-3 summaries & topic breakdowns. Day 3-4 focuses on viva voce rehearsals, concluding with quiz assessments.'
    }
  ];

  return (
    <div id="dashboard-hud-wrapper" className="space-y-6">
      
      {/* 🚀 STEP 1: KEY PERFORMANCE TELEMETRY GRIDS */}
      <div id="telemetry-grid-section" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Syllabus Progress */}
        <div id="stat-card-syllabus" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden hover:bg-white/[0.05] transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl" />
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-white/5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Unit Digests Read</span>
            <strong className="text-xl font-bold text-slate-200 mt-1 block font-mono">{unitsRatio}</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Review progress</span>
          </div>
        </div>

        {/* Metric 2: Topic Masteries */}
        <div id="stat-card-topics" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden hover:bg-white/[0.05] transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-white/5">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Topics Mastered</span>
            <strong className="text-xl font-bold text-slate-200 mt-1 block font-mono">{topicsRatio}</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">High-yield concepts</span>
          </div>
        </div>

        {/* Metric 3: Oral Viva Mastery */}
        <div id="stat-card-viva" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden hover:bg-white/[0.05] transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl" />
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-white/5">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Oral Viva Cards</span>
            <strong className="text-xl font-bold text-slate-200 mt-1 block font-mono">{vivasRatio}</strong>
            <span className="text-[11px] text-slate-400 font-sans mt-0.5 block">Recalls mastered</span>
          </div>
        </div>

        {/* Metric 4: Average Quiz Score */}
        <div id="stat-card-quiz" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 relative overflow-hidden hover:bg-white/[0.05] transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl" />
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-white/5">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Avg Quiz Score</span>
            <strong className="text-xl font-bold text-slate-200 mt-1 block font-mono">{averageQuizAccuracy}%</strong>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              {scoreValues.length} Quiz{scoreValues.length !== 1 ? 'zes' : ''} assessed
            </span>
          </div>
        </div>

      </div>

      <div id="dashboard-mid-split" className="grid lg:grid-cols-12 gap-6">
        
        {/* 📘 STEP 2: SUBJECTS OVERVIEW HUB (COL-7) */}
        <div id="dashboard-subjects-pane" className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-500 rounded-full block shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              Syllabus Curriculum Units
            </h3>
            <button 
              id="dashboard-go-syllabus-trigger"
              onClick={() => onNavigateToView('syllabus')}
              className="text-cyan-400 hover:text-cyan-300 font-sans text-xs flex items-center gap-1 font-semibold transition-colors"
            >
              Browse Library
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid gap-3" id="dashboard-subjects-grid">
            {SUBJECTS_DATABASE.map((subj) => {
              // Calculate specific subject completion metrics
              const unitsReviewedForThisSubj = subj.summaries.filter(summary => 
                userProgress.completedTopicIds.includes(`${subj.id}-unit-${summary.unitNumber}`)
              ).length;
              
              const topicsMasteredForThisSubj = subj.topics.filter(topic => 
                userProgress.completedTopicIds.includes(topic.id)
              ).length;

              const totalPossibleTasks = subj.summaries.length + subj.topics.length;
              const completedTasksCount = unitsReviewedForThisSubj + topicsMasteredForThisSubj;
              const subjProgressPercent = totalPossibleTasks > 0 ? Math.round((completedTasksCount / totalPossibleTasks) * 100) : 0;

              return (
                <div 
                  key={subj.id}
                  id={`dashboard-subj-row-card-${subj.id}`}
                  className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                        {subj.code}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{subj.semester}</span>
                    </div>

                    <h4 className="font-sans font-bold text-slate-200 group-hover:text-white transition-colors text-sm truncate">
                      {subj.name}
                    </h4>
                  </div>

                  {/* Progressive bar indicator */}
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">SUBJECT PROGRESS</span>
                      <span className="text-xs font-semibold text-slate-300 font-sans">{subjProgressPercent}% Mastery</span>
                    </div>
                    
                    <button
                      id={`dashboard-navigation-go-${subj.id}`}
                      onClick={() => onNavigateToView('syllabus')}
                      className="p-1.5 bg-slate-950 border border-white/5 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] rounded-lg transition-all"
                    >
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💬 STEP 3: VIRTUAL OFFLINE ASSISTANT SYSTEM (COL-5) */}
        <div id="dashboard-coach-pane" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-2 flex-1">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full block shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              SyllabusBot Offline Assistant
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 leading-none shrink-0">⚡ RULE ENGINE</span>
          </div>

          <div id="coach-interface" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4 flex flex-col justify-between min-h-[300px]">
            
            {/* Embedded Screen Terminal Terminal Display */}
            <div className="bg-slate-950 rounded-xl p-3 h-[180px] overflow-y-auto space-y-2 border border-white/5 font-mono text-xs text-slate-300 max-h-[180px]">
              {chatMessages.map((msg, mIdx) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={mIdx} className={`space-y-1 ${isBot ? 'text-cyan-400/90' : 'text-slate-300'}`}>
                    <div className="flex items-center justify-between opacity-50 text-[9px]">
                      <span>{isBot ? '[SYS.COACH]' : '[STUDENT_USER]'}</span>
                      <span>{msg.timeStr}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed font-mono">
                      {isBot ? `>>> ${msg.text}` : msg.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Trigger Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Inquire Technical Formulas & Definitions:</span>
              <div className="flex flex-wrap gap-1.5">
                {CHAT_PROMPTS.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    id={`btn-trigger-chat-prompt-${pIdx}`}
                    onClick={() => handleTriggerChatPrompt(prompt.query, prompt.answer)}
                    className="px-2.5 py-1 text-[10px] font-mono bg-slate-950 hover:bg-slate-900 border border-white/10 text-cyan-400 rounded-lg transition-all cursor-pointer hover:border-cyan-500/30"
                  >
                    {prompt.query}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
