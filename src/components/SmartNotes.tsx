import React, { useState } from 'react';
import { UserProgress, CustomNote } from '../types';
import { processCustomNote } from '../nlpHelper';
import { 
  FileText, Sparkles, BrainCircuit, Trash2, Calendar, 
  HelpCircle, Eye, EyeOff, Plus, ClipboardCopy, List, Lightbulb
} from 'lucide-react';

interface SmartNotesProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export default function SmartNotes({ userProgress, onUpdateProgress }: SmartNotesProps) {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Card flips of generated answers
  const [revealedFlashcards, setRevealedFlashcards] = useState<Record<number, boolean>>({});

  // Error notifications or guides
  const [formError, setFormError] = useState<string>('');
  const [isCoping, setIsCoping] = useState<boolean>(false);

  // List of custom parsed notes
  const notes = userProgress.customNotes || [];
  const activeNote = notes.find(n => n.id === activeNoteId);

  // Trigger Local NLP algorithm
  const handleProcessNote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!noteTitle.trim()) {
      setFormError('Define a descriptive heading before executing.');
      return;
    }

    if (noteContent.trim().length < 50) {
      setFormError('Define a longer block of notes (minimum 50 characters) to allow our extractive sentence ranking NLP engine to construct logical relationships.');
      return;
    }

    const processed = processCustomNote(noteTitle, noteContent);
    const updatedNotesList = [processed, ...notes];

    onUpdateProgress({
      ...userProgress,
      customNotes: updatedNotesList
    });

    // Clear and set active
    setNoteTitle('');
    setNoteContent('');
    setActiveNoteId(processed.id);
    setRevealedFlashcards({});
  };

  // Delete notes from local memory
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    onUpdateProgress({
      ...userProgress,
      customNotes: updated
    });
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Copy parsed summaries to OS clipboard
  const copySummaryToClipboard = (summary: string[]) => {
    navigator.clipboard.writeText(summary.join('\n\n'));
    setIsCoping(true);
    setTimeout(() => setIsCoping(false), 2000);
  };

  // Toggle single generated flashcard answer
  const toggleFlashcardReveal = (index: number) => {
    setRevealedFlashcards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div id="smart-notes-panel" className="grid md:grid-cols-12 gap-6">
      
      {/* 🔮 Left Column - List of Saved Notes & Submit Form */}
      <div className="md:col-span-4 space-y-6">
        
        {/* Processing Form */}
        <form 
          onSubmit={handleProcessNote} 
          id="custom-nlp-form" 
          className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              Local NLP Processor
            </span>
            <h3 className="font-sans font-bold text-white text-sm md:text-base">Analyse Classroom Notes</h3>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Study Topic Heading</label>
            <input 
              type="text"
              id="input-note-title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g., Banker's Algorithm Safe State Criteria"
              className="w-full bg-slate-955/60 border border-white/5 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sans transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Raw Notes Copy-Paste</label>
            <textarea 
              id="input-note-content"
              rows={6}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Paste classroom presentations, research notes, or textbook paragraphs here (minimum 50 chars). Our local processor will auto-extract crucial bigrams, compute sentence frequencies to generate summaries, and synthesize flashcards..."
              className="w-full bg-slate-955/60 border border-white/5 rounded-xl p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed font-sans transition-colors"
            />
          </div>

          {formError && (
            <p className="text-rose-400 text-xs leading-normal font-sans bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
              {formError}
            </p>
          )}

          <button
            type="submit"
            id="btn-trigger-nlp-processing"
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans font-bold text-xs md:text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Analyse Locally (Offline)
          </button>
        </form>

        {/* List of Previous Parsed Notes */}
        <div id="nlp-saved-list-card" className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <List className="w-4.5 h-4.5 text-slate-450 text-slate-400" />
            <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wide">
              Your Local Notebook
            </h4>
          </div>

          {notes.length === 0 ? (
            <p className="text-slate-500 text-xs font-sans text-center py-4 bg-slate-950/40 rounded-xl border border-dashed border-white/5">
              No custom note files found in local memory storage. Paste a syllabus block above to begin.
            </p>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {notes.map((note) => {
                const isSelected = note.id === activeNoteId;
                return (
                  <div
                    key={note.id}
                    id={`saved-note-row-${note.id}`}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setRevealedFlashcards({});
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/[0.02] hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <strong className="text-xs font-sans font-bold truncate block">{note.title}</strong>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      id={`btn-delete-note-${note.id}`}
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-450 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                      title="Purge note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 🚀 Right Column - Local Processing Outputs Panel */}
      <div className="md:col-span-8 space-y-6">
        {activeNote ? (
          <div id="nlp-output-arena" className="space-y-6">
            
            {/* Header Display */}
            <div className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block flex items-center gap-1">
                   <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400 text-emerald-400" />
                  NLP Output Board
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5 font-sans leading-none">{activeNote.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-summary"
                  onClick={() => copySummaryToClipboard(activeNote.autoSummary)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-white/[0.02] text-slate-300 border border-white/5 text-xs font-sans font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ClipboardCopy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isCoping ? "Copied Summary!" : "Copy Summary Text"}</span>
                </button>
              </div>
            </div>

            {/* Keyword / Topic Tag Cloud */}
            <div id="nlp-keywords-block" className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Inferred Keywords & Concepts (Client-Side Tokenizer)
              </span>
              <div className="flex flex-wrap gap-2">
                {activeNote.inferredKeywords.map((kw, kwIdx) => (
                  <span 
                    key={kwIdx}
                    className="px-3 py-1 rounded-xl text-xs font-mono font-bold border bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Extractive Summarization Outputs */}
            <div id="nlp-summary-block" className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                Auto-Generated Summary Digest (Extractive Sentence Ranking)
              </span>
              <div className="space-y-3">
                {activeNote.autoSummary.map((sentence, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 mt-2.5 shrink-0 animate-pulse" />
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">{sentence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated AI Active-Recall Flashcards */}
            <div id="nlp-flashcard-block" className="space-y-3 font-sans">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold flex items-center gap-1">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                Syllabus Practice Flashcards (Synthesized from Note Grammars)
              </span>

              <div className="grid sm:grid-cols-2 gap-4">
                {activeNote.autoFlashcards.map((fCard, fcIdx) => {
                  const isRevealed = !!revealedFlashcards[fcIdx];
                  return (
                    <div 
                      key={fcIdx}
                      onClick={() => toggleFlashcardReveal(fcIdx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all select-none flex flex-col justify-between min-h-[140px] ${
                        isRevealed 
                          ? 'bg-slate-950/80 border-emerald-500/30 text-slate-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                          : 'bg-white/[0.02] border border-white/5 text-slate-450 hover:border-white/10 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-wider">Flashcard 0{fcIdx+1}</span>
                          <span className={`text-[9px] font-mono font-bold leading-none px-1.5 py-0.5 rounded ${isRevealed ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>{isRevealed ? "REVEALED" : "COVERED"}</span>
                        </div>
                        <p className="font-sans font-extrabold text-slate-200 text-xs leading-normal">
                          {fCard.question}
                        </p>
                      </div>

                      {isRevealed ? (
                        <p className="font-sans text-xs text-emerald-400 font-mono leading-relaxed pt-2 border-t border-white/5 mt-2">
                          {fCard.answer}
                        </p>
                      ) : (
                        <div className="pt-3 border-t border-white/5 mt-2 flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                          <span>Click to reveal explanation</span>
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Original Text Storage Scroll-area */}
            <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Raw Source Manuscript</span>
              <pre className="p-3 bg-slate-950 border border-white/5 rounded-xl text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto">
                {activeNote.content}
              </pre>
            </div>

          </div>
        ) : (
          <div id="nlp-empty-state" className="h-full min-h-[380px] bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-slate-950/60 text-slate-600 rounded-full border border-white/5">
              <FileText className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="font-sans font-bold text-white text-sm md:text-base">No Analytical Document Loaded</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                Paste raw lectures, code, or chapter pages on the left console and hit "Analyse Locally". 
                Our local text-mining engine will build customized summaries and active-recall flashcards immediately.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
