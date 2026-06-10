import React, { useState } from 'react';
import { SUBJECTS_DATABASE } from '../data';
import { UserProgress, VivaQuestion } from '../types';
import { 
  Volume2, VolumeX, HelpCircle, CheckSquare, RefreshCw, Bookmark, 
  ChevronLeft, ChevronRight, Award, Zap, Award as AwardIcon, Headphones 
} from 'lucide-react';

interface VivaArenaProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export default function VivaArena({ userProgress, onUpdateProgress }: VivaArenaProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<string>(SUBJECTS_DATABASE[0].id);
  const activeSubject = SUBJECTS_DATABASE.find(s => s.id === activeSubjectId) || SUBJECTS_DATABASE[0];

  // Selected viva question index
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Text to Speech states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeVivaList = activeSubject.vivaQuestions;
  const currentViva: VivaQuestion | undefined = activeVivaList[currentCardIndex];

  // Handle TTS speaker triggering
  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Offline Speech Synthesis is not supported in this browser environment. Open in a new tab if iframe constraints restrict audio.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Standard English accent voice
    utterance.rate = 0.95; // slightly slower for professional dictation
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle card mastery status
  const toggleVivaMastery = (vivaId: string) => {
    const list = [...userProgress.masteredVivaIds];
    const idx = list.indexOf(vivaId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(vivaId);
    }
    
    onUpdateProgress({
      ...userProgress,
      masteredVivaIds: list
    });
  };

  const currentSubjectMasteredCount = activeVivaList.filter(v => 
    userProgress.masteredVivaIds.includes(v.id)
  ).length;

  const handleNextCard = () => {
    if (currentCardIndex + 1 < activeVivaList.length) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    }
  };

  return (
    <div id="viva-arena-panel" className="grid md:grid-cols-12 gap-6">
      
      {/* 🔮 Left Column - Subject Selectors & Exam Tips */}
      <div className="md:col-span-4 space-y-6">
        
        {/* Course Target Selector */}
        <div id="viva-subject-menu" className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-3.5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">Oral Assessment Target</span>
            <h3 className="font-sans font-bold text-white text-sm md:text-base">Focus Subject Lab</h3>
          </div>

          <div className="space-y-2">
            {SUBJECTS_DATABASE.map((subj) => {
              const isSelected = subj.id === activeSubjectId;
              const unitCount = subj.vivaQuestions.length;
              const masteredForThisSubj = subj.vivaQuestions.filter(v => 
                userProgress.masteredVivaIds.includes(v.id)
              ).length;

              return (
                <button
                  key={subj.id}
                  id={`viva-subj-btn-${subj.id}`}
                  onClick={() => {
                    setActiveSubjectId(subj.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-bold' 
                      : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono leading-none tracking-wider mb-1 uppercase opacity-80">
                      {subj.code}
                    </span>
                    <span className="text-xs md:text-sm font-sans truncate pr-2">
                      {subj.name}
                    </span>
                  </div>

                  {/* Progress Indicator */}
                  <span className={`text-[10px] font-mono px-2 py-1 rounded-md shrink-0 ${
                    isSelected ? 'bg-slate-950 text-cyan-300 border border-cyan-500/20' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {masteredForThisSubj}/{unitCount} Card{unitCount > 1 ? 's' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Viva Voce Best Practices & Rubrics Card */}
        <div id="viva-rubrics-card" className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full block" />
            <h4 id="viva-rubrics-title" className="font-sans font-bold text-white text-xs md:text-sm uppercase tracking-wide">
              Lab Evaluation Rubrics
            </h4>
          </div>

          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-start gap-2.5">
              <span className="min-w-4 max-w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center font-mono text-[9px] text-cyan-400 font-bold mt-0.5">1</span>
              <div>
                <strong className="text-slate-300 block">Structural Clarity (40%)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">Avoid loose talking. Anchor answers with fundamental layers, schemas, or protocols (e.g., naming ACID or OSI layers).</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="min-w-4 max-w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center font-mono text-[9px] text-cyan-400 font-bold mt-0.5">2</span>
              <div>
                <strong className="text-slate-300 block">Confidence & Synopses (30%)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">Present clearly. If you do not recall the formula, state the conceptual inputs (e.g., KLOC in COCOMO).</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="min-w-4 max-w-4 h-4 rounded-full bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center font-mono text-[9px] text-cyan-400 font-bold mt-0.5">3</span>
              <div>
                <strong className="text-slate-300 block">Interactive Micro-Recalls (30%)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">Keep descriptions bullet-dense. Highlight trade-offs (e.g. FCFS Convoy Effect vs Round Robin quanta overhead).</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 🧠 Right Column - Fully Animating Flashcard Arena Panel */}
      <div className="md:col-span-8 flex flex-col justify-between space-y-4 min-h-[460px]">
        {currentViva ? (
          <div className="flex-1 flex flex-col justify-between space-y-4">
            
            {/* Flashcard Stats & Examiner Controls HUD */}
            <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 px-5 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Interactive Flashcard</span>
                <span className="font-mono text-xs font-bold text-cyan-400">0{currentCardIndex + 1} of 0{activeVivaList.length}</span>
              </div>

              {/* Offline TTS Examiner Voice Selector Button */}
              <button
                id="btn-voice-examiner"
                onClick={() => speakQuestion(currentViva.question)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-sans font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSpeaking 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                    : 'bg-slate-950/60 border-white/5 text-slate-405 text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
                title="Trigger local sound dictation"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isSpeaking ? "Mute Examiner" : "Read Aloud (Voice)"}</span>
              </button>
            </div>

            {/* THREE-DIMENSIONAL FLASHCARD CONTAINER COMPONENT */}
            <div 
              id="viva-perspective-card"
              className="group relative cursor-pointer select-none min-h-[300px] w-full"
              style={{ perspective: '1000px' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Inner container supporting CSS rotates */}
              <div 
                className="relative h-full w-full rounded-2xl transition-transform duration-500 ease-out"
                style={{ 
                  transformStyle: 'preserve-3d', 
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                  minHeight: '300px'
                }}
              >
                
                {/* FRONT SIDE CARD */}
                <div 
                  className="absolute inset-0 bg-white/[0.04] border-2 border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(255,255,255,0.01)]"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                        Oral Question
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">{currentViva.category}</span>
                    </div>

                    <h3 className="font-sans font-extrabold text-white text-base md:text-xl leading-relaxed">
                      "{currentViva.question}"
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 leading-none">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>{currentViva.hint}</span>
                    </div>
                    <span className="text-xs font-sans text-cyan-400 font-bold group-hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
                      Click to Flip
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                    </span>
                  </div>
                </div>

                {/* BACK SIDE CARD */}
                <div 
                  className="absolute inset-0 bg-slate-950/90 border-2 border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)',
                    minHeight: '300px'
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase font-bold tracking-wider">
                        Expected Answer Rubric
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Self Mastery Check</span>
                    </div>

                    <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed p-1 border-l-2 border-emerald-500/40 pl-4 font-mono">
                      {currentViva.answer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-slate-500 text-xs font-sans">Flip again to see question</span>
                    <span className="text-xs font-sans text-emerald-400 font-bold group-hover:text-emerald-300 flex items-center gap-1.5">
                      Reverse Flip
                      <RefreshCw className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Flashcard Mastery Feedback panel */}
            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Did you answer correctly?</span>
                <span className="text-xs font-semibold text-slate-300">Grade your recall to update subject mastery stats.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-viva-grade-work"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userProgress.masteredVivaIds.includes(currentViva.id)) {
                      toggleVivaMastery(currentViva.id);
                    }
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    !userProgress.masteredVivaIds.includes(currentViva.id)
                      ? 'bg-slate-950/40 border-white/5 text-slate-600 pointer-events-none opacity-40'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                  }`}
                >
                  Needs Practice
                </button>

                <button
                  id="btn-viva-grade-mastered"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!userProgress.masteredVivaIds.includes(currentViva.id)) {
                      toggleVivaMastery(currentViva.id);
                    }
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    userProgress.masteredVivaIds.includes(currentViva.id)
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-950/60 border-white/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30'
                  }`}
                >
                  {userProgress.masteredVivaIds.includes(currentViva.id) ? "✓ Mastered" : "Satisfied (Mastered)"}
                </button>
              </div>
            </div>

            {/* Flashcard Footer Navigation Controllers */}
            <div className="flex items-center justify-between">
              <button
                id="btn-viva-navigation-prev"
                disabled={currentCardIndex === 0}
                onClick={handlePrevCard}
                className="px-4 py-2 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              <button
                id="btn-viva-navigation-next"
                disabled={currentCardIndex + 1 === activeVivaList.length}
                onClick={handleNextCard}
                className="px-4 py-2 bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-white/[0.03] border border-white/10 rounded-2xl">
            <p className="text-slate-400 text-sm font-sans">No viva questions found for this subject selection.</p>
          </div>
        )}
      </div>

    </div>
  );
}
