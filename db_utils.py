
import sqlite3

DB_NAME = 'reputation.db'

def get_db_connection():
    # print(f"Connecting to {DB_NAME}...", flush=True)
    conn = sqlite3.connect(DB_NAME, timeout=10) # Increased timeout
    conn.row_factory = sqlite3.Row
    return conn

def add_business(data):
    """
    Add a new business record to the database.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO businesses (monthly_revenue, payment_delays, transactions, avg_sentiment, risk_label)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.get('monthly_revenue'),
            data.get('payment_delays'),
            data.get('transactions'),
            data.get('avg_sentiment'),
            data.get('risk_label') # Optional, might be None if unlabelled
        ))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error adding business to DB: {e}")
        return False

def get_all_businesses():
    try:
        conn = get_db_connection()
        businesses = conn.execute('SELECT * FROM businesses').fetchall()
        conn.close()
        return [dict(ix) for ix in businesses]
    except Exception as e:
        print(f"Error fetching businesses: {e}")
        return []
