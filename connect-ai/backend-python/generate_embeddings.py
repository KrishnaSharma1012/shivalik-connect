from sentence_transformers import SentenceTransformer
import json

model = SentenceTransformer('all-MiniLM-L6-v2')

with open("data/cleaned_roles.json") as f:
    roles = json.load(f)

for r in roles:
    text = r["role"] + " " + " ".join(r["skills"])
    r["embedding"] = model.encode(text).tolist()

with open("data/roles_with_embeddings.json","w") as f:
    json.dump(roles, f)

print("Embeddings generated.")