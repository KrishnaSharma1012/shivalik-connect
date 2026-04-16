from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss, json, numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pathlib import Path
import logging

load_dotenv()
app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

logger = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
ROLES_PATH = DATA_DIR / "roles_with_embeddings.json"
SKILLS_MAP_PATH = DATA_DIR / "skills_map.json"

roles = []
index = None
startup_error = None


def _read_json(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Missing required file: {path}")

    text = path.read_text(encoding="utf-8").strip()
    if not text:
        raise ValueError(f"File is empty: {path}")

    try:
        return json.loads(text)
    except json.JSONDecodeError as err:
        raise ValueError(f"Invalid JSON in {path}: {err}") from err


def _build_roles_from_skills_map(skills_map_data: dict):
    generated = []
    for role_name, required_skills in skills_map_data.items():
        if not isinstance(required_skills, list) or not required_skills:
            continue
        text = f"{role_name} {' '.join(required_skills)}"
        embedding = model.encode(text).tolist()
        generated.append({
            "role": role_name,
            "skills": required_skills,
            "embedding": embedding,
        })
    return generated


def _initialize_index():
    global roles, index

    skills_map_data = _read_json(SKILLS_MAP_PATH)
    if not isinstance(skills_map_data, dict) or not skills_map_data:
        raise ValueError("skills_map.json must contain a non-empty object")

    try:
        loaded_roles = _read_json(ROLES_PATH)
        if not isinstance(loaded_roles, list) or not loaded_roles:
            raise ValueError("roles_with_embeddings.json must contain a non-empty list")
    except Exception as err:
        logger.warning("Falling back to rebuilding role embeddings: %s", err)
        loaded_roles = _build_roles_from_skills_map(skills_map_data)
        if not loaded_roles:
            raise ValueError("Could not build any roles from skills_map.json")
        ROLES_PATH.write_text(json.dumps(loaded_roles, ensure_ascii=False, indent=2), encoding="utf-8")

    embeddings = np.array([r["embedding"] for r in loaded_roles], dtype="float32")
    if embeddings.ndim != 2 or embeddings.shape[0] == 0:
        raise ValueError("No valid embeddings available to build FAISS index")

    built_index = faiss.IndexFlatL2(embeddings.shape[1])
    built_index.add(embeddings)

    roles = loaded_roles
    index = built_index


try:
    _initialize_index()
except Exception as err:
    startup_error = str(err)
    logger.exception("AI backend initialization failed: %s", err)

mongo = MongoClient(os.getenv("MONGO_URI"))
db = mongo["connect_platform"]

class QueryRequest(BaseModel):
    message: str
    user_skills: list[str] = []

@app.post("/analyze")
def analyze(req: QueryRequest):
    if index is None or not roles:
        raise HTTPException(status_code=503, detail=f"AI engine not ready: {startup_error}")

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