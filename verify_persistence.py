
import json
import sqlite3
import pandas as pd
from app import app

client = app.test_client()

# Sample data
data = {
    "revenue": 55555,
    "transactions": 555,
    "paymentDelay": 5,
    "activityFreq": 25
}

# 1. Get current count
conn = sqlite3.connect('reputation.db')
cursor = conn.cursor()
count_before = cursor.execute("SELECT COUNT(*) FROM businesses").fetchone()[0]
conn.close()
print(f"Rows before: {count_before}")

# 2. Call Analyze API
print("Calling /api/analyze...")
response = client.post('/api/analyze', 
                       data=json.dumps(data),
                       content_type='application/json')
print("Status Code:", response.status_code)
print("Response:", json.dumps(response.json, indent=4))

# 3. Get new count and check last record
conn = sqlite3.connect('reputation.db')
cursor = conn.cursor()
count_after = cursor.execute("SELECT COUNT(*) FROM businesses").fetchone()[0]
last_record = cursor.execute("SELECT * FROM businesses ORDER BY id DESC LIMIT 1").fetchone()
conn.close()

print(f"Rows after: {count_after}")

if count_after > count_before:
    print("SUCCESS: Data persisted to database.")
    print("Last Record:", last_record)
else:
    print("FAILURE: Data NOT persisted.")
