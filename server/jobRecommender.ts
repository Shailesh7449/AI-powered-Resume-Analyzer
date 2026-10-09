import { CanonicalSkill } from './taxonomy.js';
import { ParsedSections } from './parser.js';

export interface JobRoleProfile {
  id: string;
  title: string;
  domain: string;
  description: string;
  coreSkillIds: string[];
  optionalSkillIds: string[];
  preferredDegree: string[];
  growthOutlook: string;
  averageSalaryRange: string;
  standardNextSteps: string[];
}

export interface RecommendedJobRole {
  roleId: string;
  roleTitle: string;
  domain?: string;
  matchPercentage: number;
  whyFits: string;
  matchedSkills: string[];
  missingSkills: string[];
  growthOutlook: string;
  salaryRange: string;
  experienceEvidence?: string;
  projectEvidence?: string;
  compatibilityBreakdown?: {
    coreSkillsPct: number;
    optionalSkillsPct: number;
    experienceAlignmentPct: number;
  };
  suggestedNextSteps?: string[];
}

export const ROLE_CATALOG: JobRoleProfile[] = [
  {
    id: 'fullstack_engineer',
    title: 'Full Stack Developer',
    domain: 'Web & Full Stack',
    description: 'Builds end-to-end web applications combining responsive frontend experiences with scalable backend APIs and relational databases.',
    coreSkillIds: ['javascript', 'typescript', 'react', 'nodejs', 'html_css', 'sql', 'git'],
    optionalSkillIds: ['nextjs', 'tailwind', 'express', 'postgresql', 'docker', 'rest_api'],
    preferredDegree: ['computer science', 'software engineering', 'web development'],
    growthOutlook: 'High (High agility in startup & enterprise product squads)',
    averageSalaryRange: '$115,000 - $160,000',
    standardNextSteps: [
      'Showcase full-stack state management (Zustand/Redux) and server components in project repos',
      'Add PostgreSQL indexing or migration evidence in your work history',
      'Demonstrate end-to-end testing with Playwright or Cypress',
    ],
  },
  {
    id: 'backend_engineer',
    title: 'Backend Software Engineer',
    domain: 'Web & Full Stack',
    description: 'Architects robust microservices, server-side business logic, REST/GraphQL APIs, and database persistence layers.',
    coreSkillIds: ['nodejs', 'express', 'python', 'java', 'golang', 'postgresql', 'mysql', 'docker', 'rest_api'],
    optionalSkillIds: ['redis', 'kubernetes', 'aws', 'microservices', 'unit_testing', 'git', 'ci_cd'],
    preferredDegree: ['computer science', 'software engineering', 'information technology'],
    growthOutlook: 'Steady & High (Core infrastructure foundational demand)',
    averageSalaryRange: '$120,000 - $165,000',
    standardNextSteps: [
      'Document caching strategies with Redis for high-throughput endpoints',
      'Highlight database sharding or query profiling metrics in bullet points',
      'Add containerized Docker setup and OpenAPI/Swagger documentation',
    ],
  },
  {
    id: 'frontend_engineer',
    title: 'Frontend Software Engineer',
    domain: 'Web & Full Stack',
    description: 'Creates high-performance, accessible, and delightful user interfaces with modern client frameworks and design systems.',
    coreSkillIds: ['javascript', 'typescript', 'react', 'html_css', 'tailwind', 'git'],
    optionalSkillIds: ['nextjs', 'vue', 'webpack', 'vite', 'graphql', 'jest', 'responsive_design'],
    preferredDegree: ['computer science', 'software engineering', 'design'],
    growthOutlook: 'High (Continuous demand for interactive SaaS web applications)',
    averageSalaryRange: '$110,000 - $155,000',
    standardNextSteps: [
      'Document Web Vitals optimizations (LCP, INP, CLS) in your summary',
      'Demonstrate accessible ARIA compliance and responsive design patterns',
      'Publish a component library or interactive demo with live URL',
    ],
  },
  {
    id: 'ml_engineer',
    title: 'Machine Learning Engineer',
    domain: 'AI & Data Science',
    description: 'Designs, develops, and deploys scalable machine learning pipelines, deep learning models, and production inference systems.',
    coreSkillIds: ['python', 'machine_learning', 'deep_learning', 'pytorch', 'tensorflow', 'scikit_learn', 'docker'],
    optionalSkillIds: ['pandas', 'numpy', 'nlp', 'computer_vision', 'aws', 'ci_cd', 'spark'],
    preferredDegree: ['computer science', 'data science', 'mathematics', 'statistics', 'engineering'],
    growthOutlook: 'High (32% YoY growth in AI systems engineering)',
    averageSalaryRange: '$135,000 - $185,000',
    standardNextSteps: [
      'Highlight model latency benchmarks and quantization techniques used',
      'Demonstrate containerized deployment with Docker and Triton or TorchServe',
      'Add real dataset validation metrics (F1, AUC-ROC) to project descriptions',
    ],
  },
  {
    id: 'ai_engineer',
    title: 'Generative AI & LLM Engineer',
    domain: 'AI & Data Science',
    description: 'Develops agentic workflows, Retrieval-Augmented Generation (RAG) pipelines, and integrations with modern Large Language Models.',
    coreSkillIds: ['python', 'llm', 'machine_learning', 'deep_learning', 'nlp', 'rest_api', 'docker'],
    optionalSkillIds: ['pytorch', 'langchain', 'vector_databases', 'fastapi', 'aws'],
    preferredDegree: ['computer science', 'artificial intelligence', 'data science'],
    growthOutlook: 'Explosive (Rapid enterprise GenAI productization)',
    averageSalaryRange: '$145,000 - $195,000',
    standardNextSteps: [
      'Document RAG vector retrieval pipelines (Pinecone/Milvus/Chroma)',
      'Detail prompt evaluation, guardrails, and token-cost optimization practices',
      'Highlight real tool-calling agent implementations',
    ],
  },
  {
    id: 'data_scientist',
    title: 'Data Scientist',
    domain: 'AI & Data Science',
    description: 'Uncovers insights from complex datasets using statistical modeling, hypothesis testing, exploratory analysis, and predictive models.',
    coreSkillIds: ['python', 'r', 'sql', 'pandas', 'numpy', 'scikit_learn', 'machine_learning'],
    optionalSkillIds: ['tableau', 'power_bi', 'spark', 'data_modeling', 'deep_learning'],
    preferredDegree: ['data science', 'statistics', 'mathematics', 'computer science'],
    growthOutlook: 'Very High (Analytical decision-making demand)',
    averageSalaryRange: '$125,000 - $170,000',
    standardNextSteps: [
      'Quantify business revenue impact or churn reduction from models',
      'Demonstrate rigorous A/B testing statistical methodology',
      'Include end-to-end exploratory analysis notebook on GitHub',
    ],
  },
  {
    id: 'data_engineer',
    title: 'Data Engineer',
    domain: 'AI & Data Science',
    description: 'Constructs reliable data pipelines, automated ETL/ELT workflows, data warehouses, and distributed big data architectures.',
    coreSkillIds: ['python', 'sql', 'spark', 'data_modeling', 'postgresql', 'aws', 'docker'],
    optionalSkillIds: ['hadoop', 'airflow', 'dbt', 'gcp', 'kafka', 'redis'],
    preferredDegree: ['computer science', 'data engineering', 'information systems'],
    growthOutlook: 'Very High (Foundation for all enterprise AI & analytics)',
    averageSalaryRange: '$130,000 - $175,000',
    standardNextSteps: [
      'Detail Airflow DAG automation and data transformation with dbt',
      'Highlight streaming event ingestion pipelines with Kafka or Kinesis',
      'Document data lakehouse or Snowflake/BigQuery partitioning',
    ],
  },
  {
    id: 'devops_cloud_engineer',
    title: 'DevOps & Cloud Engineer',
    domain: 'Cloud & Infrastructure',
    description: 'Automates deployment pipelines, provisions infrastructure as code (IaC), and manages resilient cloud infrastructure.',
    coreSkillIds: ['aws', 'docker', 'kubernetes', 'terraform', 'ci_cd', 'linux', 'bash'],
    optionalSkillIds: ['azure', 'gcp', 'ansible', 'git', 'python', 'microservices'],
    preferredDegree: ['computer science', 'systems engineering', 'information systems'],
    growthOutlook: 'High (Cloud migration and platform engineering)',
    averageSalaryRange: '$130,000 - $175,000',
    standardNextSteps: [
      'Include Infrastructure as Code (Terraform) repos with multi-region modules',
      'Document zero-downtime rolling deployments and blue/green patterns',
      'Showcase Prometheus/Grafana observability setup',
    ],
  },
  {
    id: 'sre_engineer',
    title: 'Site Reliability Engineer (SRE)',
    domain: 'Cloud & Infrastructure',
    description: 'Bridges software engineering and systems operations to maximize uptime, error budgeting, incident response, and performance.',
    coreSkillIds: ['linux', 'kubernetes', 'docker', 'python', 'golang', 'ci_cd', 'bash'],
    optionalSkillIds: ['aws', 'terraform', 'monitoring', 'incident_management', 'distributed_systems'],
    preferredDegree: ['computer science', 'computer engineering'],
    growthOutlook: 'High (Critical focus on mission-critical system resilience)',
    averageSalaryRange: '$135,000 - $180,000',
    standardNextSteps: [
      'Specify SLI/SLO definitions and error budgets managed in previous roles',
      'Highlight chaos engineering experiments or automated failover setups',
      'Detail post-mortem documentation and on-call automation tooling',
    ],
  },
  {
    id: 'security_engineer',
    title: 'Cybersecurity & Application Security Engineer',
    domain: 'Security & Systems',
    description: 'Safeguards applications, cloud perimeters, and data flows against vulnerabilities through threat modeling and DevSecOps.',
    coreSkillIds: ['linux', 'networking', 'python', 'docker', 'cloud_security', 'git'],
    optionalSkillIds: ['aws', 'penetration_testing', 'owasp', 'cryptography', 'ci_cd'],
    preferredDegree: ['cybersecurity', 'computer science', 'information assurance'],
    growthOutlook: 'Very High (Rising regulatory compliance and threat landscape)',
    averageSalaryRange: '$130,000 - $180,000',
    standardNextSteps: [
      'Demonstrate automated SAST/DAST pipeline scanning integration in CI/CD',
      'Highlight remediation of OWASP Top 10 vulnerabilities in work history',
      'Obtain or feature relevant certs (CompTIA Security+, CISSP, AWS Security)',
    ],
  },
  {
    id: 'mobile_engineer',
    title: 'Mobile Application Developer',
    domain: 'Mobile & Systems',
    description: 'Designs and builds intuitive native and cross-platform mobile apps for iOS and Android devices.',
    coreSkillIds: ['javascript', 'typescript', 'react_native', 'mobile_development', 'git'],
    optionalSkillIds: ['swift', 'kotlin', 'flutter', 'rest_api', 'redux'],
    preferredDegree: ['computer science', 'software engineering'],
    growthOutlook: 'Steady (Continuous enterprise consumer app investments)',
    averageSalaryRange: '$115,000 - $160,000',
    standardNextSteps: [
      'Provide App Store / Google Play links or TestFlight preview links',
      'Highlight offline-first persistence with SQLite/WatermelonDB',
      'Document memory profiling and 60fps frame rate optimizations',
    ],
  },
  {
    id: 'qa_automation_engineer',
    title: 'QA & Test Automation Engineer',
    domain: 'Web & Full Stack',
    description: 'Architects robust end-to-end automated testing suites, integration tests, and quality gates across releases.',
    coreSkillIds: ['python', 'javascript', 'typescript', 'selenium', 'cypress', 'git', 'ci_cd'],
    optionalSkillIds: ['playwright', 'jest', 'postman', 'docker', 'rest_api'],
    preferredDegree: ['computer science', 'software engineering', 'information systems'],
    growthOutlook: 'Steady (Continuous delivery quality assurance reliance)',
    averageSalaryRange: '$95,000 - $140,000',
    standardNextSteps: [
      'Document percentage test coverage achieved (unit, integration, e2e)',
      'Detail regression test run time reduction through parallelization',
      'Highlight API contract testing automation in CI pipelines',
    ],
  },
];

/**
 * Recommends matched job roles dynamically based on skills, education, work experience, and project evidence
 */
export function recommendJobRoles(
  parsed: ParsedSections,
  resumeSkills: CanonicalSkill[]
): RecommendedJobRole[] {
  const resumeSkillIds = new Set(resumeSkills.map(s => s.id));
  const resumeTextLower = parsed.rawText.toLowerCase();

  const recommendations: RecommendedJobRole[] = [];

  for (const role of ROLE_CATALOG) {
    const matchedCore = role.coreSkillIds.filter(id => resumeSkillIds.has(id));
    const matchedOptional = role.optionalSkillIds.filter(id => resumeSkillIds.has(id));
    const missingCore = role.coreSkillIds.filter(id => !resumeSkillIds.has(id));

    // Core skill weight = 60%, optional = 20%
    const coreSkillsPct = Math.round((matchedCore.length / (role.coreSkillIds.length || 1)) * 100);
    const optionalSkillsPct = Math.round((matchedOptional.length / (role.optionalSkillIds.length || 1)) * 100);

    const coreScore = (coreSkillsPct / 100) * 60;
    const optionalScore = (optionalSkillsPct / 100) * 20;

    // Work Experience evidence extraction
    let expAlignmentScore = 0;
    let experienceEvidence = '';
    const relevantExpRoles = parsed.experience.filter(exp => {
      const expText = `${exp.role} ${exp.company} ${exp.highlights.join(' ')}`.toLowerCase();
      return role.coreSkillIds.some(sk => expText.includes(sk.replace('_', ' '))) ||
        expText.includes(role.title.toLowerCase()) ||
        expText.includes(role.domain.toLowerCase());
    });

    if (relevantExpRoles.length > 0) {
      expAlignmentScore = Math.min(15, relevantExpRoles.length * 8);
      const topRole = relevantExpRoles[0];
      experienceEvidence = `${topRole.role} at ${topRole.company} (${topRole.duration})`;
    } else {
      experienceEvidence = 'Foundational skills match; no past role title explicitly matched this domain.';
    }

    // Project relevance evidence
    let projectRelevance = 0;
    let projectEvidence = '';
    const matchingProject = parsed.projects.find(p => {
      const pText = `${p.name} ${p.description} ${p.technologies.join(' ')}`.toLowerCase();
      return role.coreSkillIds.some(sk => pText.includes(sk.replace('_', ' '))) ||
        pText.includes(role.id.replace('_', ' '));
    });

    if (matchingProject) {
      projectRelevance = 5;
      projectEvidence = `Project "${matchingProject.name}": ${matchingProject.description.slice(0, 80)}...`;
    }

    const totalRaw = Math.min(98, Math.round(coreScore + optionalScore + expAlignmentScore + projectRelevance));

    // Convert skill IDs to formatted names
    const matchedSkillNames = [...matchedCore, ...matchedOptional].map(id => {
      const match = resumeSkills.find(s => s.id === id);
      return match ? match.name : id.replace('_', ' ');
    });

    const missingSkillNames = missingCore.slice(0, 4).map(id => {
      const match = resumeSkills.find(s => s.id === id);
      return match ? match.name : id.replace('_', ' ');
    });

    let whyFits = `Matches ${matchedCore.length} of ${role.coreSkillIds.length} core technical requirements for ${role.title}.`;
    if (matchedSkillNames.length > 0) {
      whyFits += ` Key competencies in ${matchedSkillNames.slice(0, 3).join(', ')} directly support this position.`;
    }

    recommendations.push({
      roleId: role.id,
      roleTitle: role.title,
      domain: role.domain,
      matchPercentage: Math.max(25, totalRaw),
      whyFits,
      matchedSkills: matchedSkillNames,
      missingSkills: missingSkillNames,
      growthOutlook: role.growthOutlook,
      salaryRange: role.averageSalaryRange,
      experienceEvidence,
      projectEvidence: projectEvidence || undefined,
      compatibilityBreakdown: {
        coreSkillsPct,
        optionalSkillsPct,
        experienceAlignmentPct: Math.round((expAlignmentScore / 15) * 100),
      },
      suggestedNextSteps: role.standardNextSteps,
    });
  }

  // Sort by highest match percentage descending
  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
