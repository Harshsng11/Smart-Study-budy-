/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, CheckCircle, Flame, Award, ShieldCheck, KeyRound, 
  UserPlus, LogIn, RefreshCw, Layers, Check, IdCard, Sparkles, LogOut, ArrowRight
} from 'lucide-react';
import { UserProgress } from '../types';

export interface StudentAccount {
  id: string;          // e.g., ENG-2026-5839
  name: string;
  department: string;
  semester: string;
  pinCode: string;     // Simple 4-digit secure local PIN
  avatarColor: string; // Tailwind color class or hex
  progress: UserProgress;
}

interface StudentAuthProps {
  currentStudent: StudentAccount | null;
  onSignIn: (student: StudentAccount) => void;
  onSignOut: () => void;
  onUpdateAccountProgress: (progress: UserProgress) => void;
}

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communications (ECE)',
  'Software Engineering (SE)',
  'Mechanical Engineering (ME)'
];

const SEMESTERS = [
  'Semester 1 (Freshman)',
  'Semester 2 (Freshman)',
  'Semester 3 (Sophomore)',
  'Semester 4 (Sophomore)',
  'Semester 5 (Junior)',
  'Semester 6 (Junior)',
  'Semester 7 (Senior)',
  'Semester 8 (Senior)'
];

const CARD_THEMES = [
  { name: 'Cyber Teal', color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', accent: 'cyan' },
  { name: 'Neon Emerald', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', accent: 'emerald' },
  { name: 'Solar Amber', color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', accent: 'amber' },
  { name: 'Retro Violet', color: 'violet', bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', accent: 'violet' },
  { name: 'Crimson Edge', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', accent: 'rose' }
];

export default function StudentAuth({ 
  currentStudent, 
  onSignIn, 
  onSignOut,
  onUpdateAccountProgress 
}: StudentAuthProps) {
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  
  // Registration Form State
  const [regName, setRegName] = useState<string>('');
  const [regDept, setRegDept] = useState<string>(DEPARTMENTS[1]); // Defaults to IT
  const [regSem, setRegSem] = useState<string>(SEMESTERS[5]);    // Defaults to Sem 6
  const [regPin, setRegPin] = useState<string>('');
  const [selectedThemeIdx, setSelectedThemeIdx] = useState<number>(0);
  
  // Login Form State
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Load registered accounts on mount
  useEffect(() => {
    const savedAccounts = localStorage.getItem('smart_study_buddy_accounts_v1');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        if (Array.isArray(parsed)) {
          setAccounts(parsed);
          if (parsed.length > 0 && !currentStudent) {
            setSelectedAccountId(parsed[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to parse database accounts', err);
      }
    }
  }, [currentStudent]);

  const saveAccountsToStorage = (updatedAccounts: StudentAccount[]) => {
    setAccounts(updatedAccounts);
    localStorage.setItem('smart_study_buddy_accounts_v1', JSON.stringify(updatedAccounts));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regName.trim().length < 2) {
      setErrorMsg('Please enter a valid student name.');
      return;
    }
    if (regPin.length !== 4 || isNaN(Number(regPin))) {
      setErrorMsg('Passcode PIN must be exactly 4 numerical digits.');
      return;
    }

    // Generate unique card id: e.g., ENG-2026-X739
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `ENG-2026-${randomDigits}`;

    // Create fresh offline database payload for this specific student
    const defaultProgress: UserProgress = {
      completedQuizIds: {},
      masteredVivaIds: [],
      completedTopicIds: [],
      customNotes: [],
      studyPlanner: null
    };

    const newStudent: StudentAccount = {
      id: generatedId,
      name: regName.trim(),
      department: regDept,
      semester: regSem,
      pinCode: regPin,
      avatarColor: CARD_THEMES[selectedThemeIdx].accent,
      progress: defaultProgress
    };

    const updated = [...accounts, newStudent];
    saveAccountsToStorage(updated);
    
    // Automatically sign in the newly registered student progress
    onSignIn(newStudent);
    
    // Reset registration forms
    setRegName('');
    setRegPin('');
    setIsRegistering(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetAccount = accounts.find(acc => acc.id === selectedAccountId);
    if (!targetAccount) {
      setErrorMsg('Selected student profile could not be retrieved.');
      return;
    }

    if (targetAccount.pinCode !== loginPin) {
      setErrorMsg('Security Passcode PIN is incorrect. Please try again.');
      return;
    }

    // Successfully match PIN, login student progress
    onSignIn(targetAccount);
    setLoginPin('');
  };

  // Switch/Purge Profile Action
  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you absolute sure you want to completely delete this student ID? This will wipe all local progress archives associated with this ID permanently.')) {
      return;
    }
    const filtered = accounts.filter(acc => acc.id !== id);
    saveAccountsToStorage(filtered);
    if (selectedAccountId === id) {
      setSelectedAccountId(filtered.length > 0 ? filtered[0].id : '');
    }
  };

  // Return full registration view or full login view blocking overlay when not authenticated
  if (!currentStudent) {
    return (
      <div className="fixed inset-0 min-h-screen bg-slate-950/95 backdrop-blur-md z-[999] flex items-center justify-center p-4 overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/20 via-slate-950 to-indigo-950/20 pointer-events-none" />
        
        {/* Top ambient lights */}
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 font-sans">
          
          {/* Logo & Platform header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-cyan-500/15 rounded-2xl text-cyan-400 mb-1 border border-cyan-500/20">
              <IdCard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
              SmartStudy<span className="text-cyan-400">.eng</span> Account Portal
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Standalone student profile engine. Your data, revision checklists, and quiz performance metrics are compiled securely inside your browser's local sandbox memory.
            </p>
          </div>

          {/* ERROR STATUS DISPATCHER */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* TOGGLE OPTIONS (LOGIN vs REGISTER) */}
          {accounts.length > 0 && (
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isRegistering ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                SIGN IN PASS
              </button>
              <button
                type="button"
                onClick={() => { setIsRegistering(true); setErrorMsg(''); }}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isRegistering ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                CREATE ID CARD
              </button>
            </div>
          )}

          {/* REGISTER NEW STUDENT PROFILE FORM */}
          {(isRegistering || accounts.length === 0) && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <span className="hidden md:inline text-xs text-slate-500 block font-mono font-bold uppercase mb-2">
                  {accounts.length === 0 ? "Setup Primary Student Workspace" : "Provision New Identity Credentials"}
                </span>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g., Harsh Dikshant Singh"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Major Branch / Department</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Active Academic Year</label>
                  <select
                    value={regSem}
                    onChange={(e) => setRegSem(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                  >
                    {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* CARD ACCENT SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">ID Card Accent Signature</label>
                <div className="flex items-center gap-2">
                  {CARD_THEMES.map((theme, idx) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedThemeIdx(idx)}
                      className={`h-8 flex-1 rounded-xl border text-[10px] font-sans font-bold flex items-center justify-center gap-1 transition-all capitalize cursor-pointer ${
                        selectedThemeIdx === idx 
                          ? `${theme.bg} ${theme.border} ${theme.text} scale-[1.03] ring-1 ring-cyan-500/20` 
                          : 'bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        theme.accent === 'cyan' ? 'bg-cyan-400' :
                        theme.accent === 'emerald' ? 'bg-emerald-400' :
                        theme.accent === 'amber' ? 'bg-amber-400' :
                        theme.accent === 'violet' ? 'bg-violet-400' : 'bg-rose-400'
                      }`} />
                      <span className="hidden xs:inline">{theme.name.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Security Pass PIN <span className="text-cyan-400 font-sans tracking-tight">(4 Digits Required to login)</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter static numerical PIN (e.g., 2026)"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 tracking-widest font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <Sparkles className="w-4 h-4" />
                Initialize Identity & Create Badge
              </button>
            </form>
          )}

          {/* SIGN IN / LOCK SYSTEM FORM */}
          {(!isRegistering && accounts.length > 0) && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Select Active ID Classcard</label>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    const cardTheme = CARD_THEMES.find(t => t.accent === acc.avatarColor) || CARD_THEMES[0];
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                            : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-full ${cardTheme.bg} ${cardTheme.text} border border-white/5 font-mono font-bold text-xs shrink-0`}>
                            {acc.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <strong className="text-xs text-white truncate block font-sans font-bold leading-tight">{acc.name}</strong>
                            <span className="text-[9px] text-slate-500 font-mono tracking-wider block capitalize mt-0.5">{acc.semester} • {acc.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">✓</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProfile(acc.id, e)}
                            className="text-slate-600 hover:text-rose-400 p-1 text-[10px] font-mono font-bold leading-none border border-transparent rounded hover:border-rose-500/10 hover:bg-rose-500/5 transition-all"
                            title="Decommission Card"
                          >
                            Purge
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Confirm Profile 4-Digit Pass PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Security numerical PIN"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 tracking-widest font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                <LogIn className="w-4 h-4" />
                Unseal Student Workspace
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Active user visual profile widget displayed on footer or settings context
  const activeTheme = CARD_THEMES.find(t => t.accent === currentStudent.avatarColor) || CARD_THEMES[0];

  return (
    <div id="student-identity-card-badge" className="space-y-3 font-sans">
      <div className={`p-4 rounded-2xl border ${activeTheme.bg} ${activeTheme.border} relative overflow-hidden flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md`}>
        
        {/* Futuristic Grid & Scanner overlay lines inside Card ID */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-white/[0.01] to-transparent pointer-events-none" />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
          <span className="text-[8px] font-mono text-cyan-400/80 uppercase font-bold tracking-widest">VERIFIED</span>
        </div>

        <div className="flex items-start gap-3.5 relative z-10">
          {/* Avatar frame */}
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm border ${activeTheme.text} bg-slate-950/60 border-white/5 shrink-0`}>
            {currentStudent.name.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0 flex-1">
            <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold tracking-widest leading-none">STUDENT PROFILE APPROVED</span>
            <strong className="text-white text-xs truncate block font-sans mt-0.5 font-extrabold uppercase">{currentStudent.name}</strong>
            <span className="text-[10px] text-slate-350 truncate block mt-0.5">{currentStudent.department.split(' (')[0]}</span>
            <span className="text-[9px] text-slate-500 block leading-none font-sans mt-1">{currentStudent.semester}</span>
          </div>
        </div>

        {/* Digital ID system codes barcode */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between relative z-10 leading-none">
          <div>
            <span className="text-[7px] font-mono text-slate-500 uppercase font-bold tracking-wider block">ID NUMBER</span>
            <span className={`text-[10px] font-mono ${activeTheme.text} font-bold`}>{currentStudent.id}</span>
          </div>
          <button
            onClick={onSignOut}
            className="px-2 py-1 bg-slate-950/40 hover:bg-rose-500/10 text-rose-400 border border-white/5 hover:border-rose-500/20 text-[9px] font-mono font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-2.5 h-2.5" />
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
