
import sqlite3
import pandas as pd

try:
    conn = sqlite3.connect('reputation.db')
    # Fetch all data
    df = pd.read_sql_query("SELECT * FROM businesses", conn)
    conn.close()
    
    if df.empty:
        print("Database is empty.")
    else:
        # Print with tabulate if available, or just to_string
        print(df.to_string())
        print(f"\nTotal Records: {len(df)}")
except Exception as e:
    print(f"Error viewing database: {e}")
