
import sqlite3
import time

print("Attempting to connect to DB...", flush=True)
try:
    conn = sqlite3.connect('reputation.db', timeout=5)
    print("Connected.", flush=True)
    cursor = conn.cursor()
    print("Executing query...", flush=True)
    cursor.execute("SELECT count(*) FROM businesses")
    print(f"Count: {cursor.fetchone()[0]}", flush=True)
    conn.close()
    print("Closed.", flush=True)
except Exception as e:
    print(f"Error: {e}", flush=True)
