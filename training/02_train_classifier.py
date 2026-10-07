import os
import pandas as pd
import json
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import time

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
EVAL_DIR = os.path.join(BASE_DIR, 'evaluation')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(EVAL_DIR, exist_ok=True)

def load_data():
    train_df = pd.read_csv(os.path.join(DATA_DIR, 'train_classification.csv'))
    val_df = pd.read_csv(os.path.join(DATA_DIR, 'val_classification.csv'))
    test_df = pd.read_csv(os.path.join(DATA_DIR, 'test_classification.csv'))
    return train_df, val_df, test_df

def plot_confusion_matrix(y_true, y_pred, labels, title, filename):
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=False, cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title(title)
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.tight_layout()
    plt.savefig(os.path.join(EVAL_DIR, filename))
    plt.close()

def evaluate_model(model_name, model, X_test, y_test, labels):
    start_time = time.time()
    y_pred = model.predict(X_test)
    inference_time = time.time() - start_time
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"[{model_name}] Accuracy: {acc:.4f} | F1: {f1:.4f} | Inference: {inference_time:.4f}s")
    
    plot_confusion_matrix(y_test, y_pred, labels, f"Confusion Matrix: {model_name}", f"{model_name.replace(' ', '_').lower()}_cm.png")
    
    return {
        "model": model_name,
        "task": "Resume Classification",
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "inference_time_seconds": inference_time
    }

def train_classifiers():
    print("Loading data...")
    train_df, val_df, test_df = load_data()
    
    print("Vectorizing text using TF-IDF...")
    tfidf = TfidfVectorizer(max_features=10000, stop_words='english', ngram_range=(1, 2))
    
    X_train = tfidf.fit_transform(train_df['cleaned_text'])
    y_train = train_df['label']
    
    X_val = tfidf.transform(val_df['cleaned_text'])
    y_val = val_df['label']
    
    X_test = tfidf.transform(test_df['cleaned_text'])
    y_test = test_df['label']
    
    labels = sorted(y_train.unique().tolist())
    joblib.dump(labels, os.path.join(MODELS_DIR, 'class_labels.joblib'))
    
    results = []
    
    # 1. Logistic Regression
    print("Training Logistic Regression...")
    lr = LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')
    lr.fit(X_train, y_train)
    res_lr = evaluate_model("TF-IDF + Logistic Regression", lr, X_test, y_test, labels)
    results.append(res_lr)
    
    # 2. Linear SVM
    print("Training Linear SVM...")
    svm = LinearSVC(random_state=42, class_weight='balanced', max_iter=2000)
    svm.fit(X_train, y_train)
    res_svm = evaluate_model("TF-IDF + Linear SVM", svm, X_test, y_test, labels)
    results.append(res_svm)
    
    # Save best model
    best_model_name = "TF-IDF + Linear SVM" if res_svm['f1_score'] > res_lr['f1_score'] else "TF-IDF + Logistic Regression"
    best_model = svm if res_svm['f1_score'] > res_lr['f1_score'] else lr
    
    print(f"Best Model selected based on F1 Score: {best_model_name}")
    
    joblib.dump(tfidf, os.path.join(MODELS_DIR, 'tfidf_vectorizer.joblib'))
    joblib.dump(best_model, os.path.join(MODELS_DIR, 'resume_classifier.joblib'))
    
    with open(os.path.join(EVAL_DIR, 'classification_report.json'), 'w') as f:
        json.dump(results, f, indent=4)
        
    print("Training complete. Models and reports saved.")

if __name__ == '__main__':
    train_classifiers()
