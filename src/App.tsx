/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Award, BrainCircuit, CalendarRange, 
  Terminal, ShieldCheck, HeartPulse, User, Menu, X, Cpu, Layers 
} from 'lucide-react';

import { UserProgress } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SyllabusHub from './components/SyllabusHub';
import VivaArena from './components/VivaArena';
import SmartNotes from './components/SmartNotes';
import StudyPlanner from './components/StudyPlanner';

type ViewID = 'dashboard' | 'syllabus' | 'viva' | 'notes' | 'planner';

export default function App() {
  const [activeView, setActiveView] = useState<ViewID>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initialize offline progress from client storage safely.
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('smart_study_buddy_progress_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            completedQuizIds: parsed.completedQuizIds || {},
            masteredVivaIds: parsed.masteredVivaIds || [],
            completedTopicIds: parsed.completedTopicIds || [],
            customNotes: parsed.customNotes || [],
            studyPlanner: parsed.studyPlanner || null
          };
        }
      } catch (err) {
        console.warn('Failed to parse local stored progress, recovering default state.', err);
      }
    }
    return {
      completedQuizIds: {},
      masteredVivaIds: [],
      completedTopicIds: [],
      customNotes: [],
      studyPlanner: null
    };
  });

  // Client Storage Sync
  const handleUpdateProgress = (updated: UserProgress) => {
    setUserProgress(updated);
    localStorage.setItem('smart_study_buddy_progress_v1', JSON.stringify(updated));
  };

  // Compute overall progress metrics across 5 subjects * (5 units + 3 topics + 3 vivas) = 55 total items
  const reviewedUnitsCount = userProgress.completedTopicIds.filter(id => id.includes('-unit-')).length;
  const masteredTopicsCount = userProgress.completedTopicIds.filter(id => id.includes('-t')).length;
  const masteredVivasCount = userProgress.masteredVivaIds.length;
  
  const totalTasksSyllabus = 55; // 25 unit digests + 15 critical topics + 15 oral flashcards
  const totalCompleted = reviewedUnitsCount + masteredTopicsCount + masteredVivasCount;
  const overallMasteryPercent = Math.min(100, Math.round((totalCompleted / totalTasksSyllabus) * 100));

  // Sidebar navigation options configuration
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard Control', icon: LayoutDashboard, desc: 'Progress & Live Assistant' },
    { id: 'syllabus', label: 'Curriculum & Study', icon: BookOpen, desc: 'Summaries, Topics & Quizzes' },
    { id: 'viva', label: 'Oral Viva Arena', icon: BrainCircuit, desc: 'TTS Voice Dictation Cards' },
    { id: 'notes', label: 'Classroom NLP Notes', icon: Layers, desc: 'Auto-Summaries & Flashcards' },
    { id: 'planner', label: 'Revision Scheduler', icon: CalendarRange, desc: '5-Day Countdown Plan' }
  ];

  return (
    <div id="app-workspace-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* Immersive Atmospheric Ambient Blur Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] left-[20%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* 📱 MOBILE NAVIGATION BAR CONTROL */}
      <div id="mobile-navigation-bar" className="md:hidden flex items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-cyan-500 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center font-bold text-slate-950 text-sm">Σ</div>
          <span className="font-sans font-extrabold text-[#f1f5f9] tracking-tight text-sm">SmartStudy<span className="text-cyan-400">.eng</span></span>
        </div>
        <button 
          id="btn-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 bg-slate-950 border border-white/10 text-slate-300 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 💼 DESKTOP & MOBILE TRANSIT SIDEBAR WRAPPER */}
      <aside 
        id="app-sidebar-console" 
        className={`fixed md:sticky top-0 left-0 bottom-0 h-full md:h-screen w-72 bg-slate-900/40 backdrop-blur-lg border-r border-white/10 flex flex-col justify-between z-50 transform md:transform-none transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Sidebar Top Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center font-bold text-slate-950 text-base">Σ</div>
              <div>
                <strong className="text-lg font-bold tracking-tight text-white block leading-none">SmartStudy<span className="text-cyan-400">.eng</span></strong>
                <span className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest mt-1 block">B.Tech IT Academic Ed</span>
              </div>
            </div>

            {/* Mobile menu close trigger */}
            <button 
              id="sidebar-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 bg-slate-950 border border-white/10 text-slate-400 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Mini-Identity card */}
          <div id="avatar-identity-widget" className="bg-white/[0.03] border border-white/10 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-800 text-cyan-400 shrink-0 border border-white/5">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wide">STUDENT IDENTITY</span>
              <strong className="text-slate-200 text-xs truncate block font-sans">IT-2 Programme</strong>
              <span className="text-[10px] text-cyan-400/90 font-mono block leading-none mt-0.5">ID: ENG-4882-X</span>
            </div>
          </div>

          {/* Main Action Triggers Grid */}
          <nav id="sidebar-action-navigation" className="space-y-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2 px-1">Control Console</span>
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isSelected = item.id === activeView;
              return (
                <button
                  key={item.id}
                  id={`side-nav-[${item.id}]`}
                  onClick={() => {
                    setActiveView(item.id as ViewID);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    isSelected 
                      ? 'bg-white/10 border-white/10 text-white font-medium shadow-inner' 
                      : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="relative flex items-center justify-center mt-0.5">
                    <IconComp className={`w-4 h-4 mr-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {isSelected && (
                      <span className="absolute -left-2 w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold block">{item.label}</span>
                    <span className={`text-[10px] block leading-none mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Telemetry & Local Sandbox Card */}
        <div id="sidebar-telemetry-badge" className="p-5 border-t border-white/5 bg-slate-900/20">
          <div className="bg-slate-800/10 rounded-2xl p-4 border border-white/5 space-y-2">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold leading-none">Storage Mode</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 flex items-center gap-1.5 font-mono text-[10px]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                Offline Sync Active
              </span>
              <span className="text-slate-400 italic font-mono text-[10px]">v1.4.2</span>
            </div>
          </div>
        </div>

      </aside>

      {/* 🖥️ MAIN APPLICATION FRAME CONTENT (Fills remaining width) */}
      <main id="app-content-portal" className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto relative z-10">
        
        {/* Persistent Immersive System Header passing Mastery Progress percentage */}
        <Header totalProgressPercent={overallMasteryPercent} />

        {/* Dynamic active screen wrapper */}
        <div id="active-screen-scroller" className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          
          {/* Main conditional view router */}
          {activeView === 'dashboard' && (
            <Dashboard 
              userProgress={userProgress} 
              onUpdateProgress={handleUpdateProgress}
              onNavigateToView={(v) => setActiveView(v)}
            />
          )}

          {activeView === 'syllabus' && (
            <SyllabusHub 
              userProgress={userProgress} 
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeView === 'viva' && (
            <VivaArena 
              userProgress={userProgress} 
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeView === 'notes' && (
            <SmartNotes 
              userProgress={userProgress} 
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeView === 'planner' && (
            <StudyPlanner 
              userProgress={userProgress} 
              onUpdateProgress={handleUpdateProgress}
            />
          )}

        </div>

        {/* humble system margin credits footer */}
        <footer id="app-footer-credits" className="py-6 border-t border-slate-900 bg-slate-950 text-center font-mono text-[10px] text-slate-600 mt-auto">
          Department of Computer Science & Information Technology Study Suite • Designed Offline with Local State Synchronization
        </footer>

      </main>

    </div>
  );
}
