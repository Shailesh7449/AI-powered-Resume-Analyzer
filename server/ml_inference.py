import sys
import json
import joblib
import os
import traceback

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load models globally so they are cached if we keep the process open (or just load once per invocation)
try:
    resume_clf = joblib.load(os.path.join(MODELS_DIR, 'resume_classifier.joblib'))
    resume_tfidf = joblib.load(os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib'))
    
    skill_clf = joblib.load(os.path.join(MODELS_DIR, 'skill_classifier.joblib'))
    skill_tfidf = joblib.load(os.path.join(MODELS_DIR, 'skill_tfidf_vectorizer.joblib'))
except Exception as e:
    print(json.dumps({"error": f"Failed to load models: {str(e)}"}))
    sys.exit(1)

def classify_resume(text):
    X = resume_tfidf.transform([text])
    pred = resume_clf.predict(X)[0]
    return {"category": str(pred)}

def extract_skills(phrases):
    if not phrases:
        return {"skills": []}
    X = skill_tfidf.transform(phrases)
    preds = skill_clf.predict(X)
    extracted = [phrases[i] for i, p in enumerate(preds) if p == 1]
    return {"skills": extracted}

def main():
    try:
        input_data = sys.stdin.read()
        if not input_data:
            return
            
        req = json.loads(input_data)
        task = req.get('task')
        
        if task == 'classify_resume':
            res = classify_resume(req.get('text', ''))
        elif task == 'extract_skills':
            res = extract_skills(req.get('phrases', []))
        else:
            res = {"error": f"Unknown task: {task}"}
            
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))

if __name__ == '__main__':
    main()
