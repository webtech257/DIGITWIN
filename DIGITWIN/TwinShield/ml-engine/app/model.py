import os
import sys

# Add parent directory to sys.path for seamless imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from app.risk_features import FEATURE_NAMES

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "isolation_forest.pkl")

def train_and_save_model(data_path="data/synthetic_activity_dataset.csv"):
    if not os.path.exists(data_path):
        from data.generate_data import generate_synthetic_dataset
        generate_synthetic_dataset(data_path)

    df = pd.read_csv(data_path)
    X = df[FEATURE_NAMES]

    # Train IsolationForest model on normal employee baseline data
    model = IsolationForest(
        n_estimators=100,
        contamination=0.10,
        random_state=42
    )
    model.fit(X)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Successfully trained IsolationForest model and saved to {MODEL_PATH}")
    return model

def load_trained_model():
    if not os.path.exists(MODEL_PATH):
        return train_and_save_model()
    return joblib.load(MODEL_PATH)

if __name__ == "__main__":
    train_and_save_model()
