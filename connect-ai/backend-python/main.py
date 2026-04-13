from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss, json, numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load roles + build FAISS index on startup
with open("data/roles_with_embeddings.json") as f:
    roles = json.load(f)
with open("data/skills_map.json") as f:
    skills_map = json.load(f)

embeddings = np.array([r["embedding"] for r in roles], dtype="float32")
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(embeddings)

mongo = MongoClient(os.getenv("MONGO_URI"))
db = mongo["connect_platform"]

class QueryRequest(BaseModel):
    message: str
    user_skills: list[str] = []

@app.post("/analyze")
def analyze(req: QueryRequest):
    # Embed the user query
    q_vec = model.encode(req.message).reshape(1, -1).astype("float32")
    _, idxs = index.search(q_vec, 3)
    best = roles[idxs[0][0]]

    required = best["skills"]
    missing = [s for s in required if s not in req.user_skills]

    # Pull alumni from MongoDB
    alumni = list(db.alumni.find(
        {"skills": {"$in": required}},
        {"_id": 0, "name": 1, "company": 1, "role": 1, "premium": 1}
    ).limit(3))

    # Pull courses for missing skills
    courses = list(db.courses.find(
        {"skills": {"$in": missing}},
        {"_id": 0, "title": 1, "price": 1}
    ).limit(3))

    return {
        "detected_role": best["role"],
        "required_skills": required,
        "missing_skills": missing,
        "alumni": alumni,
        "courses": courses
    }