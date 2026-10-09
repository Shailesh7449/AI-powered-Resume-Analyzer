import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  Target,
  FileText,
  Zap,
  Award
} from 'lucide-react';
import { AnalysisResponse } from '../types';
import { sendCareerAssistantMessage, ChatMessagePayload } from '../services/api';

interface AiCareerAssistantViewProps {
  analysis: AnalysisResponse;
  onNavigateToTab?: (tab: string) => void;
}

interface MessageItem extends ChatMessagePayload {
  id: string;
  timestamp: string;
  provider?: 'gemini' | 'nlp_rule_engine';
}

export function AiCareerAssistantView({ analysis, onNavigateToTab }: AiCareerAssistantViewProps) {
  const candidateName = analysis.parsedSections.personal.name !== 'Not detected' 
    ? analysis.parsedSections.personal.name 
    : 'Candidate';
  const atsScore = analysis.atsScore.overallScore;

  const initialGreeting: MessageItem = {
    id: 'msg-0',
    role: 'assistant',
    content: `### Welcome, ${candidateName}! 👋\n\nI am your dedicated **ResumeAI Career Assistant**. I have analyzed your complete resume profile and deterministic ATS evaluation:\n\n` +
      `- **Overall ATS Score:** **${atsScore}/100**\n` +
      `- **Technical Skills Detected:** **${analysis.skills.totalCount} canonical entities**\n` +
      `- **Work History:** **${analysis.parsedSections.experience.length} roles parsed**\n` +
      `- **Target Alignment:** ${analysis.jobMatch ? `**${analysis.jobMatch.overallMatchScore}% match** with *${analysis.jobMatch.detectedJobRole}*` : '*No job description matched yet*'}\n\n` +
      `Ask me anything about improving your bullet points, closing skill gaps, explaining your ATS score breakdown, or preparing for interviews!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    provider: 'gemini',
  };

  const [messages, setMessages] = useState<MessageItem[]>([initialGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const buildContext = () => {
    return {
      candidateName,
      summary: analysis.parsedSections.summary,
      skills: analysis.skills.matchedSkills.map(s => s.name),
      atsScore: analysis.atsScore.overallScore,
      strengths: analysis.atsScore.strengths,
      weaknesses: analysis.atsScore.weaknesses,
      recommendations: analysis.atsScore.recommendations,
      experience: analysis.parsedSections.experience,
      education: analysis.parsedSections.education,
      projects: analysis.parsedSections.projects,
      jobMatch: analysis.jobMatch ? {
        overallMatchScore: analysis.jobMatch.overallMatchScore,
        detectedJobRole: analysis.jobMatch.detectedJobRole,
        matchingSkills: analysis.jobMatch.matchingSkills,
        missingSkills: analysis.jobMatch.missingSkills,
      } : null,
      jobRecommendations: analysis.jobRecommendations.map(r => ({
        roleTitle: r.roleTitle,
        matchPercentage: r.matchPercentage,
        whyFits: r.whyFits,
      })),
    };
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setErrorMsg(null);

    // Auto-adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Map to payload schema
      const payloadMessages: ChatMessagePayload[] = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const context = buildContext();
      const res = await sendCareerAssistantMessage(payloadMessages, context);

      if (res && res.reply) {
        const assistantMessage: MessageItem = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: res.provider,
        };
        setMessages([...newMessages, assistantMessage]);
      } else {
        throw new Error('No response returned from the assistant.');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMsg(err?.message || 'Failed to communicate with Career Assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
    setErrorMsg(null);
  };

  // Quick suggestions tailored to candidate
  const suggestionPills = [
    { label: `Why is my ATS score ${atsScore}?`, query: `Can you explain why my ATS score is ${atsScore}/100 and what the top 3 highest-leverage fixes are?` },
    { label: 'What are my biggest skill gaps?', query: 'Based on my resume, what are my biggest skill gaps and which technologies should I learn next?' },
    { label: 'Rewrite my work bullet with XYZ formula', query: 'Pick a bullet point from my work experience and provide 2 optimized rewrites using the Google XYZ formula.' },
    { label: 'Which roles best match my experience?', query: 'Which job titles and market roles best match my background, and why?' },
    { label: 'Tailoring advice for target job', query: 'What is the most effective strategy to tailor my resume for a Senior-level job posting without fabricating facts?' },
  ];

  // Helper to render markdown-formatted content nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white pt-2">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="border-slate-200 dark:border-slate-800 my-2" />;
          }
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-4 border-indigo-500 pl-3 py-1 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r text-slate-700 dark:text-slate-300 italic font-mono text-xs">
                {trimmed.replace('> ', '')}
              </blockquote>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            const bulletText = trimmed.replace(/^[-*•]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">•</span>
                <span className="text-slate-700 dark:text-slate-300">{formatInlineText(bulletText)}</span>
              </div>
            );
          }
          if (/^\d+\.\s+/.test(trimmed)) {
            const num = trimmed.match(/^(\d+\.)\s+/)?.[1];
            const text = trimmed.replace(/^\d+\.\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">{num}</span>
                <span className="text-slate-700 dark:text-slate-300">{formatInlineText(text)}</span>
              </div>
            );
          }
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} className="text-slate-800 dark:text-slate-200">
              {formatInlineText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper to parse bolding **word** and code `word` inline
  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs border border-slate-200 dark:border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-600 dark:text-slate-400">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-170px)] min-h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Career Assistant</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Grounded Context
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active profile: <span className="font-semibold text-slate-700 dark:text-slate-300">{candidateName}</span> (ATS Score: <span className="font-bold text-indigo-600 dark:text-indigo-400">{atsScore}/100</span>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5 font-medium"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Suggestion Pills Bar */}
      <div className="px-6 py-2.5 bg-slate-100/60 dark:bg-slate-950/50 border-b border-slate-200/70 dark:border-slate-800/70 overflow-x-auto flex items-center gap-2 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Suggested:
        </span>
        {suggestionPills.map((pill, i) => (
          <button
            key={i}
            onClick={() => handleSend(pill.query)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all font-medium text-xs shadow-2xs"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm relative group ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                renderFormattedContent(msg.content)
              )}

              {/* Message Footer Info */}
              <div
                className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                  msg.role === 'user'
                    ? 'border-indigo-500/40 text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      {msg.provider === 'gemini' ? 'Gemini 3.8 Flash' : 'NLP Grounded Engine'}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs p-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                Analyzing resume context and reasoning...
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="px-2.5 py-1 rounded bg-red-100 dark:bg-red-900/60 font-semibold hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative flex items-end gap-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 shadow-sm transition-all p-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              // auto resize up to 140px
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Ask anything about ${candidateName}'s resume, ATS score, skills, or job matches...`}
            disabled={isLoading}
            className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-2 py-1 max-h-[140px]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-2 rounded-lg font-semibold transition-all shrink-0 ${
              inputValue.trim() && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          Ground-truth grounded assistant • Shift + Enter for newline • Powered by Gemini 3.8 Flash & Deterministic NLP
        </p>
      </div>
    </div>
  );
}
