import axios from "axios";

const ML_API_BASE = import.meta.env.VITE_ML_API_URL || "http://127.0.0.1:8000";

const ML_API = axios.create({
  baseURL: ML_API_BASE,
});

export const predictCareerPaths = async ({ skills, interests, domain, topN = 3 }) => {
  const res = await ML_API.post("/predict", {
    student_skills: skills,
    student_interests: interests,
    target_domain: domain,
    top_n: topN,
  });
  return res.data;
};

export const getDomains = async () => {
  const res = await ML_API.get("/domains");
  return res.data;
};