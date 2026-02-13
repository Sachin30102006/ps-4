
import joblib
import pandas as pd
import numpy as np

class RiskEngine:
    def __init__(self, model_path='model.pkl', scaler_path='scaler.pkl'):
        try:
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
            self.model_loaded = True
        except Exception as e:
            print(f"Error loading model/scaler: {e}")
            self.model_loaded = False
            self.model = None
            self.scaler = None

    def engineer_features(self, data):
        """
        Transform raw input into features expected by the model.
        Expected input keys: revenue, paymentDelay, transactions, sentiment (optional)
        """
        # Default sentiment to 0 if not provided
        sentiment = data.get('sentiment', 0)
        
        # Create DataFrame with correct column names and order
        features = pd.DataFrame([{
            'monthly_revenue': float(data.get('revenue', 0)),
            'payment_delays': float(data.get('paymentDelay', 0)),
            'transactions': int(data.get('transactions', 0)),
            'avg_sentiment': float(sentiment)
        }])
        
        return features

    def deterministic_score(self, data):
        """
        Calculate a rule-based credit score (0-100).
        """
        revenue = float(data.get('revenue', 0))
        transactions = int(data.get('transactions', 0))
        payment_delay = float(data.get('paymentDelay', 0))
        activity_freq = int(data.get('activityFreq', 0)) # Not used in ML model but useful for score

        # Simple scoring heuristic (similar to original app.py but refined)
        score = min(100, max(0, round(
            (revenue / 1000) * 0.3
            + (transactions / 50) * 0.2
            + (30 - payment_delay) * 1.5
            + activity_freq * 0.8
            + 35
        )))
        return score

    def predict_risk_ml(self, features):
        """
        Predict risk using the trained Random Forest model.
        Returns risk probability (0-1) and label (0=Low, 1=High Risk).
        """
        if not self.model_loaded:
            return 0.5, 1 # Default to moderate/high risk if model missing

        try:
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict
            prediction = self.model.predict(features_scaled)[0]
            probability = self.model.predict_proba(features_scaled)[0][1] # Prob of class 1 (High Risk)
            
            return probability, prediction
        except Exception as e:
            print(f"Prediction error: {e}")
            return 0.5, 1

    def classify_risk(self, risk_prob, score):
        """
        Combine ML risk probability and deterministic score.
        """
        # ML Risk Probability dominates, but score provides nuance
        if risk_prob > 0.7:
            return "High"
        elif risk_prob > 0.4:
            return "Moderate"
        else:
            return "Low"

    def analyze(self, data):
        """
        Main entry point for analysis.
        """
        features = self.engineer_features(data)
        score = self.deterministic_score(data)
        risk_prob, risk_pred = self.predict_risk_ml(features)
        
        risk_label = self.classify_risk(risk_prob, score)
        
        grade = "A" if score >= 85 else "B" if score >= 70 else "C" if score >= 55 else "D"

        return {
            "score": score,
            "grade": grade,
            "risk": risk_label,
            "ml_risk_probability": round(risk_prob, 2),
            "factors": {
                "financialStability": min(100, round(features['monthly_revenue'][0] / 500)),
                "sentiment": round(features['avg_sentiment'][0] * 100, 1), # Scale back for display if needed
                "behavioral": min(100, round(int(data.get('activityFreq', 0)) * 4)),
                "activity": min(100, round(features['transactions'][0] / 15)),
            }
        }
