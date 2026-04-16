import React, { useState } from "react";

const inputStyle = {
  width: "100%", padding: "11px 14px",
  background: "var(--bg-3)", border: "1px solid var(--border)",
  borderRadius: 11, color: "var(--text)", fontSize: 14,
  outline: "none", fontFamily: "DM Sans", transition: "border-color 0.2s, box-shadow 0.2s",
};

const labelStyle = {
  display: "block", fontSize: 12, color: "var(--text-3)",
  fontWeight: 600, marginBottom: 7, letterSpacing: "0.02em",
};

export default function EditProfile({ user = {}, onSave }) {
  const [form, setForm] = useState({
    name:    user.name    || "",
    email:   user.email   || "",
    title:   user.title   || "",
    company: user.company || "",
    college: user.college || "",
    about:   user.about   || "",
    degree:  user.degree  || "",
    joiningYear: user.joiningYear || "",
    passingYear: user.passingYear || "",
    skills:  user.skills?.join(", ") || "",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    onSave?.({
      ...form,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    });
  };

  const fields = [
    { key: "name",    label: "Full Name",       placeholder: "e.g. Rahul Sharma"             },
    { key: "email",   label: "Email Address",   placeholder: "e.g. rahul@example.com"        },
    { key: "title",   label: "Title / Position", placeholder: "e.g. Software Engineer" },
    { key: "company", label: "Company",         placeholder: "e.g. Google" },
    { key: "college", label: "College",          placeholder: "e.g. Ajay Kumar Garg Engineering College" },
    { key: "degree",  label: "Degree",           placeholder: "e.g. B.Tech" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {fields.map(f => (
        <div key={f.key}>
          <label style={labelStyle}>{f.label}</label>
          <input
            type="text"
            value={form[f.key]}
            onChange={e => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>Joining Year</label>
          <input
            type="number"
            value={form.joiningYear}
            onChange={e => set("joiningYear", e.target.value)}
            placeholder="2020"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Passing Year</label>
          <input
            type="number"
            value={form.passingYear}
            onChange={e => set("passingYear", e.target.value)}
            placeholder="2024"
            style={inputStyle}
          />
        </div>
      </div>

      {/* About */}
      <div>
        <label style={labelStyle}>About</label>
        <textarea
          rows={4}
          value={form.about}
          onChange={e => set("about", e.target.value)}
          placeholder="Tell students about your experience and what you can help with…"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      {/* Skills */}
      <div>
        <label style={labelStyle}>Skills (comma separated)</label>
        <input
          type="text"
          value={form.skills}
          onChange={e => set("skills", e.target.value)}
          placeholder="DSA, React, System Design, Python…"
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
        />
        {/* Skill chips preview */}
        {form.skills && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {form.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, i) => (
              <span key={i} style={{
                padding: "3px 12px", borderRadius: 99, fontSize: 12,
                background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.22)",
                color: "var(--purple-light)",
              }}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button onClick={handleSubmit} style={{
        width: "100%", padding: "13px",
        background: "linear-gradient(135deg, #7C5CFC, #9B7EFF)",
        border: "none", borderRadius: 12,
        color: "white", fontSize: 15, fontWeight: 700, fontFamily: "Plus Jakarta Sans",
        cursor: "pointer", transition: "opacity 0.2s",
        boxShadow: "0 6px 20px rgba(124,92,252,0.35)",
        marginTop: 4,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Save Changes →
      </button>
    </div>
  );
}