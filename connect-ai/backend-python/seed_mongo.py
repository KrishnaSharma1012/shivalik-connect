from pymongo import MongoClient
import json, os
from dotenv import load_dotenv
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["connect_platform"]

# Seed alumni (add your real data here)
alumni = [
  {"name":"Arjun Mehta","company":"Google","role":"Software Engineer","skills":["DSA","System Design","Python"],"premium":True,"college":"IIT Delhi"},
  {"name":"Priya Shah","company":"Amazon","role":"Data Analyst","skills":["SQL","Python","Statistics"],"premium":False,"college":"BITS Pilani"},
  {"name":"Rahul Nair","company":"Microsoft","role":"Backend Developer","skills":["Node.js","Docker","AWS"],"premium":True,"college":"NIT Trichy"}
]
db.alumni.insert_many(alumni)

# Seed courses
courses = [
  {"title":"DSA Masterclass","skills":["DSA"],"price":1499,"mentor":"Arjun Mehta"},
  {"title":"SQL for Data Analysts","skills":["SQL","Statistics"],"price":999,"mentor":"Priya Shah"},
  {"title":"System Design Bootcamp","skills":["System Design","Docker"],"price":1999,"mentor":"Rahul Nair"}
]
db.courses.insert_many(courses)
print("Database seeded.")