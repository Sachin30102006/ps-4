
import pandas as pd

df = pd.read_csv('business_reputation_dataset.csv')

print("Statistics:")
print(df.describe())

print("\nMax Revenue:", df['monthly_revenue'].max())
print("Max Transactions:", df['transactions'].max())
print("Min Payment Delays:", df['payment_delays'].min())
print("Max Payment Delays:", df['payment_delays'].max())
print("Min Sentiment:", df['avg_sentiment'].min())
print("Max Sentiment:", df['avg_sentiment'].max())
