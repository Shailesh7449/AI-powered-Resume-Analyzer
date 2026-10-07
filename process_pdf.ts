import fs from 'fs';
import path from 'path';
import { extractDocumentText, segmentResumeSections } from './server/parser.js';
import { extractAllTaxonomySkills } from './server/taxonomy.js';
import { calculateAtsScore, DEFAULT_WEIGHTS } from './server/atsScorer.js';
import { recommendJobRoles } from './server/jobRecommender.js';
import { runMLTask } from './server/mlService.js';
import {
  tokenize,
  computeReadability,
  detectQuantifiableMetrics,
  analyzeActionVerbs,
  detectKeywordStuffing,
  computeTF,
} from './server/nlp.js';

async function processUserPdf() {
  const filePath = String.raw`C:\Users\DELL\Downloads\Sanjay_Gedela.pdf`;
  console.log(`Processing: ${filePath}`);
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    console.log(`File read successfully, size: ${fileBuffer.length} bytes`);
    
    const extractedText = await extractDocumentText(fileBuffer, 'application/pdf', 'Sanjay_Gedela.pdf');
    console.log(`Extracted Text Length: ${extractedText.length}`);
    
    const cleaned = extractedText.trim();
    const parsedSections = segmentResumeSections(cleaned);
    const { matchedSkills, categories: skillCategories } = extractAllTaxonomySkills(cleaned);
    
    // NLP Metrics
    const readability = computeReadability(cleaned);
    const metrics = detectQuantifiableMetrics(cleaned);
    const actionVerbs = analyzeActionVerbs(cleaned);
    const tokens = tokenize(cleaned, true);
    const stuffing = detectKeywordStuffing(tokens);
    const termFreq = computeTF(tokens);
    
    const atsScoreResult = calculateAtsScore(parsedSections, matchedSkills, 4.0, DEFAULT_WEIGHTS);
    const jobRecommendations = recommendJobRoles(parsedSections, matchedSkills);
    
    // ML Enhancements
    const mlClassification = await runMLTask('classify_resume', { text: cleaned });
    const mlSkills = await runMLTask('extract_skills', { phrases: tokens });
    
    const mlInsights = {
      predictedCategory: mlClassification?.category || 'Unknown',
      extractedSkillsML: mlSkills?.skills || []
    };
    
    const finalResult = {
      parsedSections,
      skills: { matchedSkills, categories: skillCategories },
      atsScoreResult,
      jobRecommendations,
      mlInsights
    };
    
    fs.writeFileSync('C:/Users/DELL/.gemini/antigravity-ide/brain/386ea2d1-b3f5-40b7-9a89-18398c5862a2/sanjay_gedela_analysis.json', JSON.stringify(finalResult, null, 2));
    console.log("Analysis saved to artifacts!");
    
  } catch (err) {
    console.error('Error processing PDF:', err);
  }
}

processUserPdf();
