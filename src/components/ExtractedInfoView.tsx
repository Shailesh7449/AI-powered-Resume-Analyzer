import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Layers
} from 'lucide-react';
import { ParsedSections, CanonicalSkill, SkillCategoryGroup } from '../types';

interface ExtractedInfoViewProps {
  parsedSections: ParsedSections;
  skills: {
    matchedSkills: CanonicalSkill[];
    categories: SkillCategoryGroup;
    totalCount: number;
  };
}

export const ExtractedInfoView: React.FC<ExtractedInfoViewProps> = ({ parsedSections, skills }) => {
  const p = parsedSections.personal;

  const categoryTitles: { key: keyof SkillCategoryGroup; title: string; color: string }[] = [
    { key: 'languages', title: 'Programming Languages', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
    { key: 'frameworks', title: 'Frameworks & Web', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
    { key: 'cloud_devops', title: 'Cloud & DevOps', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { key: 'databases', title: 'Databases & Storage', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { key: 'data_ml', title: 'Data & Machine Learning', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
    { key: 'tools', title: 'Developer Tools & CI', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
    { key: 'concepts', title: 'Architecture & Concepts', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
    { key: 'soft_skills', title: 'Leadership & Soft Skills', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Personal & Contact Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Candidate Profile & Contact Entities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Full Name</span>
            <span className="font-semibold text-slate-200">{p.name}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>Email</span>
            </span>
            <span className="font-semibold text-slate-200 break-all">{p.email}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>Phone</span>
            </span>
            <span className="font-semibold text-slate-200">{p.phone}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Location</span>
            </span>
            <span className="font-semibold text-slate-200">{p.location}</span>
          </div>
        </div>

        {/* Links row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-300">
            <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{p.linkedin}</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-300">
            <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{p.github}</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{p.portfolio}</span>
          </div>
        </div>

        {/* Professional Summary */}
        {parsedSections.summary !== 'Not detected' && (
          <div className="mt-4 p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-400 block mb-1">Detected Professional Summary:</span>
            {parsedSections.summary}
          </div>
        )}
      </div>

      {/* 2. Categorized Skills Taxonomy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 flex-wrap gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Extracted Normalized Skills ({skills.totalCount} Canonical Entities)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Mapped via Canonical Alias Ontology
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryTitles.map(({ key, title, color }) => {
            const list = skills.categories[key] || [];
            if (list.length === 0) return null;

            return (
              <div key={key} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-300 mb-2.5 flex items-center justify-between">
                  <span>{title}</span>
                  <span className="text-[11px] font-mono text-slate-400">{list.length}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((skillName) => (
                    <span
                      key={skillName}
                      className={`text-xs px-2.5 py-1 rounded-md border font-medium ${color}`}
                    >
                      {skillName}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Work Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>Work Experience ({parsedSections.experience.length} Roles)</span>
          </h3>

          {parsedSections.experience.length > 0 ? (
            <div className="space-y-4">
              {parsedSections.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{exp.role}</h4>
                      <p className="text-slate-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {exp.duration}
                    </span>
                  </div>

                  {exp.highlights.length > 0 && (
                    <ul className="mt-2.5 space-y-1.5 text-slate-300 pl-3">
                      {exp.highlights.slice(0, 4).map((h, hIdx) => (
                        <li key={hIdx} className="list-disc leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No explicit work experience entries recognized.</p>
          )}
        </div>

        {/* Education & Projects */}
        <div className="space-y-6">
          {/* Education */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Education Background</span>
            </h3>

            {parsedSections.education.length > 0 ? (
              <div className="space-y-3">
                {parsedSections.education.map((edu, idx) => (
                  <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-200">{edu.degree}</h4>
                        <p className="text-slate-400">{edu.institution}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        {edu.year}
                      </span>
                    </div>
                    {edu.grade !== 'Not detected' && (
                      <p className="mt-1 text-[11px] text-indigo-400 font-medium">Grade/GPA: {edu.grade}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No education block parsed.</p>
            )}
          </div>

          {/* Projects */}
          {parsedSections.projects.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <FolderGit2 className="w-4 h-4 text-purple-400" />
                <span>Documented Projects ({parsedSections.projects.length})</span>
              </h3>

              <div className="space-y-3">
                {parsedSections.projects.slice(0, 3).map((proj, idx) => (
                  <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <h4 className="font-bold text-slate-200">{proj.name}</h4>
                    <p className="text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
