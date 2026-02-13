
import json
from app import app
from risk_engine import RiskEngine

# Create a test client
client = app.test_client()

# Sample data mimicking a good business
good_business = {
    "revenue": 120000,
    "transactions": 500,
    "paymentDelay": 5,
    "activityFreq": 20,
    "sentiment": 0.8
}

# Sample data mimicking a risky business
risky_business = {
    "revenue": 30000,
    "transactions": 100,
    "paymentDelay": 60,
    "activityFreq": 5,
    "sentiment": -0.5
}

print("--- Testing Good Business ---")
response_good = client.post('/api/analyze', 
                       data=json.dumps(good_business),
                       content_type='application/json')
print("Status:", response_good.status_code)
print("Response:", json.dumps(response_good.json, indent=4))

print("\n--- Testing Risky Business ---")
response_risky = client.post('/api/analyze', 
                       data=json.dumps(risky_business),
                       content_type='application/json')
print("Status:", response_risky.status_code)
print("Response:", json.dumps(response_risky.json, indent=4))
