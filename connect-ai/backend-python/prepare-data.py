import pandas as pd, json

SKILLS = [
    "Python","Java","SQL","JavaScript","DSA","System Design",
    "Machine Learning","Data Analysis","React","Node.js",
    "Communication","Leadership","Excel","Statistics","AWS","Docker"
]

def extract_skills(text):
    text = str(text).lower()
    return [s for s in SKILLS if s.lower() in text]

df = pd.read_csv("data/jobs.csv")

roles = []
for _, row in df.iterrows():
    skills = extract_skills(row.get("description",""))
    if not skills:
        continue
    roles.append({
        "role": str(row.get("title","")).strip(),
        "company": str(row.get("company_name","Generic")).strip(),
        "skills": skills,
        "level": "Intermediate"
    })

with open("data/cleaned_roles.json","w") as f:
    json.dump(roles[:500], f, indent=2)

print(f"Saved {len(roles[:500])} roles")