import React, { useState } from 'react';
import { UserProgress, StudyPlan, StudyPlanDay } from '../types';
import { SUBJECTS_DATABASE } from '../data';
import { 
  Calendar, CheckSquare, Square, Trash2, CalendarRange, 
  Sparkles, ListTodo, AlertCircle, ArrowRight, RefreshCw, ClipboardList 
} from 'lucide-react';

interface StudyPlannerProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export default function StudyPlanner({ userProgress, onUpdateProgress }: StudyPlannerProps) {
  const [examName, setExamName] = useState<string>('');
  const [examDateStr, setExamDateStr] = useState<string>('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([SUBJECTS_DATABASE[0].id]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const activePlan = userProgress.studyPlanner;

  // Handle toggling checkbox selections of subjects during setup
  const handleToggleSubjectSelect = (id: string) => {
    setSelectedSubjects(prev => {
      const idx = prev.indexOf(id);
      if (idx > -1) {
        if (prev.length === 1) return prev; // keep at least one selected
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  // Generate a detailed 5-Day study plan populated with curriculum items
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    const daysList: StudyPlanDay[] = [];
    const chosenSubjects = SUBJECTS_DATABASE.filter(s => selectedSubjects.includes(s.id));

    // Construct exactly 5 days of structured study plans
    for (let dayNum = 1; dayNum <= 5; dayNum++) {
      const todayTasks: { id: string; label: string; done: boolean; subjectId: string }[] = [];

      chosenSubjects.forEach((subj) => {
        const subCode = subj.code;

        if (dayNum === 1) {
          todayTasks.push({
            id: `${subj.id}-day1-t1`,
            label: `Review ${subCode} Unit 1 & 2 summaries`,
            done: false,
            subjectId: subj.id
          });
          todayTasks.push({
            id: `${subj.id}-day1-t2`,
            label: `Analyse ${subCode} core topic: "${subj.topics[0]?.title || 'ACID properties'}"`,
            done: false,
            subjectId: subj.id
          });
        } else if (dayNum === 2) {
          todayTasks.push({
            id: `${subj.id}-day2-t1`,
            label: `Analyse ${subCode} Unit 3 & 4 structured notes`,
            done: false,
            subjectId: subj.id
          });
          todayTasks.push({
            id: `${subj.id}-day2-t2`,
            label: `Deep-dive exam topic: "${subj.topics[1]?.title || 'Normalization'}"`,
            done: false,
            subjectId: subj.id
          });
        } else if (dayNum === 3) {
          todayTasks.push({
            id: `${subj.id}-day3-t1`,
            label: `Examine ${subCode} final Unit 5 summaries & Key Jargon`,
            done: false,
            subjectId: subj.id
          });
          todayTasks.push({
            id: `${subj.id}-day3-t2`,
            label: `Rehearse ${subj.vivaQuestions.length} Oral Oral Viva Voce list`,
            done: false,
            subjectId: subj.id
          });
        } else if (dayNum === 4) {
          todayTasks.push({
            id: `${subj.id}-day4-t1`,
            label: `Re-run mock practice assessments of ${subCode}`,
            done: false,
            subjectId: subj.id
          });
        } else if (dayNum === 5) {
          todayTasks.push({
            id: `${subj.id}-day5-t1`,
            label: `Execute final checklist & quick oral cards for ${subCode}`,
            done: false,
            subjectId: subj.id
          });
        }
      });

      daysList.push({
        day: dayNum,
        dateStr: `Day 0{dayNum} of Preparation`,
        tasks: todayTasks
      });
    }

    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      targetExam: examName,
      examDate: examDateStr || 'Upcoming End-Sems',
      createdAt: new Date().toISOString(),
      days: daysList
    };

    onUpdateProgress({
      ...userProgress,
      studyPlanner: newPlan
    });
    setActiveDayIndex(0);
  };

  // Toggle single daily task checkbox
  const toggleTaskDone = (dayNumber: number, taskId: string) => {
    if (!activePlan) return;

    const updatedDays = activePlan.days.map((d) => {
      if (d.day === dayNumber) {
        return {
          ...d,
          tasks: d.tasks.map((t) => {
            if (t.id === taskId) {
              return { ...t, done: !t.done };
            }
            return t;
          })
        };
      }
      return d;
    });

    onUpdateProgress({
      ...userProgress,
      studyPlanner: {
        ...activePlan,
        days: updatedDays
      }
    });
  };

  // Delete current study schedule
  const handleDeletePlan = () => {
    onUpdateProgress({
      ...userProgress,
      studyPlanner: null
    });
  };

  // Calculate plan metrics
  const totalTasks = activePlan?.days.reduce((acc, d) => acc + d.tasks.length, 0) || 0;
  const completedTasks = activePlan?.days.reduce((acc, d) => acc + d.tasks.filter(t => t.done).length, 0) || 0;
  const planProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div id="study-planner-panel" className="space-y-6">
      
      {!activePlan ? (
        /* WIZARD SETUP SCREEN */
        <div id="planner-wizard-card" className="max-w-xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-2">
              <CalendarRange className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold font-sans text-white tracking-tight">
              Create Exam Revision Schedule
            </h3>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm mx-auto font-sans">
              Enter target dates and subjects. Our system builds a structured 5-Day countdown study plan tailored to your exam prep.
            </p>
          </div>

          <form onSubmit={handleGeneratePlan} id="planner-wizard-form" className="space-y-4 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Exam / Subject Header</label>
              <input 
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g., Database End-Semestral Examination"
                className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Exam Landmark Date</label>
              <input 
                type="text"
                value={examDateStr}
                onChange={(e) => setExamDateStr(e.target.value)}
                placeholder="e.g., June 5th, 2026"
                className="w-full bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
              />
            </div>

            {/* Checkbox Select for Subject Exclusions */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Selected Revision Targets</label>
              <div className="grid sm:grid-cols-2 gap-2">
                {SUBJECTS_DATABASE.map((subj) => {
                  const isChecked = selectedSubjects.includes(subj.id);
                  return (
                    <div 
                      key={subj.id}
                      onClick={() => handleToggleSubjectSelect(subj.id)}
                      className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-cyan-500/10 border-cyan-500/25 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                          : 'bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-[9px] font-mono leading-none text-cyan-400 mb-1 uppercase font-bold">{subj.code}</span>
                        <span className="text-xs font-sans truncate font-semibold">{subj.name}</span>
                      </div>
                      <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-bold' : 'border-white/10'
                      }`}>
                        {isChecked && "✓"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              id="btn-submitting-plan-generate"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans font-bold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 pt-3 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Build 5-Day Revision Schedule
            </button>
          </form>
        </div>
      ) : (
        /* ACTIVE PLAN HUD DISPLAY */
        <div id="planner-active-pane" className="grid md:grid-cols-12 gap-6">
          
          {/* Day Navigation Tabs */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">Revision Countdown</span>
                <h3 className="font-sans font-bold text-white text-sm md:text-base truncate">{activePlan.targetExam}</h3>
                <span className="text-[11px] text-slate-400 font-sans">Exam Date: <strong className="text-slate-300">{activePlan.examDate}</strong></span>
              </div>

              {/* Day Menu */}
              <div className="space-y-2">
                {activePlan.days.map((day, dIdx) => {
                  const isSelected = activeDayIndex === dIdx;
                  const totalDayTasks = day.tasks.length;
                  const completedDayTasks = day.tasks.filter(t => t.done).length;
                  const isDayDone = totalDayTasks > 0 && totalDayTasks === completedDayTasks;

                  return (
                    <button
                      key={day.day}
                      id={`btn-select-planner-day-${day.day}`}
                      onClick={() => setActiveDayIndex(dIdx)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-bold' 
                          : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <strong className="text-xs font-sans leading-none block">Day 0{day.day} Schedule</strong>
                        <span className={`text-[9px] font-mono mt-1 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                          {isDayDone ? "✓ Day Fully Prepared" : `${completedDayTasks}/${totalDayTasks} Steps Done`}
                        </span>
                      </div>
                      
                      {isDayDone && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded leading-none ${
                          isSelected ? 'bg-slate-950 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          ✓ DONE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress Panel */}
              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Preparation Rate</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">{planProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    style={{ width: `${planProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Discard Planner button */}
              <button
                id="btn-delete-active-planner"
                onClick={handleDeletePlan}
                className="w-full py-2 bg-slate-950 hover:bg-rose-500/5 text-rose-400 border border-white/5 hover:border-rose-500/20 text-xs font-sans font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reschedule Revision
              </button>
            </div>
          </div>

          {/* Day Checklist display */}
          <div className="md:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[350px]">
            {(() => {
              const day: StudyPlanDay = activePlan.days[activeDayIndex];
              return (
                <div key={day.day} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">Revision Checklists</span>
                        <strong className="text-white font-sans text-xs md:text-sm">DAY 0{day.day} STUDY TRACK</strong>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {day.tasks.filter(t => t.done).length} / {day.tasks.length} Completed
                      </span>
                    </div>

                    {/* Checkbox Rows */}
                    <div className="space-y-2.5" id="planner-tasks-group">
                      {day.tasks.map((task) => (
                        <div
                          key={task.id}
                          id={`plan-task-row-${task.id}`}
                          onClick={() => toggleTaskDone(day.day, task.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3.5 group ${
                            task.done 
                              ? 'bg-slate-950/20 border-white/5 text-slate-500' 
                              : 'bg-white/[0.01] border-white/5 text-slate-200 hover:border-white/10 hover:bg-white/[0.03]'
                          }`}
                        >
                          <button
                            id={`task-check-trigger-${task.id}`}
                            className={`p-0.5 rounded transition-all shrink-0 mt-0.5 cursor-pointer ${
                              task.done ? 'text-emerald-400' : 'text-slate-600'
                            }`}
                          >
                            {task.done ? <CheckSquare className="w-4.5 h-4.5" /> : <Square className="w-4.5 h-4.5 text-slate-600 group-hover:text-slate-400" />}
                          </button>

                          <div className="flex-1">
                            <span className="text-xs md:text-sm leading-relaxed font-sans font-medium block">
                              {task.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Motivational Quote or Study Tip */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed text-slate-400 font-sans mt-4">
                    <AlertCircle className="w-4.5 h-4.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-1">Expert Engineering Study Tip:</strong>
                      "Spread your learning intervals and back up theories with immediate practice mock quizzes. Attempting quizzes after reading digests boosts long-term comprehension rates by upwards of 40%."
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      )}

    </div>
  );
}
