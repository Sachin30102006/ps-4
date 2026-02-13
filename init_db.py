
import sqlite3
import pandas as pd

DB_NAME = 'reputation.db'

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create businesses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS businesses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            monthly_revenue REAL,
            payment_delays REAL,
            transactions INTEGER,
            avg_sentiment REAL,
            risk_label INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database {DB_NAME} initialized.")

def import_csv_to_db(csv_path='business_reputation_dataset.csv'):
    try:
        df = pd.read_csv(csv_path)
        conn = get_db_connection()
        
        # Write data to sqlite
        # if_exists='append' allows adding more data later without overwriting schema
        df.to_sql('businesses', conn, if_exists='append', index=False)
        
        conn.close()
        print(f"Successfully imported {len(df)} records from {csv_path} to {DB_NAME}.")
    except Exception as e:
        print(f"Error importing CSV: {e}")

if __name__ == '__main__':
    init_db()
    import_csv_to_db()
