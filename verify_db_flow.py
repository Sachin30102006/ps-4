
import json
import time
from app import app

client = app.test_client()

# 1. Add new data
new_business = {
    "revenue": 150000,
    "paymentDelay": 2,
    "transactions": 600,
    "sentiment": 0.9,
    "risk_label": 0
}
print("Adding new business...")
resp = client.post('/api/business', json=new_business)
print("Add Status:", resp.status_code)

# 2. Retrain model
print("Triggering retraining...")
resp = client.post('/api/retrain')
print("Retrain Status:", resp.status_code)
print("Retrain Output:", resp.json.get('message'))

# 3. Analyze (should work with new model)
print("Analyzing...")
resp = client.post('/api/analyze', json={"revenue": 150000, "paymentDelay": 2, "transactions": 600})
print("Analyze Status:", resp.status_code)
print("Score:", resp.json.get('score'))
