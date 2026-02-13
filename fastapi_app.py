
import sqlite3
import subprocess
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import os

from risk_engine import RiskEngine
from db_utils import get_db_connection

app = FastAPI()

# Initialize Risk Engine
risk_engine = RiskEngine()

# Input Models
class BusinessMetrics(BaseModel):
    revenue: float
    transactions: int
    paymentDelay: float
    activityFreq: int
    reviewText: Optional[str] = None
    # Optional fields for direct DB insertion if different from analysis input
    risk_label: Optional[int] = None

class BusinessRecord(BaseModel):
    id: int
    monthly_revenue: float
    payment_delays: float
    transactions: int
    avg_sentiment: float
    risk_label: Optional[int]
    created_at: str

# Background Task
def train_model_task():
    print("Background Task: Starting model retraining...", flush=True)
    try:
        # Run train_model.py as a subprocess to ensure clean state
        result = subprocess.run(["python", "train_model.py"], capture_output=True, text=True)
        if result.returncode == 0:
            print("Background Task: Model trained successfully.", flush=True)
            print(result.stdout, flush=True)
            # Reload the risk engine to pick up the new model
            global risk_engine
            risk_engine = RiskEngine() 
        else:
            print(f"Background Task: Model training failed. Stderr: {result.stderr}", flush=True)
    except Exception as e:
        print(f"Background Task Error: {e}", flush=True)

# API Endpoints

@app.get("/api/businesses", response_model=List[dict])
async def get_businesses():
    conn = get_db_connection()
    businesses = conn.execute('SELECT * FROM businesses').fetchall()
    conn.close()
    return [dict(ix) for ix in businesses]

@app.post("/api/analyze")
async def analyze(data: BusinessMetrics, background_tasks: BackgroundTasks):
    # 1. Analyze
    # Convert Pydantic model to dict
    input_data = data.dict()
    result = risk_engine.analyze(input_data)
    
    # 2. Persist to DB
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO businesses (monthly_revenue, payment_delays, transactions, avg_sentiment, risk_label)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.revenue,
            data.paymentDelay,
            data.transactions,
            0.0, # Placeholder for sentiment until NLP is connected
            1 if result['risk'] == 'High' else 0
        ))
        conn.commit()
        conn.close()
        print(f"SUCCESS: Analysis saved to DB.", flush=True)
        
        # 3. Trigger Auto-Retrain
        background_tasks.add_task(train_model_task)
        
    except Exception as e:
        print(f"Error saving/training: {e}", flush=True)

    return result

@app.post("/api/business")
async def add_business(data: BusinessMetrics, background_tasks: BackgroundTasks):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO businesses (monthly_revenue, payment_delays, transactions, avg_sentiment, risk_label)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.revenue,
            data.paymentDelay,
            data.transactions,
            0.0,
            data.risk_label if data.risk_label is not None else 0
        ))
        conn.commit()
        conn.close()
        
        # Trigger Auto-Retrain
        background_tasks.add_task(train_model_task)
        
        return {"message": "Business added and training triggered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/retrain")
async def retrain(background_tasks: BackgroundTasks):
    background_tasks.add_task(train_model_task)
    return {"message": "Model retraining started in background"}

# Serve Static Files (Frontend)
# Mount the 'src' directory to separate paths if needed, or serve index.html at root
app.mount("/styles", StaticFiles(directory="src/styles"), name="styles")
app.mount("/js", StaticFiles(directory="src/js"), name="js")
if os.path.exists("src/assets"):
    app.mount("/assets", StaticFiles(directory="src/assets"), name="assets")

@app.get("/")
async def read_index():
    return FileResponse('src/index.html')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
