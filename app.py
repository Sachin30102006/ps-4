"""
CredLens — AI Reputation Intelligence for Small Businesses
Flask Application
"""
from flask import Flask, render_template, jsonify, request
from risk_engine import RiskEngine
from db_utils import get_db_connection

app = Flask(__name__)

# Initialize Risk Engine
risk_engine = RiskEngine()

# ── Pages ──────────────────────────────────────────────────
@app.route("/")
def index():
    """Serve the main SPA shell."""
    return render_template("index.html")


# ── API ──────────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Accept business metrics and return a computed reputation score
    and risk profile using the Risk Engine (ML + Deterministic).
    """
    data = request.get_json(silent=True) or {}
    
    # Use Risk Engine to analyze data
    result = risk_engine.analyze(data)
    
    # Save to database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO businesses (monthly_revenue, payment_delays, transactions, avg_sentiment, risk_label)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.get('revenue'),
            data.get('paymentDelay'),
            data.get('transactions'),
            0.0, # Sentiment not passed from frontend yet, default to 0
            1 if result['risk'] == 'High' else 0 # Simple mapping or use result['ml_risk_probability']
        ))
        conn.commit()
        conn.close()
        print(f"SUCCESS: Analysis for revenue ${data.get('revenue')} saved to database.", flush=True)
    except Exception as e:
        print(f"Error saving analysis to DB: {e}", flush=True)
    
    return jsonify(result)

@app.route("/api/businesses", methods=["GET"])
def get_businesses():
    """
    Retrieve all business records from the database.
    """
    conn = get_db_connection()
    businesses = conn.execute('SELECT * FROM businesses').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in businesses])

@app.route("/api/business", methods=["POST"])
def add_business_route():
    """
    Add a new business record to the database and retrain the model (optional).
    """
    data = request.get_json(silent=True) or {}
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO businesses (monthly_revenue, payment_delays, transactions, avg_sentiment, risk_label)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data.get('revenue'),
        data.get('paymentDelay'),
        data.get('transactions'),
        data.get('sentiment'),
        data.get('risk_label') # Optional 0 or 1
    ))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Business added successfully"}), 201

@app.route("/api/retrain", methods=["POST"])
def retrain_model():
    """
    Trigger the model training script.
    """
    import subprocess
    try:
        # Run train_model.py
        result = subprocess.run(["python", "train_model.py"], capture_output=True, text=True)
        
        if result.returncode == 0:
            # Reload the risk engine with the new model
            global risk_engine
            risk_engine = RiskEngine()
            return jsonify({"message": "Model retrained successfully", "output": result.stdout}), 200
        else:
            return jsonify({"message": "Model training failed", "error": result.stderr}), 500
    except Exception as e:
        return jsonify({"message": "Error triggering training", "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
