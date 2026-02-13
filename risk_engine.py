
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

    def calculate_financial_stability(self, revenue, payment_delay):
        """
        Calculate Financial Stability score (0-100).
        Based on Revenue (higher is better) and Payment Delays (lower is better).
        """
        # Normalize Revenue (Assuming max around 150k based on dataset)
        revenue_score = min(100, (revenue / 150000) * 100)
        
        # Normalize Payment Delay (Assuming max around 120 days)
        # 0 delay = 100 score, 120 delay = 0 score
        delay_score = max(0, 100 - (payment_delay / 120 * 100))
        
        # Weighted average: 70% Revenue, 30% Low Delays
        f_score = (revenue_score * 0.7) + (delay_score * 0.3)
        return min(100, max(0, int(f_score)))

    def calculate_behavioral_score(self, payment_delay, transactions):
        """
        Calculate Behavioral Score (0-100).
        Heavily penalized by payment delays. Rewarded for consistent transactions.
        """
        # Payment Punctuality (0 delay = 100, 30 delay = 75, etc.)
        punctuality_score = max(0, 100 - (payment_delay * 1.5))
        
        # Consistency/Activity (more transactions = more data points = more trust)
        # Cap at 600 transactions
        consistency_score = min(100, (transactions / 600) * 100)
        
        # Behavioral is mostly about punctuality (80%), with some credit for activity (20%)
        b_score = (punctuality_score * 0.8) + (consistency_score * 0.2)
        return min(100, max(0, int(b_score)))

    def calculate_sentiment_score(self, avg_sentiment):
        """
        Calculate Sentiment Score (0-100).
        Input range: -1.0 to 1.0
        """
        # Map -1 to 0, 0 to 50, 1 to 100
        # Formula: ((sentiment + 1) / 2) * 100
        s_score = ((avg_sentiment + 1) / 2) * 100
        return min(100, max(0, int(s_score)))

    def calculate_activity_score(self, transactions):
        """
        Calculate Activity Score (0-100).
        Solely based on transaction volume.
        """
        # Normalize based on typical max of 600
        return min(100, int((transactions / 600) * 100))

    def deterministic_score(self, data):
        """
        Calculate a rule-based credit score (0-100).
        """
        revenue = float(data.get('revenue', 0))
        transactions = int(data.get('transactions', 0))
        payment_delay = float(data.get('paymentDelay', 0))
        sentiment = float(data.get('sentiment', 0))
        activity_freq = int(data.get('activityFreq', 0)) # Not used in ML model but useful for score

        # Consolidated Score Calculation
        # 30% Financial Stability
        # 30% Behavioral
        # 20% Sentiment
        # 20% Raw Activity Volume
        
        fin = self.calculate_financial_stability(revenue, payment_delay)
        beh = self.calculate_behavioral_score(payment_delay, transactions)
        sen = self.calculate_sentiment_score(sentiment)
        act = self.calculate_activity_score(transactions)
        
        overall_score = (fin * 0.3) + (beh * 0.3) + (sen * 0.2) + (act * 0.2)
        
        return int(overall_score)

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
        
        revenue = float(data.get('revenue', 0))
        transactions = int(data.get('transactions', 0))
        payment_delay = float(data.get('paymentDelay', 0))
        sentiment = float(data.get('sentiment', 0))
        
        score = self.deterministic_score(data)
        risk_prob, risk_pred = self.predict_risk_ml(features)
        
        risk_label = self.classify_risk(risk_prob, score)
        
        grade = "A" if score >= 85 else "B" if score >= 70 else "C" if score >= 55 else "D"

        # Calculate individual factor scores
        financial_stability = self.calculate_financial_stability(revenue, payment_delay)
        behavioral_score = self.calculate_behavioral_score(payment_delay, transactions)
        sentiment_score = self.calculate_sentiment_score(sentiment)
        activity_score = self.calculate_activity_score(transactions)

        return {
            "score": score,
            "grade": grade,
            "risk": risk_label,
            "ml_risk_probability": round(risk_prob, 2),
            "factors": {
                "financialStability": financial_stability,
                "sentiment": sentiment_score,
                "behavioral": behavioral_score,
                "activity": activity_score,
            }
        }
