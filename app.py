"""
CredLens — AI Reputation Intelligence for Small Businesses
Flask Application
"""
from flask import Flask, render_template, jsonify, request

from risk_engine import RiskEngine

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
    
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
