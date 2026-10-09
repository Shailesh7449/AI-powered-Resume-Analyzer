import assert from 'assert';
import { extractAllTaxonomySkills, SKILL_TAXONOMY, lookupCanonicalSkill } from '../server/taxonomy.js';
import { segmentResumeSections, extractPersonalInfo } from '../server/parser.js';
import { calculateAtsScore, DEFAULT_WEIGHTS } from '../server/atsScorer.js';
import { matchResumeWithJob, parseJobDescription } from '../server/jobMatcher.js';
import { recommendJobRoles } from '../server/jobRecommender.js';
import { runAcademicBenchmarks } from '../server/academicMetrics.js';
import { SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../server/sampleData.js';
import { tokenize, computeReadability, computeCosineSimilarity, computeTF } from '../server/nlp.js';

console.log('--- Starting ResumeAI Comprehensive Unit & Integration Test Suite ---');

// Test 1: Taxonomy & Skill Normalization
console.log('1. Testing Skill Taxonomy & Normalization...');
const skill1 = lookupCanonicalSkill('python 3');
assert(skill1 && skill1.name === 'Python', 'Expected "python 3" to map to "Python"');

const skill2 = lookupCanonicalSkill('amazon web services');
assert(skill2 && skill2.name === 'AWS', 'Expected "amazon web services" to map to "AWS"');

const skill3 = lookupCanonicalSkill('k8s');
assert(skill3 && skill3.name === 'Kubernetes', 'Expected "k8s" to map to "Kubernetes"');

const extracted = extractAllTaxonomySkills('We engineered high-throughput services using Python, Docker, PostgreSQL and React.');
const names = extracted.matchedSkills.map(s => s.name);
assert(names.includes('Python'), 'Expected Python to be extracted');
assert(names.includes('Docker'), 'Expected Docker to be extracted');
assert(names.includes('PostgreSQL'), 'Expected PostgreSQL to be extracted');
assert(names.includes('React'), 'Expected React to be extracted');
console.log('   ✓ Skill normalization and taxonomy extraction passed.');

// Test 2: Section Segmentation & Entity Extraction
console.log('2. Testing Section Segmentation & Named Entity Extraction...');
const sampleResume = SAMPLE_RESUMES[0].content;
const parsed = segmentResumeSections(sampleResume);

assert(parsed.personal.name !== 'Not detected', 'Expected candidate name to be detected');
assert(parsed.personal.email.includes('@'), 'Expected email to be detected');
assert(parsed.education.length > 0, 'Expected education entries to be parsed');
assert(parsed.experience.length > 0, 'Expected work experience entries to be parsed');
console.log(`   ✓ Candidate "${parsed.personal.name}" parsed (${parsed.experience.length} roles, ${parsed.education.length} degrees).`);

// Test 3: ATS Scorer Determinism & Bounds
console.log('3. Testing ATS Scoring Engine...');
const atsResult = calculateAtsScore(parsed, extracted.matchedSkills, 4.0, DEFAULT_WEIGHTS);
assert(atsResult.overallScore >= 0 && atsResult.overallScore <= 100, 'ATS Score must be between 0 and 100');
assert(atsResult.strengths.length > 0, 'Expected at least 1 strength');
assert(atsResult.recommendations.length > 0, 'Expected actionable recommendations');
console.log(`   ✓ ATS Score evaluated: ${atsResult.overallScore}/100 with ${Object.keys(atsResult.categoryScores).length} categories.`);

// Test 4: Job Matching & TF-IDF Cosine Similarity
console.log('4. Testing Job Matching & Semantic Similarity...');
const sampleJd = SAMPLE_JOB_DESCRIPTIONS[0].content;
const match = matchResumeWithJob(parsed, extracted.matchedSkills, sampleJd);
assert(match.overallMatchScore >= 20 && match.overallMatchScore <= 100, 'Match score within valid range');
assert(match.matchingSkills.length > 0, 'Expected matching skills');
assert(match.semanticSimilarityScore > 0, 'Expected non-zero semantic cosine similarity');
console.log(`   ✓ Job Match: ${match.overallMatchScore}% compatibility against "${match.detectedJobRole}".`);

// Test 5: Job Role Recommender
console.log('5. Testing Job Role Recommender Engine...');
const recommendations = recommendJobRoles(parsed, extracted.matchedSkills);
assert(recommendations.length > 0, 'Expected role recommendations');
assert(recommendations[0].matchPercentage >= recommendations[1].matchPercentage, 'Recommendations must be sorted descending');
console.log(`   ✓ Top Recommended Role: "${recommendations[0].roleTitle}" (${recommendations[0].matchPercentage}%).`);

// Test 6: Readability & NLP Metrics
console.log('6. Testing NLP Readability & Tokenizer...');
const readability = computeReadability(sampleResume);
assert(readability.readingEase > 0, 'Expected positive reading ease');
assert(readability.wordCount > 100, 'Expected valid word count');
console.log(`   ✓ Readability: Ease ${readability.readingEase}, Grade ${readability.gradeLevel}, Word Count: ${readability.wordCount}.`);

// Test 7: Academic Benchmark Evaluation
console.log('7. Testing Academic IR & Classification Benchmark Runner...');
const benchmarks = runAcademicBenchmarks();
assert(benchmarks.skillExtractionBenchmark.precision > 0, 'Expected positive benchmark precision');
assert(benchmarks.rankingBenchmark.ndcgAt5 > 0, 'Expected positive NDCG@5');
console.log(`   ✓ Benchmarks: Precision=${benchmarks.skillExtractionBenchmark.precision}, Recall=${benchmarks.skillExtractionBenchmark.recall}, F1=${benchmarks.skillExtractionBenchmark.f1Score}, NDCG@5=${benchmarks.rankingBenchmark.ndcgAt5}.`);

// Test 8: AI Career Assistant Grounded Chat & Rule Fallback
console.log('8. Testing AI Career Assistant Grounded Chat...');
import { chatWithCareerAssistant } from '../server/gemini.js';
const chatResult = await chatWithCareerAssistant(
  [{ role: 'user', content: 'Why is my ATS score low and what can I improve?' }],
  {
    candidateName: parsed.personal.name,
    atsScore: atsResult.overallScore,
    strengths: atsResult.strengths,
    weaknesses: atsResult.weaknesses,
    recommendations: atsResult.recommendations,
    skills: extracted.matchedSkills.map(s => s.name),
  }
);
assert(chatResult && typeof chatResult.reply === 'string' && chatResult.reply.length > 50, 'Expected non-empty reply');
assert(chatResult.provider === 'gemini' || chatResult.provider === 'nlp_rule_engine', 'Expected valid provider');
console.log(`   ✓ AI Career Assistant replied via [${chatResult.provider}]: ${chatResult.reply.slice(0, 60)}...`);

console.log('--- ALL 8 TEST SUITES PASSED SUCCESSFULLY ---');
