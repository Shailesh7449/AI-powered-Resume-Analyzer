import os
import pandas as pd
from sklearn.model_selection import train_test_split
import random

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'datasets')
os.makedirs(DATA_DIR, exist_ok=True)

KNOWN_SKILLS = [
    "javascript", "typescript", "python", "java", "c++", "c#", "ruby", "php", "swift", "kotlin", "go", "rust",
    "react", "angular", "vue", "node.js", "express", "django", "flask", "spring", "ruby on rails", "laravel",
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "oracle",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "gitlab ci", "github actions",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "scikit-learn", "pandas",
    "data analysis", "data engineering", "big data", "hadoop", "spark", "kafka",
    "agile", "scrum", "kanban", "jira", "confluence", "git", "svn", "mercurial",
    "html", "css", "sass", "less", "bootstrap", "tailwind", "material-ui", "figma", "sketch", "adobe xd",
    "linux", "unix", "windows", "macos", "bash", "powershell", "shell scripting",
    "leadership", "communication", "teamwork", "problem solving", "time management", "project management"
]

NEGATIVE_SAMPLES = [
    "I am highly motivated and hardworking.",
    "Graduated with honors in 2018.",
    "Responsible for managing daily operations.",
    "Excellent written and verbal abilities.",
    "Worked at Google as a software engineer.",
    "Developed new features for the main product.",
    "Led a team of five members.",
    "Participated in weekly stand-ups.",
    "Bachelor of Science in Engineering.",
    "Seeking a challenging position in a dynamic company.",
    "Hobbies include reading and traveling.",
    "Managed a budget of over one million dollars.",
    "Presented findings to the executive board.",
    "Won the employee of the month award.",
    "Volunteered at the local food bank.",
    "References available upon request.",
    "Can start immediately.",
    "I believe I am a great fit for this role."
] * 10 # Duplicate to have enough samples

def prep_skill_dataset():
    print("Generating skill extraction dataset...")
    skills_data = []
    
    for skill in KNOWN_SKILLS:
        skills_data.append({"text": skill, "label": 1})
        skills_data.append({"text": f"proficient in {skill}", "label": 1})
        skills_data.append({"text": f"used {skill} for development", "label": 1})
        
    for text in set(NEGATIVE_SAMPLES):
        skills_data.append({"text": text, "label": 0})
        # Generate variations
        words = text.split()
        if len(words) > 3:
            skills_data.append({"text": " ".join(words[:3]), "label": 0})
            skills_data.append({"text": " ".join(words[-3:]), "label": 0})
            
    # Add generic noise
    for _ in range(100):
        skills_data.append({"text": f"worked for {random.randint(2, 10)} years", "label": 0})
            
    skill_df = pd.DataFrame(skills_data).drop_duplicates()
    
    # Balance
    min_class = skill_df['label'].value_counts().min()
    skill_df = skill_df.groupby('label').sample(n=min_class, random_state=42)
    print(f"Balanced Skill Dataset size: {skill_df.shape}")
    
    train_df, temp_df = train_test_split(skill_df, test_size=0.30, random_state=42, stratify=skill_df['label'])
    val_df, test_df = train_test_split(temp_df, test_size=0.50, random_state=42, stratify=temp_df['label'])
    
    train_df.to_csv(os.path.join(DATA_DIR, 'train_skills.csv'), index=False)
    val_df.to_csv(os.path.join(DATA_DIR, 'val_skills.csv'), index=False)
    test_df.to_csv(os.path.join(DATA_DIR, 'test_skills.csv'), index=False)
    print("Saved skill dataset.")

if __name__ == '__main__':
    prep_skill_dataset()
