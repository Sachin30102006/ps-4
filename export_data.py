
import sqlite3
import pandas as pd

def export_db_to_csv(db_name='reputation.db', csv_name='business_reputation_dataset.csv'):
    conn = sqlite3.connect(db_name)
    df = pd.read_sql_query("SELECT * FROM businesses", conn)
    conn.close()
    
    # Drop the id and created_at columns to match original format if desired, 
    # or keep them. Let's keep them for now or strictly match original?
    # Original columns: monthly_revenue,payment_delays,transactions,avg_sentiment,risk_label
    
    df = df[['monthly_revenue', 'payment_delays', 'transactions', 'avg_sentiment', 'risk_label']]
    df.to_csv(csv_name, index=False)
    print(f"Exported {len(df)} rows from {db_name} to {csv_name}.")

if __name__ == "__main__":
    export_db_to_csv()
