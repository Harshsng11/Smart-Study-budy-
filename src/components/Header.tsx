import React, { useEffect, useState } from 'react';
import { BookOpen, Award, Users, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  totalProgressPercent: number;
}

export default function Header({ totalProgressPercent }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Elegant real-time clock matching the workspace UTC standard
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="app-main-header" className="relative w-full overflow-hidden bg-slate-900/40 backdrop-blur-md border-b border-white/5 p-6 md:p-8">
      {/* Decorative Grid Mesh Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 z-0" />

      {/* Atmospheric highlight */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative mx-auto max-w-7xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-10">
        
        {/* Title and University Synopsis Brand */}
        <div id="header-brand-section" className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span id="badge-offline-mode" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              100% OFFLINE ENGINE
            </span>
            <span id="badge-academic-session" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5" />
              SESSION: 2022-2023
            </span>
            <span id="badge-immersive-ui" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              IMMERSIVE THEME
            </span>
          </div>

          <h1 id="app-primary-title" className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white mb-2">
            SmartStudy<span className="text-cyan-400">.eng</span> <span className="text-slate-400 font-normal text-lg md:text-xl block md:inline md:ml-2">Advanced Engineering Education Hub</span>
          </h1>
          
          <p id="header-academic-subtitle" className="text-sm text-slate-400 leading-relaxed font-sans max-w-2xl">
            Computer Science and Information Technology academic syllabus mastery platform.
            <br />
            <span className="text-slate-500 flex items-center gap-1.5 mt-1 flex-wrap text-xs md:text-sm">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Engine Status: <strong className="text-slate-300 font-semibold">Active Peer-to-Peer Cohort Study Suite</strong> 
              <span className="hidden md:inline">•</span> System Mode: <strong className="text-slate-300 font-mono">STANDALONE RETRIEVAL</strong>
            </span>
          </p>
        </div>

        {/* Dynamic UTC and Global Progress Metrics Dashboard Card */}
        <div id="header-status-card" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Global Course Completion HUD */}
          <div id="hud-progress-card" className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4 min-w-[200px] hover:bg-white/[0.05] transition-all">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg border border-white/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1 font-bold">Total Course Sync</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans font-semibold text-xl text-slate-200">{totalProgressPercent}%</span>
                <span className="text-xs text-slate-400">Mastery</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${totalProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-time UTC System Interface */}
          <div id="hud-clock-card" className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4 min-w-[200px] hover:bg-white/[0.05] transition-all">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-white/5 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1 font-bold">LOCAL TIME UTC</div>
              <div id="header-utc-time" className="font-mono text-sm text-slate-300 whitespace-nowrap">
                {currentTime || 'Loading clock...'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1 leading-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Active Sandbox
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
