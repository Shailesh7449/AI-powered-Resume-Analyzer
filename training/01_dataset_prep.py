import os
import pandas as pd
from datasets import load_dataset
import re
from sklearn.model_selection import train_test_split

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'datasets')
os.makedirs(DATA_DIR, exist_ok=True)

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.\,\;]', '', text)
    return text.strip()

def prep_classification_dataset():
    print("Loading classification dataset...")
    try:
        ds = load_dataset("abhishekdata/resume_category_classification")
        df = ds['train'].to_pandas()
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return
        
    print(f"Columns: {df.columns.tolist()}")
    
    text_col = 'Resume_str' if 'Resume_str' in df.columns else df.columns[0]
    label_col = 'Category' if 'Category' in df.columns else df.columns[1]
    
    print(f"Original dataset shape: {df.shape}")
    
    # 1. Remove empty
    df = df.dropna(subset=[text_col, label_col])
    
    # 2. Clean text
    df['cleaned_text'] = df[text_col].apply(clean_text)
    df = df[df['cleaned_text'].str.len() > 50] # minimum length
    
    # 3. Remove duplicates
    df = df.drop_duplicates(subset=['cleaned_text'])
    print(f"After deduplication: {df.shape}")
    
    # 4. Normalize labels
    df['label'] = df[label_col].astype(str).str.strip().str.upper()
    
    # Handle rare classes for stratify
    class_counts = df['label'].value_counts()
    valid_classes = class_counts[class_counts > 5].index
    df = df[df['label'].isin(valid_classes)]
    print(f"After filtering rare classes: {df.shape}")
    
    # Split: 70/15/15
    train_df, temp_df = train_test_split(df, test_size=0.30, random_state=42, stratify=df['label'])
    val_df, test_df = train_test_split(temp_df, test_size=0.50, random_state=42, stratify=temp_df['label'])
    
    train_df.to_csv(os.path.join(DATA_DIR, 'train_classification.csv'), index=False)
    val_df.to_csv(os.path.join(DATA_DIR, 'val_classification.csv'), index=False)
    test_df.to_csv(os.path.join(DATA_DIR, 'test_classification.csv'), index=False)
    
    print(f"Saved splits. Train: {train_df.shape[0]}, Val: {val_df.shape[0]}, Test: {test_df.shape[0]}")

if __name__ == '__main__':
    prep_classification_dataset()
