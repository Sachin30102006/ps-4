
import json
from app import app

# Create a test client
client = app.test_client()

# Sample data
data = {
    "revenue": 85000,
    "transactions": 300,
    "paymentDelay": 5,
    "activityFreq": 10,
    "sentiment": 0.65
}

# Send POST request
response = client.post('/api/analyze', 
                       data=json.dumps(data),
                       content_type='application/json')

# Print result
print("Status Code:", response.status_code)
print("Response JSON:", json.dumps(response.json, indent=4))
