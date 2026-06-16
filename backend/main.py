from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer
model = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Request schema
class Review(BaseModel):
    text: str

# Home route
@app.get("/")
def home():
    return {"message": "Sentiment API Running"}

# Prediction route
@app.post("/predict")
def predict(review: Review):

    # Convert text to TF-IDF vector
    vector = vectorizer.transform([review.text])

    # Predict sentiment
    prediction = model.predict(vector)[0]

    # Calculate confidence score
    probabilities = model.predict_proba(vector)[0]
    confidence = round(max(probabilities) * 100, 2)

    # Label mapping
    labels = {
        0: "Negative",
        1: "Neutral",
        2: "Positive"
    }

    return {
        "review": review.text,
        "sentiment": labels[prediction],
        "confidence": confidence
    }