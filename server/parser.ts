import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { cleanText } from './nlp.js';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
}

export interface ProjectEntry {
  name: string;
  technologies: string[];
  description: string;
}

export interface ParsedSections {
  rawText: string;
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skillsText: string;
  certifications: string[];
  achievements: string[];
  formattingFlags: {
    hasTabularFormatting: boolean;
    hasExcessiveSpecialChars: boolean;
    hasVeryLongLines: boolean;
    hasPossibleTwoColumns: boolean;
    pageCountEstimate: number;
    wordCount: number;
  };
}

/**
 * Robust document text extraction for PDF & DOCX
 */
export async function extractDocumentText(buffer: Buffer, mimetype: string, originalname: string): Promise<string> {
  const ext = originalname.toLowerCase().split('.').pop() || '';

  if (mimetype.includes('pdf') || ext === 'pdf') {
    try {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const textResult = await parser.getText();
      await parser.destroy();
      if (textResult && textResult.text && textResult.text.trim().length > 0) {
        return cleanText(textResult.text);
      }
      throw new Error('PDF parsed with zero extractable text (might be a scanned image).');
    } catch (err: any) {
      // Fallback: Attempt simple ASCII string extraction if binary stream permits
      const asciiMatch = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
      const candidateLines = asciiMatch.split('\n').filter(l => l.trim().length > 10);
      if (candidateLines.length > 5) {
        return cleanText(candidateLines.join('\n'));
      }
      throw new Error(err?.message || 'Failed to extract text from PDF file. Ensure the PDF contains searchable text.');
    }
  }

  if (mimetype.includes('word') || mimetype.includes('officedocument') || ext === 'docx') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result && result.value && result.value.trim().length > 0) {
        return cleanText(result.value);
      }
      throw new Error('DOCX document has no readable text content.');
    } catch (err: any) {
      throw new Error(err?.message || 'Failed to parse DOCX file format.');
    }
  }

  // Plain text fallback
  const text = buffer.toString('utf-8');
  if (text.trim().length > 0) {
    return cleanText(text);
  }

  throw new Error('Unsupported or empty file type. Please upload a PDF or DOCX file.');
}

/**
 * Regex-based Information Extraction for Personal Details
 */
export function extractPersonalInfo(text: string): PersonalInfo {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : 'Not detected';

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
  const phone = phoneMatch ? phoneMatch[0] : 'Not detected';

  // LinkedIn
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : (text.toLowerCase().includes('linkedin') ? 'LinkedIn profile detected' : 'Not detected');

  // GitHub
  const githubMatch = text.match(/(?:github\.com\/|github:\s*)([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? `github.com/${githubMatch[1]}` : (text.toLowerCase().includes('github') ? 'GitHub detected' : 'Not detected');

  // Portfolio
  const portfolioMatch = text.match(/https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|me|io|com|org|app)[^\s]*)/i);
  let portfolio = 'Not detected';
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    portfolio = portfolioMatch[0];
  }

  // Location (e.g., "City, State", "New York, NY", "London, UK", "Bengaluru, India")
  const locationMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))\b/);
  const location = locationMatch ? locationMatch[1] : 'Not detected';

  // Candidate Name: first 1-3 lines usually contain the person's name
  let name = 'Not detected';
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    const line = lines[i];
    // Candidate name is usually 2-4 capitalized words, no email or phone
    if (!line.includes('@') && !line.includes('http') && !line.match(/\d{3}/) && line.length < 40 && line.length > 2) {
      if (/^[A-Z][a-zA-Z.'-]+(\s+[A-Z][a-zA-Z.'-]+){1,3}$/.test(line)) {
        name = line;
        break;
      }
    }
  }
  if (name === 'Not detected' && lines.length > 0) {
    const firstLine = lines[0].replace(/[^a-zA-Z\s]/g, '').trim();
    if (firstLine.split(/\s+/).length >= 2 && firstLine.length < 35) {
      name = firstLine;
    }
  }

  return { name, email, phone, location, linkedin, github, portfolio };
}

/**
 * Segmentation into standard ATS Resume Sections
 */
export function segmentResumeSections(text: string): ParsedSections {
  const lines = text.split('\n');
  const personal = extractPersonalInfo(text);

  const sectionHeaders: { [key: string]: RegExp } = {
    summary: /^(summary|professional summary|executive summary|about me|career objective|profile)\b/i,
    education: /^(education|academic background|academics|qualifications|academic history)\b/i,
    experience: /^(experience|work experience|employment history|professional experience|work history)\b/i,
    projects: /^(projects|academic projects|technical projects|key projects|personal projects)\b/i,
    skills: /^(skills|technical skills|core competencies|skills & proficiencies|technologies)\b/i,
    certifications: /^(certifications|licenses|certifications & licenses|credentials)\b/i,
    achievements: /^(achievements|honors|awards|accomplishments|publications)\b/i,
  };

  const sections: Record<string, string[]> = {
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    other: [],
  };

  let currentSection = 'other';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check if line is a section header (short line, uppercase or matches section title)
    let matchedHeader = false;
    if (line.length < 40) {
      for (const [key, regex] of Object.entries(sectionHeaders)) {
        if (regex.test(line)) {
          currentSection = key;
          matchedHeader = true;
          break;
        }
      }
    }

    if (!matchedHeader) {
      sections[currentSection].push(line);
    }
  }

  // Parse Education Entries
  const educationEntries: EducationEntry[] = [];
  const eduLines = sections.education;
  for (let i = 0; i < eduLines.length; i++) {
    const l = eduLines[i];
    const degreeMatch = l.match(/\b(B\.?S\.?|B\.?Tech|B\.?E\.?|M\.?S\.?|M\.?Tech|Bachelor|Master|Ph\.?D\.?|Associate|Diploma)\b[^\n,.]*/i);
    const yearMatch = l.match(/\b(19\d{2}|20\d{2})\b/);
    const gpaMatch = l.match(/\b(GPA|CGPA|Percentage)?\s*:?\s*(\d+(\.\d+)?(\/\d+(\.\d+)?)?%?)\b/i);

    if (degreeMatch || yearMatch || l.toLowerCase().includes('university') || l.toLowerCase().includes('college')) {
      educationEntries.push({
        degree: degreeMatch ? degreeMatch[0] : 'Degree / Program',
        institution: l.replace(/\b(19\d{2}|20\d{2})\b/g, '').replace(/GPA.*$/i, '').trim() || 'University / Institution',
        year: yearMatch ? yearMatch[0] : 'Not detected',
        grade: gpaMatch ? gpaMatch[0] : 'Not detected',
      });
    }
  }

  // Parse Experience Entries
  const experienceEntries: ExperienceEntry[] = [];
  const expLines = sections.experience;
  let curExp: ExperienceEntry | null = null;

  for (const l of expLines) {
    // Detect company/role header line
    const isHeaderLine = l.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|\d{4}\s*-\s*\d{4})\b/i) ||
      l.includes('|') ||
      (l.length < 60 && !l.startsWith('-') && !l.startsWith('•') && !l.startsWith('*'));

    if (isHeaderLine && (l.includes('-') || l.includes('|') || l.match(/\d{4}/))) {
      if (curExp) experienceEntries.push(curExp);
      const parts = l.split(/[-|–]/).map(p => p.trim());
      curExp = {
        role: parts[0] || 'Software Professional',
        company: parts[1] || 'Company / Organization',
        duration: parts.slice(2).join(' ') || 'Not detected',
        highlights: [],
      };
    } else if (curExp) {
      if (l.startsWith('-') || l.startsWith('•') || l.startsWith('*') || l.length > 20) {
        curExp.highlights.push(l.replace(/^[-•*]\s*/, ''));
      }
    }
  }
  if (curExp) experienceEntries.push(curExp);

  // Parse Projects
  const projectEntries: ProjectEntry[] = [];
  const projLines = sections.projects;
  let curProj: ProjectEntry | null = null;

  for (const l of projLines) {
    if ((l.startsWith('-') || l.startsWith('•')) && curProj) {
      curProj.description += ' ' + l.replace(/^[-•*]\s*/, '');
    } else if (l.length < 60 && !l.startsWith('-') && !l.startsWith('•')) {
      if (curProj) projectEntries.push(curProj);
      curProj = {
        name: l,
        technologies: [],
        description: '',
      };
    } else if (curProj) {
      curProj.description += ' ' + l;
    }
  }
  if (curProj) projectEntries.push(curProj);

  // Formatting & Readability Flags
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const formattingFlags = {
    hasTabularFormatting: text.includes('\t\t') || (text.match(/\|\s*\|/g) || []).length > 3,
    hasExcessiveSpecialChars: (text.match(/[■▲►▪◆●]/g) || []).length > 8,
    hasVeryLongLines: lines.some(l => l.length > 180),
    hasPossibleTwoColumns: lines.some(l => l.split(/\s{4,}/).length >= 3),
    pageCountEstimate: Math.max(1, Math.ceil(wordCount / 450)),
    wordCount,
  };

  return {
    rawText: text,
    personal,
    summary: sections.summary.join(' ') || 'Not detected',
    education: educationEntries,
    experience: experienceEntries,
    projects: projectEntries,
    skillsText: sections.skills.join(', '),
    certifications: sections.certifications,
    achievements: sections.achievements,
    formattingFlags,
  };
}
