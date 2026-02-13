
import requests
import sqlite3
import json
import time

URL = "http://127.0.0.1:5000/api/analyze"

def check_db_count():
    try:
        conn = sqlite3.connect('reputation.db')
        cursor = conn.cursor()
        count = cursor.execute("SELECT COUNT(*) FROM businesses").fetchone()[0]
        conn.close()
        return count
    except Exception as e:
        print(f"DB Error: {e}")
        return -1

def debug_persistence():
    print(f"Checking initial DB count...")
    initial_count = check_db_count()
    print(f"Initial count: {initial_count}")

    payload = {
        "revenue": 12345,
        "transactions": 123,
        "paymentDelay": 5,
        "activityFreq": 20,
        "reviewText": "Debug persistence test"
    }

    print(f"\nSending POST request to {URL} with payload: {payload}")
    try:
        response = requests.post(URL, json=payload)
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("\nRequest successful. Checking DB count again...")
            time.sleep(1) # Give it a moment (sqlite is fast though)
            new_count = check_db_count()
            print(f"New count: {new_count}")
            
            if new_count > initial_count:
                print("SUCCESS: Data was persisted to the database.")
            else:
                print("FAILURE: Data was NOT persisted to the database.")
        else:
            print("FAILURE: API returned non-200 status.")
            
    except requests.exceptions.ConnectionError:
        print("FAILURE: Could not connect to the server. Is 'python app.py' running?")

if __name__ == "__main__":
    debug_persistence()
