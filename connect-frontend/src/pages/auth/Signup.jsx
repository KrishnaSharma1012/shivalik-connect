import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signupUser, googleAuth } from "../../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import CrownIcon from "../../components/common/CrownIcon";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/></>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const routeState = location.state || {};
  const [step, setStep] = useState(routeState.role ? 2 : 1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: routeState.role || "",
    college: "", company: "",
    alumniPlan: routeState.plan || "simple",
  });
  const [roleLocked] = useState(!!routeState.role);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const signupWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const data = await googleAuth({
          name: userInfo.data.name,
          email: userInfo.data.email,
          avatar: userInfo.data.picture,
          role: form.role,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        login(data.user);

        if (form.role === "alumni") {
          setStep(3);
        } else {
          navigate("/feed");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Google Signup failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Signup Failed"),
  });

  const pwdStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = pwdStrength();
  const strengthColors = ["", "var(--danger)", "var(--orange)", "var(--purple-light)", "var(--teal)"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleNext = () => {
    if (step === 1) {
      if (!form.role) { setError("Please select a role"); return; }
      setError(""); setStep(2);
    } else if (step === 2) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        setError("All fields are required"); return;
      }
      if (form.password !== form.confirmPassword) { setError("Passwords don't match"); return; }
      if (strength < 2) { setError("Password is too weak"); return; }
      setError("");
      if (form.role === "alumni") setStep(3);
      else handleSubmit();
    }
  };

  const handleSubmit = async (overridePlan) => {
    try {
      setLoading(true);
      setError("");
      
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        college: form.college,
        company: form.company,
        alumniPlan: overridePlan || form.alumniPlan,
      };

      const data = await signupUser(payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      login(data.user);

      if (data.user.role === "student") navigate("/feed");
      else navigate("/alumni/dashboard/feed");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleAccent = { student: "var(--purple)", alumni: "var(--orange)" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)", color: "var(--text)" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: 1, display: "none", position: "relative", overflow: "hidden",
        background: "linear-gradient(145deg, #0F1018, #14151F)",
        borderRight: "1px solid var(--border)",
      }} className="left-panel">
        <div style={{
          position: "absolute", top: "15%", left: "10%",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,112,67,0.2) 0%, transparent 70%)",
          filter: "blur(35px)", animation: "float 7s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "10%",
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,252,0.2) 0%, transparent 70%)",
          filter: "blur(30px)", animation: "float 9s ease-in-out infinite reverse",
        }} />

        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: 48,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/connect-logo.png" alt="Connect" style={{ height: 150, width: "auto", objectFit: "contain" }} />
          </div>

          <div>
            <p style={{ fontSize: 12, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              Step {step} of {form.role === "alumni" ? "3" : "2"}
            </p>
            {[
              { n: 1, label: "Choose role" },
              { n: 2, label: "Your details" },
              ...(form.role === "alumni" ? [{ n: 3, label: "Choose plan" }] : []),
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step > s.n
                    ? "linear-gradient(135deg, var(--teal), #00B8A0)"
                    : step === s.n
                    ? "linear-gradient(135deg, #7C5CFC, #9B7EFF)"
                    : "var(--bg-4)",
                  border: `1.5px solid ${step >= s.n ? "transparent" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step >= s.n ? "white" : "var(--text-3)",
                  fontSize: 13, fontWeight: 700,
                  transition: "all 0.3s",
                }}>
                  {step > s.n ? <CheckIcon /> : s.n}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: step >= s.n ? "var(--text)" : "var(--text-3)" }}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />

            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text)" }}>Students</strong> get personalised alumni feeds, course access, and guided support.<br /><br />
              <strong style={{ color: "var(--text)" }}>Alumni</strong> earn from sessions and host on campuses.
            </p>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>© {new Date().getFullYear()} Connect</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px" }}>
        <div className="anim-fadeUp opacity-0" style={{ width: "100%", maxWidth: 440 }}>

          {/* Top navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-3)", fontSize: 13, fontWeight: 500,
                padding: "4px 0",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to home
            </button>

            {step > 1 && (
              <button
                onClick={() => {
                  if (step === 2) {
                    if (roleLocked) navigate("/");
                    else setStep(1);
                  } else {
                    setStep(2);
                  }
                }}
                style={{
                  background: "none", border: "none", color: "var(--text-3)",
                  fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 0",
                }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* ── STEP 1: Role ── */}
          {step === 1 && (
            <div className="anim-fadeIn opacity-0">
              <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Create your account</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15, marginBottom: 10 }}>
                Already have an account?{" "}
                <span style={{ color: "var(--purple-light)", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => navigate("/login")}>Log in</span>
              </p>

              <p style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500, marginBottom: 14 }}>I am a…</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {[
                  {
                    value: "student", label: "Student",
                    desc: "Looking for mentorship, courses, and career guidance from alumni",
                    perks: ["Free to join", "Membership-based alumni access", "College partner discounts"],
                  },
                  {
                    value: "alumni", label: "Alumni",
                    desc: "Ready to share knowledge and host sessions",
                    perks: ["Host paid sessions (Premium)", "Higher revenue share"],
                  },
                ].map(r => (
                  <div key={r.value}
                    onClick={() => set("role", r.value)}
                    style={{
                      padding: "20px 22px", borderRadius: 16, cursor: "pointer",
                      border: `1.5px solid ${form.role === r.value ? roleAccent[r.value] : "var(--border)"}`,
                      background: form.role === r.value
                        ? `linear-gradient(135deg, ${roleAccent[r.value]}18, rgba(255,255,255,0.02))`
                        : "var(--bg-3)",
                      transition: "all 0.2s",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div>
                        <p style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 17 }}>{r.label}</p>
                        <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>{r.desc}</p>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          border: `2px solid ${form.role === r.value ? roleAccent[r.value] : "var(--border)"}`,
                          background: form.role === r.value ? roleAccent[r.value] : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {form.role === r.value && <CheckIcon />}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {r.perks.map((p, i) => (
                        <span key={i} style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
                          background: form.role === r.value ? `${roleAccent[r.value]}20` : "var(--bg-4)",
                          color: form.role === r.value ? roleAccent[r.value] : "var(--text-3)",
                          border: `1px solid ${form.role === r.value ? `${roleAccent[r.value]}30` : "var(--border)"}`,
                        }}>{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {error && <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 14 }}>{error}</p>}
              <button className="btn-purple" onClick={handleNext} style={{ width: "100%", fontSize: 15, padding: 14 }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 2 && (
            <div className="anim-fadeIn opacity-0">
              <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Your details</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15, marginBottom: 7 }}>
                Setting up your <strong style={{ color: "var(--text)" }}>{form.role}</strong> account
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", fontWeight: 500, marginBottom: 7 }}>
                    Full Name
                  </label>
                  <input className="dark-input" placeholder="Arjun Sharma" value={form.name}
                    onChange={e => set("name", e.target.value)} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", fontWeight: 500, marginBottom: 7 }}>
                    Email address
                  </label>
                  <input type="email" className="dark-input" placeholder="you@email.com" value={form.email}
                    onChange={e => set("email", e.target.value)} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", fontWeight: 500, marginBottom: 7 }}>
                    {form.role === "student" ? "College Name" : "Current Company"}
                  </label>
                  <input className="dark-input"
                    placeholder={form.role === "student" ? "e.g. IIT Delhi, DTU…" : "e.g. Google, Amazon…"}
                    value={form.role === "student" ? form.college : form.company}
                    onChange={e => set(form.role === "student" ? "college" : "company", e.target.value)} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", fontWeight: 500, marginBottom: 7 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type={showPwd ? "text" : "password"} className="dark-input"
                      placeholder="Create a strong password" value={form.password}
                      onChange={e => set("password", e.target.value)} style={{ paddingRight: 44 }} />
                    <button onClick={() => setShowPwd(!showPwd)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
                        display: "flex", alignItems: "center" }}>
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= strength ? strengthColors[strength] : "var(--bg-4)",
                            transition: "all 0.3s",
                          }} />
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-2)", fontWeight: 500, marginBottom: 7 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type={showCpwd ? "text" : "password"} className="dark-input"
                      placeholder="Repeat your password" value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)} style={{ paddingRight: 44 }} />
                    <button onClick={() => setShowCpwd(!showCpwd)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
                        display: "flex", alignItems: "center" }}>
                      <EyeIcon open={showCpwd} />
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ padding: "12px 16px", borderRadius: 10, margin: "16px 0",
                  background: "rgba(255,75,110,0.1)", border: "1px solid rgba(255,75,110,0.3)",
                  color: "var(--danger)", fontSize: 13 }}>{error}</div>
              )}

              <button className={form.role === "alumni" ? "btn-orange" : "btn-purple"}
                onClick={handleNext}
                disabled={loading}
                style={{ width: "100%", fontSize: 15, padding: 14, marginTop: 20,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><span className="anim-spin" style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "block" }} />Creating account…</>
                  : form.role === "alumni" ? "Continue to Plan →" : "Create Account →"
                }
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "14px 0" }}>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>or sign up with</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>

              <button className="btn-ghost" onClick={() => signupWithGoogle()} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            </div>
          )}

          {/* ── STEP 3: Alumni Plan ── */}
          {step === 3 && (
            <div className="anim-fadeIn opacity-0">
              <h1 style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Choose your plan</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15, marginBottom: 28 }}>
                You can upgrade or downgrade anytime from your dashboard.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                <div onClick={() => set("alumniPlan", "simple")} style={{
                  padding: "22px 24px", borderRadius: 16, cursor: "pointer",
                  border: `1.5px solid ${form.alumniPlan === "simple" ? "var(--teal)" : "var(--border)"}`,
                  background: form.alumniPlan === "simple" ? "rgba(0,229,195,0.07)" : "var(--bg-3)",
                  transition: "all 0.2s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18 }}>Simple</span>
                      </div>
                      <span style={{ fontSize: 20, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: "var(--teal)" }}>Free</span>
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}> forever</span>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2px solid ${form.alumniPlan === "simple" ? "var(--teal)" : "var(--border)"}`,
                      background: form.alumniPlan === "simple" ? "var(--teal)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {form.alumniPlan === "simple" && <CheckIcon />}
                    </div>
                  </div>
                  {["Post in community feed", "Connect & reply to students", "Build profile & reputation"].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "var(--teal)", fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 13, color: "var(--text-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div onClick={() => set("alumniPlan", "premium")} style={{
                  padding: "22px 24px", borderRadius: 16, cursor: "pointer",
                  border: `1.5px solid ${form.alumniPlan === "premium" ? "var(--orange)" : "var(--border)"}`,
                  background: form.alumniPlan === "premium"
                    ? "linear-gradient(135deg, rgba(255,112,67,0.08), rgba(255,154,108,0.05))"
                    : "var(--bg-3)",
                  transition: "all 0.2s",
                  position: "relative",
                }}>
                  <span style={{ position: "absolute", top: 16, right: 16, display: "inline-flex", alignItems: "center" }}>
                    <CrownIcon size={18} />
                  </span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 18 }}>Premium</span>
                      </div>
                      <span style={{ fontSize: 20, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: "var(--orange)" }}>₹999</span>
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}> /month</span>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `2px solid ${form.alumniPlan === "premium" ? "var(--orange)" : "var(--border)"}`,
                      background: form.alumniPlan === "premium" ? "var(--orange)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {form.alumniPlan === "premium" && <CheckIcon />}
                    </div>
                  </div>
                  {[
                    "Everything in Simple",
                    "Upload courses & workshops",
                    "Host live sessions (set your fee)",
                    "Keep 80% of all revenue",
                    "College campus hosting + extra pay",
                    "Featured profile in search",
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "var(--orange)", fontSize: 12 }}>✓</span>
                      <span style={{ fontSize: 13, color: i === 0 ? "var(--text-3)" : "var(--text-2)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                padding: "12px 16px", borderRadius: 12, marginBottom: 20,
                background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.2)",
                fontSize: 12, color: "var(--text-3)", lineHeight: 1.6,
              }}>
                Connect takes a <strong style={{ color: "var(--purple-light)" }}>platform commission</strong> on session, course, and workshop revenue. The rest is yours.
              </div>

              <button className="btn-orange" onClick={() => handleSubmit(form.alumniPlan)}
                disabled={loading} style={{
                  width: "100%", fontSize: 15, padding: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading
                  ? <><span className="anim-spin" style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "block" }} />Creating account…</>
                  : `Join as ${form.alumniPlan === "premium" ? "Premium Alumni" : "Alumni"} →`
                }
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .left-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}