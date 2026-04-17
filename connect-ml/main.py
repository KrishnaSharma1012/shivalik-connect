from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import re
from pathlib import Path

app = FastAPI(
    title="Connect ML API",
    description="Career Path Predictor for the Connect platform",
    version="2.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load production data on startup ──────────────────────────
print("Loading model and data...")

model = SentenceTransformer('all-MiniLM-L6-v2')

BASE_DIR = Path(__file__).resolve().parent
df = pd.read_csv(BASE_DIR / "data" / "processed" / "jobs_production.csv")
embeddings = np.load(BASE_DIR / "models" / "job_embeddings_production.npy")

print(f"Ready - {len(df)} jobs loaded")
print(f"   Domains: {df['domain'].value_counts().to_dict()}")

# ── Available domains (now 8, up from 6) ─────────────────────
VALID_DOMAINS = [
    "Software Engineering",
    "Data & AI",
    "Product Management",
    "Design",
    "Finance",
    "Marketing",
    "Human Resources",
    "Sales & Business Development"
]

# ── Helper: clean messy job titles ───────────────────────────
def clean_title(title: str) -> str:
    title = re.sub(r'\s+\d+$', '', title.strip())
    title = re.sub(r'\s+(Ii|Iii|Iv|Vi|Vii)$', '', title.strip())
    return title.strip()

# ── Request & Response models ─────────────────────────────────
class PredictRequest(BaseModel):
    student_skills: str
    student_interests: str
    target_domain: str
    top_n: int = 3

class CareerPath(BaseModel):
    career_path: str
    match_score: str
    experience_level: str
    domain: str

class PredictResponse(BaseModel):
    student_profile: str
    target_domain: str
    predictions: list[CareerPath]

# ── Routes ────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Connect ML API is running",
        "version": "2.0.0",
        "total_jobs": len(df),
        "endpoints": {
            "predict": "/predict",
            "domains": "/domains",
            "health": "/health"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "all-MiniLM-L6-v2",
        "jobs_loaded": len(df),
        "domains": df['domain'].value_counts().to_dict()
    }

@app.get("/domains")
def get_domains():
    domain_stats = {}
    for domain in VALID_DOMAINS:
        count = len(df[df['domain'] == domain])
        domain_stats[domain] = count
    return {
        "available_domains": VALID_DOMAINS,
        "job_counts": domain_stats
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):

    if request.target_domain not in VALID_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid domain. Choose from: {VALID_DOMAINS}"
        )

    if not 1 <= request.top_n <= 10:
        raise HTTPException(
            status_code=400,
            detail="top_n must be between 1 and 10"
        )

    student_profile = f"Skills: {request.student_skills}. Interests: {request.student_interests}"
    student_embedding = model.encode([student_profile])

    domain_mask = df['domain'] == request.target_domain
    domain_df = df[domain_mask].reset_index(drop=True)
    domain_embeddings = embeddings[domain_mask]

    if len(domain_df) == 0:
        raise HTTPException(
            status_code=404,
            detail=f"No jobs found for domain: {request.target_domain}"
        )

    similarities = cosine_similarity(student_embedding, domain_embeddings)[0]
    top_indices = similarities.argsort()[::-1][:request.top_n * 10]

    seen_titles = set()
    predictions = []

    for idx in top_indices:
        raw_title = domain_df.iloc[idx]['title'].title()
        title = clean_title(raw_title)
        score = round(float(similarities[idx]) * 100, 1)

        if title not in seen_titles:
            seen_titles.add(title)

            exp_level = domain_df.iloc[idx].get('formatted_experience_level', 'All levels')
            if pd.isna(exp_level):
                exp_level = 'All levels'

            predictions.append(CareerPath(
                career_path=title,
                match_score=f"{score}%",
                experience_level=exp_level,
                domain=request.target_domain
            ))

        if len(predictions) == request.top_n:
            break

    return PredictResponse(
        student_profile=student_profile,
        target_domain=request.target_domain,
        predictions=predictions
    )