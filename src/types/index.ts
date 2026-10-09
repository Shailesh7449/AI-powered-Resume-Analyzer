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

export interface FormattingFlags {
  hasTabularFormatting: boolean;
  hasExcessiveSpecialChars: boolean;
  hasVeryLongLines: boolean;
  hasPossibleTwoColumns: boolean;
  pageCountEstimate: number;
  wordCount: number;
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
  formattingFlags: FormattingFlags;
}

export interface CanonicalSkill {
  id: string;
  name: string;
  category: 'languages' | 'frameworks' | 'databases' | 'cloud_devops' | 'data_ml' | 'tools' | 'soft_skills' | 'concepts';
  aliases: string[];
  weight: number;
}

export interface SkillCategoryGroup {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloud_devops: string[];
  data_ml: string[];
  tools: string[];
  soft_skills: string[];
  concepts: string[];
}

export interface ScoreCategory {
  category: string;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  percentage: number;
  feedback: string;
}

export interface AtsScoreResult {
  overallScore: number;
  categoryScores: {
    structure: ScoreCategory;
    keywords: ScoreCategory;
    skillsMatch: ScoreCategory;
    experience: ScoreCategory;
    achievements: ScoreCategory;
    formatting: ScoreCategory;
    essentialInfo: ScoreCategory;
    jobAlignment: ScoreCategory;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  readability: {
    readingEase: number;
    gradeLevel: number;
    wordCount: number;
    interpretation: string;
  };
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  status: 'missing' | 'partial' | 'matched';
}

export interface JobMatchResult {
  overallMatchScore: number;
  semanticSimilarityScore: number;
  keywordMatchScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  educationMatchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  skillGapList: SkillGapItem[];
  detectedJobRole: string;
  experienceRequirementSummary: string;
  educationRequirementSummary: string;
  keywordBreakdown: {
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}

export interface RecommendedJobRole {
  roleId: string;
  roleTitle: string;
  matchPercentage: number;
  whyFits: string;
  matchedSkills: string[];
  missingSkills: string[];
  growthOutlook: string;
  salaryRange: string;
  domain?: string;
  experienceEvidence?: string;
  projectEvidence?: string;
  compatibilityBreakdown?: {
    coreSkillsPct: number;
    optionalSkillsPct: number;
    experienceAlignmentPct: number;
  };
  suggestedNextSteps?: string[];
}

export interface SectionAuditInfo {
  score: number;
  status: string;
  feedback: string;
}

export interface QualityAudit {
  readability: {
    readingEase: number;
    gradeLevel: number;
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    interpretation: string;
  };
  metrics: {
    count: number;
    examples: string[];
    densityPercentage: number;
  };
  actionVerbs: {
    detectedVerbs: string[];
    count: number;
    varietyScore: number;
  };
  stuffing: {
    isStuffingDetected: boolean;
    topRepeated: { word: string; count: number; frequency: number }[];
  };
  formattingFlags: FormattingFlags;
  sectionAnalysis: Record<string, SectionAuditInfo>;
}

export interface RealJobListing {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  postedDate?: string;
  source: string;
}

export interface LearningRoadmapItem {
  id: string;
  skillName: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  whyItMatters: string;
  currentEvidence: string;
  practicalExercise: string;
  estimatedEffort: string;
  resourceUrl: string;
  resourceTitle: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface ResumeVersion {
  id: string;
  versionName: string;
  createdAt: string;
  notes: string;
  resumeText: string;
  parsedSections: ParsedSections;
  atsScore: AtsScoreResult;
  targetJobRole?: string;
}

export interface AnalysisResponse {
  success: boolean;
  parsedSections: ParsedSections;
  skills: {
    matchedSkills: CanonicalSkill[];
    categories: SkillCategoryGroup;
    totalCount: number;
  };
  atsScore: AtsScoreResult;
  jobMatch: JobMatchResult | null;
  jobRecommendations: RecommendedJobRole[];
  qualityAudit: QualityAudit;
  keywords: {
    topKeywords: { word: string; frequency: number }[];
    isStuffingDetected: boolean;
    repeatedTerms: { word: string; count: number; frequency: number }[];
  };
  aiEnhancement?: {
    executiveSummaryAnalysis: string;
    bulletPointRewrites: {
      original: string;
      improved: string;
      rationale: string;
    }[];
    tailoringAdvice: string[];
  } | null;
  mlInsights?: {
    predictedCategory: string;
    extractedSkillsML: string[];
  } | null;
}

export interface SampleItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
}

