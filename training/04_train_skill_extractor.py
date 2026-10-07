import os
import pandas as pd
import json
import joblib
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
EVAL_DIR = os.path.join(BASE_DIR, 'evaluation')

def load_data():
    train_df = pd.read_csv(os.path.join(DATA_DIR, 'train_skills.csv'))
    val_df = pd.read_csv(os.path.join(DATA_DIR, 'val_skills.csv'))
    test_df = pd.read_csv(os.path.join(DATA_DIR, 'test_skills.csv'))
    return train_df.dropna(), val_df.dropna(), test_df.dropna()

def plot_confusion_matrix(y_true, y_pred, labels, title, filename):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title(title)
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.tight_layout()
    plt.savefig(os.path.join(EVAL_DIR, filename))
    plt.close()

def evaluate_model(model_name, model, X_test, y_test):
    start_time = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start_time
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='binary', zero_division=0)
    rec = recall_score(y_test, y_pred, average='binary', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='binary', zero_division=0)
    
    print(f"[{model_name}] Accuracy: {acc:.4f} | F1: {f1:.4f}")
    
    plot_confusion_matrix(y_test, y_pred, [0, 1], f"Confusion Matrix: {model_name}", f"{model_name.replace(' ', '_').lower()}_cm.png")
    
    return {
        "model": model_name,
        "task": "Skill Classification",
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "inference_time_seconds": inference_time
    }

def train_skills():
    print("Loading skill data...")
    train_df, val_df, test_df = load_data()
        
    tfidf = TfidfVectorizer(max_features=5000, analyzer='char_wb', ngram_range=(2, 5))
    
    X_train = tfidf.fit_transform(train_df['text'])
    y_train = train_df['label']
    
    X_test = tfidf.transform(test_df['text'])
    y_test = test_df['label']
    
    results = []
    
    print("Training Logistic Regression for Skills...")
    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train, y_train)
    res_lr = evaluate_model("Skill TF-IDF LR", lr, X_test, y_test)
    results.append(res_lr)
    
    print("Training Random Forest for Skills...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    res_rf = evaluate_model("Skill TF-IDF RF", rf, X_test, y_test)
    results.append(res_rf)
    
    best_model = rf if res_rf['f1_score'] > res_lr['f1_score'] else lr
    
    joblib.dump(tfidf, os.path.join(MODELS_DIR, 'skill_tfidf_vectorizer.joblib'))
    joblib.dump(best_model, os.path.join(MODELS_DIR, 'skill_classifier.joblib'))
    
    with open(os.path.join(EVAL_DIR, 'skill_extraction_report.json'), 'w') as f:
        json.dump(results, f, indent=4)
        
    print("Skill training complete.")

if __name__ == '__main__':
    train_skills()
