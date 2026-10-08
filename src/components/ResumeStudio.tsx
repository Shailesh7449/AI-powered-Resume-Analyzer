import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResponse, ParsedSections } from '../types';
import { Sparkles, Edit2, Check, X, RefreshCw, Save, RotateCcw, RotateCw, Trash2, Plus, ArrowRight } from 'lucide-react';
import { editWithAi, analyzeResume } from '../services/api';

interface ResumeStudioProps {
  analysis: AnalysisResponse;
  onUpdate: (newAnalysis: AnalysisResponse) => void;
}

export function ResumeStudio({ analysis, onUpdate }: ResumeStudioProps) {
  const [sections, setSections] = useState<ParsedSections>(
    JSON.parse(JSON.stringify(analysis.parsedSections))
  );
  
  const [history, setHistory] = useState<ParsedSections[]>([JSON.parse(JSON.stringify(analysis.parsedSections))]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeEdit, setActiveEdit] = useState<{ path: string; mode: 'manual' | 'ai', tempText: string } | null>(null);
  
  const [aiSuggestion, setAiSuggestion] = useState<{ original: string; improved: string; path: string } | null>(null);
  const [beforeScore, setBeforeScore] = useState<number | null>(null);
  const [afterScore, setAfterScore] = useState<number | null>(null);

  const updateSection = (path: string, newValue: any) => {
    const keys = path.split('.');
    const newSections = JSON.parse(JSON.stringify(sections));
    let curr = newSections;
    for (let i = 0; i < keys.length - 1; i++) {
      curr = curr[keys[i]];
    }
    curr[keys[keys.length - 1]] = newValue;
    
    setSections(newSections);
    
    // Push to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const reconstructResume = (s: ParsedSections): string => {
    let out = '';
    out += `${s.personal.name}\n${s.personal.email} | ${s.personal.phone} | ${s.personal.location}\n`;
    if (s.personal.linkedin) out += `${s.personal.linkedin}\n`;
    if (s.personal.github) out += `${s.personal.github}\n`;
    if (s.personal.portfolio) out += `${s.personal.portfolio}\n`;
    
    if (s.summary && s.summary !== 'Not detected') {
      out += `\nPROFESSIONAL SUMMARY\n${s.summary}\n`;
    }
    
    if (s.skillsText) out += `\nSKILLS\n${s.skillsText}\n`;
    
    if (s.experience && s.experience.length > 0) {
      out += `\nEXPERIENCE\n`;
      s.experience.forEach(exp => {
        out += `${exp.role} | ${exp.company} | ${exp.duration}\n`;
        exp.highlights.forEach(h => out += `• ${h}\n`);
      });
    }

    if (s.education && s.education.length > 0) {
      out += `\nEDUCATION\n`;
      s.education.forEach(ed => {
        out += `${ed.degree} | ${ed.institution} | ${ed.year} | ${ed.grade}\n`;
      });
    }

    if (s.projects && s.projects.length > 0) {
      out += `\nPROJECTS\n`;
      s.projects.forEach(pr => {
        out += `${pr.name} | ${pr.technologies.join(', ')}\n${pr.description}\n`;
      });
    }

    if (s.certifications && s.certifications.length > 0) {
      out += `\nCERTIFICATIONS\n`;
      s.certifications.forEach(cert => out += `${cert}\n`);
    }

    if (s.achievements && s.achievements.length > 0) {
      out += `\nACHIEVEMENTS\n`;
      s.achievements.forEach(ach => out += `${ach}\n`);
    }

    return out;
  };

  const handleSave = async () => {
    setIsProcessing(true);
    setBeforeScore(analysis.atsScore.overallScore);
    try {
      const reconstructedText = reconstructResume(sections);
      const newAnalysis = await analyzeResume(reconstructedText, analysis.jobMatch?.detectedJobRole);
      setAfterScore(newAnalysis.atsScore.overallScore);
      onUpdate(newAnalysis);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze updated resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  const requestAiEdit = async (path: string, text: string, mode: any) => {
    setIsProcessing(true);
    try {
      const result = await editWithAi(text, mode, { 
        jobDescription: analysis.jobMatch?.detectedJobRole,
        sectionName: path.split('.')[0]
      });
      setAiSuggestion({ original: text, improved: result.improved, path });
    } catch (err) {
      alert('AI Edit failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const acceptAiEdit = () => {
    if (aiSuggestion) {
      updateSection(aiSuggestion.path, aiSuggestion.improved);
      setAiSuggestion(null);
    }
  };

  const rejectAiEdit = () => {
    setAiSuggestion(null);
  };

  const EditableBlock = ({ 
    label, path, value, isMultiline = false 
  }: { label: string, path: string, value: string, isMultiline?: boolean }) => {
    const isEditing = activeEdit?.path === path && activeEdit.mode === 'manual';
    
    if (aiSuggestion?.path === path) {
      return (
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-700 space-y-3 my-2">
          <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Suggestion
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500 mb-1 text-xs uppercase font-semibold">Original</div>
              <div className="text-slate-700 dark:text-slate-300 line-through opacity-70">{aiSuggestion.original}</div>
            </div>
            <div>
              <div className="text-emerald-600 mb-1 text-xs uppercase font-semibold">Improved</div>
              <div className="text-emerald-800 dark:text-emerald-300 font-medium">{aiSuggestion.improved}</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={acceptAiEdit} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"><Check className="w-4 h-4"/> Accept</button>
            <button onClick={() => requestAiEdit(path, aiSuggestion.original, 'ats')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"><RefreshCw className="w-4 h-4"/> Regenerate</button>
            <button onClick={rejectAiEdit} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"><X className="w-4 h-4"/> Reject</button>
          </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="my-2 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase">{label}</div>
          {isMultiline ? (
            <textarea 
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={activeEdit.tempText}
              onChange={(e) => setActiveEdit({ ...activeEdit, tempText: e.target.value })}
            />
          ) : (
            <input 
              type="text"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={activeEdit.tempText}
              onChange={(e) => setActiveEdit({ ...activeEdit, tempText: e.target.value })}
            />
          )}
          <div className="flex gap-2">
            <button 
              onClick={() => {
                updateSection(path, activeEdit.tempText);
                setActiveEdit(null);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            ><Save className="w-4 h-4"/> Save</button>
            <button 
              onClick={() => setActiveEdit(null)}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 rounded-lg text-xs font-bold"
            >Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <div className="group relative my-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
        <div className="text-xs font-semibold text-slate-500 uppercase mb-1">{label}</div>
        <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{value}</div>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button 
            onClick={() => setActiveEdit({ path, mode: 'manual', tempText: value })}
            className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 shadow-sm"
          ><Edit2 className="w-3 h-3"/> Edit Manually</button>
          
          <div className="relative group/ai">
            <button className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3"/> Edit with AI
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover/ai:flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-10 w-48">
              <button onClick={() => requestAiEdit(path, value, 'ats')} className="text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Improve ATS Compatibility</button>
              <button onClick={() => requestAiEdit(path, value, 'clarity')} className="text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Improve Clarity</button>
              <button onClick={() => requestAiEdit(path, value, 'verbs')} className="text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Improve Action Verbs</button>
              <button onClick={() => requestAiEdit(path, value, 'concise')} className="text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Make Concise</button>
              <button onClick={() => requestAiEdit(path, value, 'grammar')} className="text-left px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800">Fix Grammar</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Top Toolbar */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Resume Studio</h2>
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button onClick={undo} disabled={historyIndex === 0} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-300"><RotateCcw className="w-4 h-4"/></button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-300"><RotateCw className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {beforeScore !== null && afterScore !== null && (
            <div className="flex items-center gap-2 text-sm font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-slate-500">Score:</span>
              <span className="text-slate-800 dark:text-slate-200">{beforeScore}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className={afterScore > beforeScore ? 'text-emerald-500' : afterScore < beforeScore ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}>
                {afterScore}
              </span>
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-70 transition-all shadow-md shadow-indigo-500/20"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Recalculate ATS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* Left Column: Personal & Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Personal Information</h3>
            <EditableBlock label="Name" path="personal.name" value={sections.personal.name} />
            <EditableBlock label="Email" path="personal.email" value={sections.personal.email} />
            <EditableBlock label="Phone" path="personal.phone" value={sections.personal.phone} />
            <EditableBlock label="Location" path="personal.location" value={sections.personal.location} />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Professional Summary</h3>
            <EditableBlock label="Summary" path="summary" value={sections.summary} isMultiline />
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Skills</h3>
            <EditableBlock label="Skills Text" path="skillsText" value={sections.skillsText} isMultiline />
          </div>
        </div>

        {/* Middle/Right Column: Experience & Education */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Experience</h3>
            </div>
            
            <div className="space-y-6">
              {sections.experience.map((exp, i) => (
                <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/50">
                  <EditableBlock label="Role" path={`experience.${i}.role`} value={exp.role} />
                  <EditableBlock label="Company" path={`experience.${i}.company`} value={exp.company} />
                  <EditableBlock label="Duration" path={`experience.${i}.duration`} value={exp.duration} />
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Highlights</div>
                    {exp.highlights.map((h, j) => (
                      <EditableBlock key={j} label={`Bullet ${j+1}`} path={`experience.${i}.highlights.${j}`} value={h} isMultiline />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Education</h3>
            </div>
            
            <div className="space-y-4">
              {sections.education.map((ed, i) => (
                <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/50">
                  <EditableBlock label="Degree" path={`education.${i}.degree`} value={ed.degree} />
                  <EditableBlock label="Institution" path={`education.${i}.institution`} value={ed.institution} />
                  <EditableBlock label="Year" path={`education.${i}.year`} value={ed.year} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
