# ResumeAI — AI-Powered Resume Analysis, ATS Scoring & Job Recommendation System

<p align="center">

**Analyze your resume. Improve your ATS score. Find the right career opportunities.**

An AI/ML-powered resume analysis platform that evaluates resumes, performs ATS-style scoring, matches candidates with job descriptions, identifies skill gaps, and recommends suitable job roles.

</p>

---

## 🚀 Overview

**ResumeAI** is an intelligent resume analysis and career recommendation system built using **Machine Learning, Natural Language Processing (NLP), and semantic similarity techniques**.

The platform allows users to upload a resume and receive a detailed analysis of their:

- Resume quality
- ATS compatibility
- Skills
- Experience
- Education
- Projects
- Certifications
- Keywords
- Job compatibility
- Missing skills
- Career opportunities

Users can also provide a **Job Description (JD)** to determine how well their resume matches a specific job.

The project is designed as both:

1. A **real-world free ATS resume analysis platform**
2. An **academic ML/NLP project** suitable for experimentation, evaluation, and future research.

---

## 🎯 Project Objectives

The main objectives of ResumeAI are:

- Automatically extract useful information from resumes.
- Analyze resumes using NLP and Machine Learning.
- Provide an estimated ATS compatibility score.
- Compare resumes against job descriptions.
- Identify matching and missing skills.
- Perform skill-gap analysis.
- Recommend suitable job roles.
- Identify important missing keywords.
- Provide actionable resume improvement suggestions.
- Build an extensible ML pipeline for future research.

---

## ✨ Key Features

### 📄 Resume Analysis

Upload your resume in:

- PDF
- DOCX

The system extracts:

- Name
- Email
- Phone
- Location
- LinkedIn
- GitHub
- Portfolio
- Education
- Work experience
- Projects
- Skills
- Certifications
- Achievements
- Publications

---

### 📊 Free ATS Score

ResumeAI provides a **free estimated ATS compatibility score from 0–100**.

The score considers multiple measurable factors:

| Component | Weight |
|---|---:|
| Resume Structure | 15 |
| Keyword Optimization | 20 |
| Skills Match | 20 |
| Experience Relevance | 15 |
| Quantifiable Achievements | 10 |
| Formatting & Readability | 10 |
| Essential Information | 5 |
| Job Description Alignment | 5 |
| **Total** | **100** |

> **Important:** ResumeAI's score is an estimated compatibility score and does not represent the exact scoring algorithm of any particular company's ATS.

---

## 🎯 Job Description Matching

Users can paste a Job Description and compare it against their resume.

The system analyzes:

- Required skills
- Preferred skills
- Technologies
- Qualifications
- Experience
- Responsibilities
- Important keywords

It then calculates a **Resume–Job Match Score**.

Example:

```text
Resume–Job Match: 82%

Matching Skills
✓ Python
✓ SQL
✓ Machine Learning
✓ Pandas
✓ Data Analysis

Missing Skills
✗ AWS
✗ Docker
✗ Power BI

Partial Matches
~ Cloud Computing
~ Data Engineering
```

---

## 🧠 Skill Gap Analysis

ResumeAI identifies the difference between the candidate's existing skills and the skills required by the target job.

### Skill categories

- Strong Skills
- Matching Skills
- Missing Skills
- Recommended Skills

Each missing skill can be assigned a priority:

```text
HIGH
MEDIUM
LOW
```

This helps candidates understand exactly what they should learn to improve their job compatibility.

---

## 💼 Job Recommendations

ResumeAI recommends suitable career roles based on:

- Skills
- Education
- Experience
- Projects
- Technologies
- Semantic similarity
- Job-role requirements

Possible recommendations include:

- Data Analyst
- Data Scientist
- Machine Learning Engineer
- AI Engineer
- Data Engineer
- Software Developer
- Backend Developer
- Business Analyst

Each recommendation includes:

- Job role
- Match percentage
- Relevant skills
- Missing skills
- Reason for recommendation

---

## 🔍 Keyword Analysis

The system analyzes resume keywords and identifies:

- Detected keywords
- Missing keywords
- Important job-specific keywords
- Repeated keywords
- Potential keyword stuffing

This helps improve resume visibility in automated screening systems.

---

## 📝 Resume Quality Analysis

ResumeAI evaluates important resume characteristics such as:

- Section organization
- Resume length
- Bullet point quality
- Action verbs
- Quantifiable achievements
- Repeated information
- Grammar/readability
- Contact information
- Broken links
- Date consistency
- Excessive formatting
- ATS-unfriendly elements

The system provides actionable suggestions instead of simply giving a score.

---

# 🧠 Machine Learning & NLP Pipeline

The core architecture follows:

```text
                ┌─────────────────┐
                │     Resume      │
                │   PDF / DOCX    │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Document Parser  │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Text Processing  │
                │   & Cleaning     │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Section Detection│
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Skill / Entity   │
                │    Extraction    │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Skill            │
                │ Normalization    │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Resume           │
                │ Representation   │
                └────────┬────────┘
                         ↓
          ┌──────────────┴──────────────┐
          ↓                             ↓
   Resume Embedding              Job Description
                                      Embedding
          │                             │
          └──────────────┬──────────────┘
                         ↓
                ┌─────────────────┐
                │ Semantic         │
                │ Similarity       │
                └────────┬────────┘
                         ↓
                ┌─────────────────┐
                │ Resume–Job       │
                │ Matching         │
                └────────┬────────┘
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   ATS Score        Skill Gap       Job Recommendation
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                ┌─────────────────┐
                │ Recommendations │
                │ & Final Report  │
                └─────────────────┘
```

---

# 🤖 Technologies

## Frontend

- HTML
- CSS
- JavaScript
- Responsive UI
- Modern dashboard components

## Backend

- Python
- FastAPI
- REST APIs

## Machine Learning

- Scikit-learn
- TF-IDF
- Classification algorithms
- Similarity algorithms
- Recommendation algorithms

## NLP

- NLTK / spaCy
- Sentence Transformers
- BERT-based embeddings
- Named Entity Recognition
- Text preprocessing
- Semantic similarity

## Document Processing

- PDF text extraction
- DOCX parsing

## Database

Designed to support:

- SQLite
- PostgreSQL
- Other relational databases

---

# 📂 Project Structure

```text
ResumeAI/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── requirements.txt
│   └── tests/
│
├── ml/
│   ├── preprocessing/
│   ├── feature_extraction/
│   ├── skill_extraction/
│   ├── embeddings/
│   ├── classification/
│   ├── matching/
│   ├── recommendation/
│   └── evaluation/
│
├── datasets/
│   ├── resumes/
│   ├── job_descriptions/
│   ├── skills/
│   ├── job_roles/
│   └── matching/
│
├── models/
│
├── notebooks/
│   ├── data_analysis/
│   ├── model_training/
│   └── evaluation/
│
├── reports/
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

---

# 📊 Datasets

The project is designed to work with publicly available datasets related to:

### Resume datasets

Used for:

- Resume classification
- Information extraction
- Skill identification

### Job Description datasets

Used for:

- Job-role analysis
- Required skill extraction
- Job classification

### Skill Taxonomies

Possible sources include:

- ESCO
- O*NET
- Custom skill taxonomy

### Resume–Job Matching Data

Used for:

- Candidate-job matching
- Similarity evaluation
- Recommendation models

> Dataset licenses and usage restrictions should always be checked before redistribution.

---

# 🧪 Model Evaluation

Different components of the system can be evaluated using appropriate metrics.

### Classification

```text
Accuracy
Precision
Recall
F1-Score
ROC-AUC
```

### Recommendation

```text
Precision@K
Recall@K
MRR
NDCG
```

### Similarity

```text
Cosine Similarity
Semantic Similarity
```

### Skill Extraction

```text
Precision
Recall
F1-Score
```

The project separates model training and evaluation from the production application.

---

# 🔬 Research & Academic Scope

ResumeAI is designed as an academic Machine Learning/NLP project.

Potential research areas include:

- Transformer-based resume understanding
- Semantic resume-job matching
- Explainable job recommendations
- Skill-gap prediction
- Personalized career recommendations
- Resume ranking
- Bias and fairness in automated recruitment
- Multilingual resume analysis

Future research can investigate whether semantic models outperform traditional keyword-based matching.

---

# 🔐 Privacy

Resumes may contain sensitive personal information.

ResumeAI follows a privacy-first architecture.

By default:

- Uploaded resumes should not be permanently stored.
- Temporary files should be deleted after processing.
- API keys must never be exposed to the frontend.
- User resumes must not be publicly accessible.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ResumeAI.git

cd ResumeAI
```

## 2. Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## 3. Environment Variables

Create:

```text
.env
```

Example:

```env
ENVIRONMENT=development
API_BASE_URL=http://localhost:8000
DATABASE_URL=sqlite:///./resumeai.db
AI_API_KEY=your_api_key_here
```

Never commit `.env` to GitHub.

---

# ▶️ Running the Backend

```bash
uvicorn backend.app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# ▶️ Running the Frontend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The frontend will be available at the development URL shown by the frontend framework.

---

# 🌐 Deployment

## Frontend

The frontend can be deployed using:

- Vercel
- Netlify
- Similar frontend hosting platforms

## Backend

The FastAPI backend can be deployed using:

- Render
- Railway
- AWS
- Google Cloud
- Azure

Production configuration must use environment variables.

Do not hardcode:

```text
localhost
API keys
database credentials
private URLs
```

---

# 🧪 Testing

The project should test:

- Resume PDF parsing
- DOCX parsing
- Skill extraction
- Resume classification
- ATS score calculation
- Job description extraction
- Resume-job matching
- Skill-gap analysis
- Job recommendation
- API validation
- Invalid files
- Empty resumes
- Large files
- AI/API failures

Run tests using:

```bash
pytest
```

---

# 📈 Future Enhancements

Potential future improvements include:

- 🔹 Multilingual resume analysis
- 🔹 Voice-based resume creation
- 🔹 AI resume rewriting
- 🔹 Personalized learning roadmap
- 🔹 Career path prediction
- 🔹 Recruiter dashboard
- 🔹 Candidate ranking
- 🔹 Explainable AI
- 🔹 Bias and fairness detection
- 🔹 LinkedIn profile analysis
- 🔹 Resume version comparison
- 🔹 Interview preparation based on resume
- 🔹 Personalized job alerts

---

# ⚠️ Disclaimer

ResumeAI provides an **estimated ATS compatibility score** for informational and career-development purposes.

ATS systems differ between companies and software vendors. A score generated by ResumeAI does not guarantee that a resume will pass any particular employer's ATS or recruitment process.

The platform should be used as a resume-improvement and career-guidance tool.

---

# 👨‍💻 Project

**Project:** AI-Powered Resume Analysis, ATS Scoring & Job Recommendation System

**Domain:** Machine Learning / Natural Language Processing / Artificial Intelligence

**Primary Technologies:** Python, FastAPI, NLP, Machine Learning, Semantic Similarity

**Application:** Resume Analysis, ATS Scoring, Job Matching & Career Recommendation

---

# ⭐ Why ResumeAI?

ResumeAI combines traditional resume analysis with modern NLP and Machine Learning techniques to move beyond simple keyword matching.

Instead of only asking:

> "Does this resume contain the required keyword?"

ResumeAI aims to answer:

> **"How well does this candidate's overall profile match this job, what skills are missing, and what should the candidate improve?"**

---

## 📌 Project Workflow

```text
Upload Resume
      ↓
Extract Resume Content
      ↓
Analyze Resume
      ↓
Generate Free ATS Score
      ↓
Extract Skills & Keywords
      ↓
Enter Job Description
      ↓
Analyze Job Requirements
      ↓
Calculate Resume–Job Match
      ↓
Identify Skill Gaps
      ↓
Recommend Suitable Roles
      ↓
Generate Improvement Suggestions
      ↓
Download Detailed Report
```

---

<p align="center">

### ResumeAI
**Understand your resume. Improve your profile. Find better opportunities.**

</p>
