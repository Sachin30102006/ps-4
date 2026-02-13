
import pandas as pd
print("Imported pandas", flush=True)
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
print("Imported all modules", flush=True)

import sqlite3

# 1. Load Data
print("Reading data from SQLite...", flush=True)
conn = sqlite3.connect('reputation.db')
df = pd.read_sql_query("SELECT * FROM businesses", conn)
conn.close()
print(f"Read data with shape {df.shape}", flush=True)

# 2. Preprocessing
# Features: monthly_revenue, payment_delays, transactions, avg_sentiment
# Target: risk_label

X = df[['monthly_revenue', 'payment_delays', 'transactions', 'avg_sentiment']]
y = df['risk_label']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 3. Model Training
# Random Forest is chosen for its robustness and ability to handle non-linear relationships
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train_scaled, y_train)

# 4. Evaluation
y_pred = clf.predict(X_test_scaled)
print("Model Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# 5. Save Artifacts
joblib.dump(clf, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Model and scaler saved to model.pkl and scaler.pkl")
