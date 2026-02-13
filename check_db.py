
import sqlite3
import pandas as pd

conn = sqlite3.connect('reputation.db')
df = pd.read_sql_query("SELECT * FROM businesses ORDER BY id DESC LIMIT 5", conn)
conn.close()

print(df)
