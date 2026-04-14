import React, { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { predictCareerPaths } from "../../../services/careerService";

const DOMAINS = [
  { name: "Software Engineering", icon: "💻" },
  { name: "Data & AI",            icon: "🤖" },
  { name: "Product Management",   icon: "🗺️" },
  { name: "Design",               icon: "🎨" },
  { name: "Finance",              icon: "📈" },
  { name: "Marketing",            icon: "📣" },
  { name: "Human Resources",      icon: "🤝" },
  { name: "Sales & Business Development", icon: "🚀" },
];

const STEPS = ["Domain", "Skills", "Interests", "Results"];

const scoreColor = (score) => {
  const n = parseFloat(score);
  if (n >= 65) return "#00E5C3";
  if (n >= 55) return "#9B7EFF";
  return "#9494B8";
};

export default function CareerPath() {
  const [step, setStep]         = useState(0);
  const [domain, setDomain]     = useState("");
  const [skills, setSkills]     = useState("");
  const [interests, setInterests] = useState("");
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handlePredict() {
    setLoading(true);
    setError("");
    try {
      const data = await predictCareerPaths({ skills, interests, domain });
      setResults(data);
      setStep(3);
    } catch {
      setError("Could not reach the ML API. Make sure uvicorn is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0); setDomain(""); setSkills("");
    setInterests(""); setResults(null); setError("");
  }

  return (
    <MainLayout>
      <div style={{ padding: "28px 0", maxWidth: 640, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 24, color: "var(--text)", marginBottom: 4 }}>
            Career Path Predictor
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Tell us your skills and interests — we'll match you to real career paths.
          </p>
        </div>

        {/* Progress stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 0 }}>
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  background: i < step ? "var(--purple)" : i === step ? "linear-gradient(135deg,#7C5CFC,#9B7EFF)" : "var(--bg-4)",
                  color: i <= step ? "#fff" : "var(--text-3)",
                  border: i === step ? "2px solid rgba(124,92,252,0.5)" : "2px solid transparent",
                  boxShadow: i === step ? "0 0 12px rgba(124,92,252,0.4)" : "none",
                  transition: "all 0.3s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i <= step ? "var(--purple-light)" : "var(--text-3)", fontWeight: i === step ? 600 : 400 }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 18,
                  background: i < step ? "var(--purple)" : "var(--bg-4)",
                  transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: "28px 24px",
          animation: "fadeUp 0.3s ease",
        }}>

          {/* Step 0 — Domain */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18, marginBottom: 6, color: "var(--text)" }}>
                What field are you aiming for?
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>
                Pick the domain that excites you most.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                {DOMAINS.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setDomain(d.name)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: `1px solid ${domain === d.name ? "rgba(124,92,252,0.5)" : "var(--border)"}`,
                      background: domain === d.name ? "rgba(124,92,252,0.12)" : "var(--bg-3)",
                      color: domain === d.name ? "var(--purple-light)" : "var(--text-2)",
                      fontSize: 13,
                      fontWeight: domain === d.name ? 600 : 400,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.15s",
                      boxShadow: domain === d.name ? "0 0 0 1px rgba(124,92,252,0.3)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{d.icon}</span>
                    <span>{d.name}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!domain}
                onClick={() => setStep(1)}
                style={btnStyle(!domain)}
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 1 — Skills */}
          {step === 1 && (
            <div>
              <h2 style={headingStyle}>What are your skills?</h2>
              <p style={subStyle}>List tools, languages, or abilities you have. Separate with commas.</p>
              <textarea
                style={textareaStyle}
                placeholder="e.g. Python, SQL, data visualization, statistics, machine learning"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={4}
                autoFocus
              />
              <div style={rowStyle}>
                <button style={backBtnStyle} onClick={() => setStep(0)}>← Back</button>
                <button disabled={!skills.trim()} onClick={() => setStep(2)} style={btnStyle(!skills.trim())}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <div>
              <h2 style={headingStyle}>What interests you?</h2>
              <p style={subStyle}>Describe what you enjoy doing or want to work on — be specific.</p>
              <textarea
                style={textareaStyle}
                placeholder="e.g. I love finding patterns in data and building models that solve real-world problems"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={4}
                autoFocus
              />
              {error && (
                <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "rgba(255,75,110,0.1)", borderRadius: 8 }}>
                  ⚠️ {error}
                </p>
              )}
              <div style={rowStyle}>
                <button style={backBtnStyle} onClick={() => setStep(1)}>← Back</button>
                <button
                  disabled={!interests.trim() || loading}
                  onClick={handlePredict}
                  style={btnStyle(!interests.trim() || loading)}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Analyzing...
                    </span>
                  ) : "Find my paths →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Results */}
          {step === 3 && results && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <h2 style={headingStyle}>Your career paths</h2>
                <span style={{ fontSize: 11, background: "var(--bg-4)", color: "var(--text-3)", padding: "3px 10px", borderRadius: 99 }}>
                  {domain}
                </span>
              </div>
              <p style={{ ...subStyle, marginBottom: 20 }}>
                Based on your skills and interests — ranked by match strength.
              </p>

              {results.predictions.map((p, i) => (
                <div key={i} style={{
                  background: "var(--bg-3)",
                  border: `1px solid ${i === 0 ? "rgba(124,92,252,0.3)" : "var(--border)"}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  animation: `fadeUp 0.3s ease both`,
                  animationDelay: `${i * 80}ms`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: i === 0 ? "rgba(124,92,252,0.2)" : "var(--bg-4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: i === 0 ? "var(--purple-light)" : "var(--text-3)",
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 2 }}>
                        {p.career_path}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-3)" }}>{p.experience_level}</p>
                    </div>
                  </div>
                  <div style={{
                    background: `rgba(${scoreColor(p.match_score) === "#00E5C3" ? "0,229,195" : scoreColor(p.match_score) === "#9B7EFF" ? "155,126,255" : "148,148,184"}, 0.15)`,
                    color: scoreColor(p.match_score),
                    borderRadius: 99, padding: "4px 12px",
                    fontSize: 13, fontWeight: 700,
                    fontFamily: "Plus Jakarta Sans",
                  }}>
                    {p.match_score}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                <button style={backBtnStyle} onClick={reset}>
                  Start over
                </button>
                <button
                  style={{ ...btnStyle(false), flex: 1 }}
                  onClick={() => { setStep(0); setResults(null); setDomain(""); setSkills(""); setInterests(""); }}
                >
                  Try another domain →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </MainLayout>
  );
}

// ── Shared styles ──────────────────────────────────────────
const headingStyle = {
  fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18,
  color: "var(--text)", marginBottom: 6,
};
const subStyle = {
  fontSize: 13, color: "var(--text-3)", marginBottom: 18,
};
const textareaStyle = {
  width: "100%", padding: "12px 14px",
  background: "var(--bg-3)", border: "1px solid var(--border)",
  borderRadius: 12, color: "var(--text)", fontSize: 14,
  fontFamily: "DM Sans", resize: "vertical",
  outline: "none", marginBottom: 16,
  lineHeight: 1.6,
};
const rowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const btnStyle = (disabled) => ({
  background: disabled ? "var(--bg-4)" : "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
  color: disabled ? "var(--text-3)" : "#fff",
  border: "none", borderRadius: 10,
  padding: "11px 22px", fontSize: 14, fontWeight: 600,
  fontFamily: "Plus Jakarta Sans",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
  boxShadow: disabled ? "none" : "0 4px 14px rgba(124,92,252,0.3)",
  transition: "all 0.2s",
});
const backBtnStyle = {
  background: "transparent", border: "1px solid var(--border)",
  borderRadius: 10, padding: "11px 18px",
  fontSize: 14, color: "var(--text-2)",
  cursor: "pointer", fontFamily: "DM Sans",
};s