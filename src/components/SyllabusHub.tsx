import React, { useState } from 'react';
import { SUBJECTS_DATABASE } from '../data';
import { SubjectData, UserProgress, QuizQuestion, ImportantTopic } from '../types';
import { 
  BookOpen, CheckSquare, Square, ChevronDown, ChevronUp, AlertCircle, 
  PlayCircle, RefreshCw, Award, ArrowRight, BookMarked, Layers, Sparkles 
} from 'lucide-react';

interface SyllabusHubProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

type MainSubTab = 'summaries' | 'topics' | 'quizzes';

export default function SyllabusHub({ userProgress, onUpdateProgress }: SyllabusHubProps) {
  // Current active subject selection
  const [activeSubjectId, setActiveSubjectId] = useState<string>(SUBJECTS_DATABASE[0].id);
  const activeSubject = SUBJECTS_DATABASE.find(s => s.id === activeSubjectId) || SUBJECTS_DATABASE[0];

  // Active secondary tab selection (summaries, topics, quizzes)
  const [activeSubTab, setActiveSubTab] = useState<MainSubTab>('summaries');

  // Interactive expander states
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // Active quiz states
  const [quizInSession, setQuizInSession] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  // Toggle unit mastery
  const toggleUnitMastery = (unitKey: string) => {
    const ids = [...userProgress.completedTopicIds];
    const index = ids.indexOf(unitKey);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(unitKey);
    }
    onUpdateProgress({
      ...userProgress,
      completedTopicIds: ids
    });
  };

  // Toggle exam topic mastery
  const toggleTopicMastery = (topicId: string) => {
    const ids = [...userProgress.completedTopicIds];
    const index = ids.indexOf(topicId);
    if (index > -1) {
      ids.splice(index, 1);
    } else {
      ids.push(topicId);
    }
    onUpdateProgress({
      ...userProgress,
      completedTopicIds: ids
    });
  };

  // Launch Quiz for active subject
  const startQuiz = () => {
    setQuizInSession(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setCorrectAnswersCount(0);
  };

  // Handle active option clicks in interactive quiz
  const selectOption = (index: number) => {
    if (answerSubmitted) return;
    setSelectedOption(index);
  };

  // Submit Answer to quiz question
  const submitAnswer = (correctIndex: number) => {
    if (selectedOption === null || answerSubmitted) return;
    
    setAnswerSubmitted(true);
    if (selectedOption === correctIndex) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  // Advance to next question or complete quiz
  const nextQuestion = (totalQuestions: number) => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
    } else {
      // Quiz finished - save high score to user progress
      const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
      const prevHighScore = userProgress.completedQuizIds[activeSubjectId] || 0;
      
      const updatedQuizScores = {
        ...userProgress.completedQuizIds,
        [activeSubjectId]: Math.max(prevHighScore, finalScore)
      };

      onUpdateProgress({
        ...userProgress,
        completedQuizIds: updatedQuizScores
      });
      setQuizInSession(false);
    }
  };

  return (
    <div id="syllabus-hub-panel" className="space-y-6">
      
      {/* 🚀 Subject Selection Tabs */}
      <div id="subject-tabs-container" className="bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-xl p-2 flex flex-wrap gap-1.5 md:flex-nowrap overflow-x-auto">
        {SUBJECTS_DATABASE.map((subj) => {
          const isActive = subj.id === activeSubjectId;
          return (
            <button
              key={subj.id}
              id={`tab-select-subject-${subj.id}`}
              onClick={() => {
                setActiveSubjectId(subj.id);
                setQuizInSession(false);
                setExpandedTopicId(null);
                setExpandedUnit(1);
              }}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl text-left transition-all duration-300 border ${
                isActive 
                  ? 'bg-white/10 border-white/10 text-white font-semibold shadow-inner' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] uppercase tracking-wider font-mono opacity-80 leading-tight">
                  {subj.code}
                </span>
                {isActive && <span className="w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
              </div>
              <div className="text-sm font-sans truncate leading-normal">
                {subj.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* 🎒 Active Subject Overview Card */}
      <div id="subject-overview-card" className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 mb-1 font-bold tracking-wider">
              ACTIVE STUDY MODULE • {activeSubject.code}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
              {activeSubject.name}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed max-w-3xl">
              {activeSubject.description}
            </p>
          </div>
          <div className="bg-slate-950/80 px-4 py-2 border border-white/5 rounded-lg text-right">
            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Semester Range</span>
            <span className="text-xs md:text-sm font-sans font-semibold text-cyan-400 font-mono">{activeSubject.semester}</span>
          </div>
        </div>

        {/* Inner Sub-navigation Controls for Module Tabs */}
        <div id="syllabus-sub-navigation" className="flex items-center gap-2 border-t border-white/5 mt-6 pt-4">
          {[
            { id: 'summaries', label: 'Unit Digests', count: activeSubject.summaries.length, icon: Layers },
            { id: 'topics', label: 'Exam High-Yields', count: activeSubject.topics.length, icon: BookMarked },
            { id: 'quizzes', label: 'Practice Quiz', count: activeSubject.quizQuestions.length, icon: Award }
          ].map((tab) => {
            const isSubActive = activeSubTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`btn-tab-mode-${tab.id}`}
                onClick={() => {
                  setActiveSubTab(tab.id as MainSubTab);
                  setQuizInSession(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-sans font-semibold rounded-xl transition-all border cursor-pointer ${
                  isSubActive
                    ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSubActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-950 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📘 TAB 1: UNIT DIGESTS SUMMARY & JARGON EXPLORER */}
      {activeSubTab === 'summaries' && (
        <div id="unit-summaries-container" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-400 rounded-full block" />
              Comprehensive Unit Summaries (Syllabus Outlines)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Click any unit to expand details</span>
          </div>

          <div className="grid md:grid-cols-1 gap-3">
            {activeSubject.summaries.map((unit) => {
              const unitKey = `${activeSubjectId}-unit-${unit.unitNumber}`;
              const isMastered = userProgress.completedTopicIds.includes(unitKey);
              const isOpen = expandedUnit === unit.unitNumber;

              return (
                <div 
                  key={unit.unitNumber}
                  id={`unit-accordion-card-${unit.unitNumber}`}
                  className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-white/10 bg-white/[0.04]' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <div 
                    onClick={() => setExpandedUnit(isOpen ? null : unit.unitNumber)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-white/[0.01]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 text-cyan-400">
                        UNIT 0{unit.unitNumber}
                      </span>
                      <span className="font-sans font-bold text-slate-200 text-sm md:text-base">
                        {unit.unitTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      {/* Mastery Checkbox */}
                      <button 
                        id={`btn-toggle-unit-${unit.unitNumber}-mastery`}
                        onClick={() => toggleUnitMastery(unitKey)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isMastered                             ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                        title={isMastered ? "Completed" : "Mark Completed"}
                      >
                        {isMastered ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>

                      <button 
                        onClick={() => setExpandedUnit(isOpen ? null : unit.unitNumber)}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-300"
                      >
                        {isOpen ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Expansion Block */}
                  {isOpen && (
                    <div className="border-t border-white/5 bg-slate-950/40 p-5 md:p-6 space-y-4 font-sans text-sm">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest font-bold block">Conceptual Summary Digest</span>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/40 border border-white/5 p-4 rounded-xl">
                          {unit.summaryText}
                        </p>
                      </div>

                      {/* Technical High-Yield Key Jargon Grid */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest font-bold block flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Key Vocabulary Terminology
                        </span>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {unit.keyTerms.map((term, tIdx) => (
                            <div key={tIdx} className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                              <strong className="text-cyan-400 font-mono text-xs">{term.term}</strong>
                              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                {term.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🧠 TAB 2: EXAM HIGH-YIELD TOPICS EXPLORER */}
      {activeSubTab === 'topics' && (
        <div id="exam-topics-container" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-sans font-semibold text-slate-300 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              Critical Topic Deep-Dives
            </h3>
            <span className="text-xs text-slate-500 font-mono">Unlock to review key exam pointers</span>
          </div>

          <div className="space-y-3">
            {activeSubject.topics.map((topic) => {
              const isMastered = userProgress.completedTopicIds.includes(topic.id);
              const isOpen = expandedTopicId === topic.id;

              return (
                <div 
                  key={topic.id}
                  id={`topic-deepdive-card-${topic.id}`}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    isOpen ? 'border-cyan-500/30 bg-white/[0.04] shadow-[0_0_20px_rgba(6,182,212,0.08)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                        topic.importance === 'Critical' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : topic.importance === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {topic.importance}
                      </span>
                      <span className="font-sans font-bold text-slate-200 text-sm md:text-base">
                        {topic.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Mark Completed */}
                      <button 
                        id={`btn-toggle-topic-${topic.id}-mastery`}
                        onClick={() => toggleTopicMastery(topic.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isMastered 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-bold' 
                            : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                        title={isMastered ? "Topic Mastered" : "Mark as Mastered"}
                      >
                        {isMastered ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>

                      <button 
                        id={`btn-expand-topic-${topic.id}`}
                        onClick={() => setExpandedTopicId(isOpen ? null : topic.id)}
                        className="px-3 py-1.5 font-sans font-bold text-xs bg-slate-950 text-slate-400 hover:bg-white/[0.02] hover:text-white rounded-lg border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isOpen ? "Close Deep Dive" : "Review Topic"}
                        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-white/5 bg-slate-950/80 p-5 md:p-6 grid md:grid-cols-12 gap-6">
                      
                      {/* Conceptual Overview Column */}
                      <div className="md:col-span-5 space-y-3.5">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-bold">The Core Concept</span>
                          <strong className="text-slate-100 text-sm leading-snug block">{topic.concept}</strong>
                        </div>
                        <div className="bg-slate-900 border border-white/5 rounded-xl p-4 text-xs font-sans leading-relaxed text-slate-300">
                          {topic.explanation}
                        </div>
                      </div>

                      {/* Technical Study Bullet Points Column */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Key Exam Pointers & Marking Notes</span>
                          <div className="space-y-2">
                            {topic.keyPoints.map((point, ptIdx) => (
                              <div key={ptIdx} className="bg-slate-905 bg-slate-900/40 border border-white/5 p-3 rounded-lg flex items-start gap-2.5">
                                <span className="p-1 bg-cyan-500/10 text-cyan-400 rounded text-xs font-mono font-bold leading-none mt-0.5 border border-cyan-500/20">
                                  0{ptIdx + 1}
                                </span>
                                <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🏆 TAB 3: SELF-ASSESSMENT PRACTICE QUIZ CONTAINER */}
      {activeSubTab === 'quizzes' && (
        <div id="quiz-arena-panel" className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          {!quizInSession ? (
            <div id="quiz-welcome-screen" className="text-center py-8 max-w-lg mx-auto space-y-4">
              <div className="inline-flex p-4 bg-cyan-500/10 rounded-full text-cyan-400 mb-2">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-sans tracking-tight">
                {activeSubject.name} Evaluation Quiz
              </h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                Take an interactive self-assessment quiz covering critical areas of this module. There are{' '}
                <strong>{activeSubject.quizQuestions.length} multiple-choice question sets</strong> mapped with clear, deep-dive solutions.
              </p>

              {/* High Score History Indicator */}
              {userProgress.completedQuizIds[activeSubjectId] !== undefined && (
                <div id="quiz-highscore-badge" className="inline-block px-4 py-2 bg-slate-950/60 border border-white/5 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Personal High Score</span>
                  <span className={`text-base font-bold font-mono ${
                    userProgress.completedQuizIds[activeSubjectId] >= 80 
                      ? 'text-emerald-400' 
                      : userProgress.completedQuizIds[activeSubjectId] >= 50 
                      ? 'text-cyan-400' 
                      : 'text-rose-455'
                  }`}>
                    {userProgress.completedQuizIds[activeSubjectId]}% Accuracy
                  </span>
                </div>
              )}

              <div className="pt-2">
                <button
                  id="btn-trigger-start-quiz"
                  onClick={startQuiz}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-955 text-slate-950 font-sans font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 mx-auto cursor-pointer font-sans"
                >
                  <PlayCircle className="w-5 h-5" />
                  Begin Evaluation
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE INTERACTIVE MCQ SYSTEM */
            <div id="quiz-active-pane" className="space-y-6">
              {/* Quiz HUD Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Evaluation Mode</span>
                  <span className="h-1.5 w-1.5 bg-rose-500 animate-pulse rounded-full" />
                </div>
                <div className="text-xs text-slate-400 font-sans">
                  Subject Score State: <strong className="text-white">{correctAnswersCount}</strong> / {activeSubject.quizQuestions.length} Correct
                </div>
              </div>

              {/* Progress Bar indicator */}
              <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  style={{ width: `${((currentQuestionIndex) / activeSubject.quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* The Active Question */}
              {(() => {
                const question: QuizQuestion = activeSubject.quizQuestions[currentQuestionIndex];
                return (
                  <div key={question.id} className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">
                        Question Set {currentQuestionIndex + 1} of {activeSubject.quizQuestions.length}
                      </span>
                      <h4 className="text-base md:text-lg font-bold text-white font-sans leading-snug">
                        {question.question}
                      </h4>
                    </div>

                    {/* Options Grid */}
                    <div className="grid md:grid-cols-2 gap-3" id="quiz-options-grid">
                      {question.options.map((option, opIdx) => {
                        const isSelected = selectedOption === opIdx;
                        let optionStyle = 'bg-slate-955/40 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer';
                        
                        if (answerSubmitted) {
                          if (opIdx === question.correctIndex) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.05)]';
                          } else if (isSelected) {
                            optionStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold';
                          } else {
                            optionStyle = 'bg-slate-950/20 border-white/5 text-slate-600 pointer-events-none';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400 ring-1 ring-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.1)]';
                        }

                        return (
                          <button
                            key={opIdx}
                            id={`option-selector-${opIdx}`}
                            disabled={answerSubmitted}
                            onClick={() => selectOption(opIdx)}
                            className={`p-4 rounded-xl border text-left text-xs md:text-sm transition-all flex items-start gap-3.5 outline-none ${optionStyle}`}
                          >
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 font-bold ${
                              isSelected 
                                ? 'bg-cyan-500 text-slate-950' 
                                : 'bg-white/5 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + opIdx)}
                            </span>
                            <span className="leading-snug font-medium font-sans">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Action buttons bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-6">
                      <button
                        id="btn-abort-quiz"
                        onClick={() => setQuizInSession(false)}
                        className="px-4 py-2 font-sans text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-505/10 rounded-lg border border-white/5 cursor-pointer font-bold"
                      >
                        Cancel Practice
                      </button>

                      {!answerSubmitted ? (
                        <button
                          id="btn-quiz-submit-action"
                          onClick={() => submitAnswer(question.correctIndex)}
                          disabled={selectedOption === null}
                          className="px-6 py-2.5 bg-cyan-500 disabled:bg-slate-950/40 disabled:text-slate-650 disabled:text-slate-600 hover:bg-cyan-600 text-slate-950 font-sans font-bold text-xs md:text-sm rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          id="btn-quiz-advance-action"
                          onClick={() => nextQuestion(activeSubject.quizQuestions.length)}
                          className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-sans font-bold text-xs md:text-sm rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          {currentQuestionIndex + 1 === activeSubject.quizQuestions.length ? "Finish Evaluation" : "Next Question"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Solutions Explanation Block revealed on submission */}
                    {answerSubmitted && (
                      <div 
                        id="quiz-solution-card"
                        className={`p-4 rounded-xl border font-sans text-xs md:text-sm space-y-2 leading-relaxed animate-fade-in ${
                          selectedOption === question.correctIndex
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/5 border-rose-500/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold font-sans">
                          <AlertCircle className="w-4 h-4 text-emerald-400" />
                          <span>Concept Deep-Dive & Solution Breakdown</span>
                        </div>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed p-1 font-mono">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
