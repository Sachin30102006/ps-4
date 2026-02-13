
print("Start import...", flush=True)
from risk_engine import RiskEngine
print("Imported RiskEngine. Initializing...", flush=True)
try:
    re = RiskEngine()
    print("RiskEngine initialized successfully.", flush=True)
    res = re.analyze({"revenue": 50000, "transactions": 100, "paymentDelay": 5, "sentiment": 0.5})
    print(f"Test analysis: {res}", flush=True)
except Exception as e:
    print(f"RiskEngine failed: {e}", flush=True)
print("Done.", flush=True)
