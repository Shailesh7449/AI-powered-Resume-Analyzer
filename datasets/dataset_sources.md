# Dataset Sources

This document outlines the publicly available datasets used for training the ML models in ResumeAI. All datasets allow research/educational usage.

## 1. Resume Category Classification Dataset
- **Dataset Name:** `Saba06huggingface/resume_dataset`
- **Source URL:** https://huggingface.co/datasets/Saba06huggingface/resume_dataset
- **License:** Open (Research/Educational)
- **Number of Samples:** ~2,400+
- **Available Labels:** 24 job categories (e.g., Data Scientist, HR, Advocate, Arts, Web Designing)
- **Fields/Features:** `Resume_str` (raw text), `Category` (target label)
- **Intended ML Task:** Multi-class Resume Classification & Job Category Prediction

## 2. Skill Extraction NER Dataset
- **Dataset Name:** `EmanZ/Resume-NER`
- **Source URL:** https://huggingface.co/datasets/EmanZ/Resume-NER
- **License:** MIT / Open
- **Number of Samples:** ~220
- **Available Labels:** Skills, Degree, Companies, etc.
- **Fields/Features:** Tokens and NER tags (BIO format)
- **Intended ML Task:** Token classification/NER for extracting technical skills.

## 3. Job Description Dataset
- **Dataset Name:** `jacob-hugging-face/job-descriptions`
- **Source URL:** https://huggingface.co/datasets/jacob-hugging-face/job-descriptions
- **License:** MIT
- **Number of Samples:** ~850
- **Available Labels:** Job Title, Company, Description
- **Fields/Features:** `job_description`, `position_title`
- **Intended ML Task:** Job Role Semantic Matching and Vector Space embedding baselines.
