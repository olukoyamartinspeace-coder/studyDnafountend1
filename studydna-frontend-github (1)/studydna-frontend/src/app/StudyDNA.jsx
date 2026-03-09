import { useState, useEffect, useRef } from "react";

/* ─── THEME ───────────────────────────────────────────────── */
const T = {
  bg: "#060810", sidebar: "#080b18", panel: "rgba(12,17,38,0.92)",
  card: "rgba(14,19,42,0.85)", border: "rgba(0,234,255,0.12)",
  borderHover: "rgba(0,234,255,0.35)", neon: "#00eaff", purple: "#7c3aed",
  purpleL: "#a855f7", gold: "#f59e0b", green: "#10b981", red: "#f43f5e",
  amber: "#f97316", white: "#eef2ff", sub: "#94a3b8", muted: "#3d4d6e",
};

/* ─── DATA ────────────────────────────────────────────────── */
const PERSONALITY_QS = [
  { id: 1, text: "I enjoy solving complex logical problems.", trait: "logic", category: "Analytical Thinking" },
  { id: 2, text: "I prefer designing or drawing over calculating.", trait: "creativity", category: "Creative Expression" },
  { id: 3, text: "I like leading groups and inspiring others.", trait: "leadership", category: "Social Influence" },
  { id: 4, text: "I enjoy debating ideas and persuading people.", trait: "communication", category: "Communication" },
  { id: 5, text: "I'm naturally curious — I love researching topics deeply.", trait: "curiosity", category: "Curiosity" },
  { id: 6, text: "Mathematics feels intuitive and satisfying to me.", trait: "logic", category: "Analytical Thinking" },
  { id: 7, text: "I often think in images, colors, and shapes.", trait: "creativity", category: "Creative Expression" },
  { id: 8, text: "I feel energized when working with others.", trait: "communication", category: "Communication" },
  { id: 9, text: "I enjoy understanding how living systems work.", trait: "science", category: "Scientific Mind" },
  { id: 10, text: "I prefer finding answers independently rather than being told.", trait: "curiosity", category: "Curiosity" },
];
const SKILLS_QS = [
  { id: 11, text: "How strong are your mathematics skills?", trait: "math", category: "Quantitative" },
  { id: 12, text: "How strong are your writing & language skills?", trait: "writing", category: "Verbal" },
  { id: 13, text: "How strong are your technology & coding skills?", trait: "tech", category: "Technical" },
  { id: 14, text: "How strong are your artistic / creative skills?", trait: "art", category: "Creative" },
  { id: 15, text: "How strong are your science & research skills?", trait: "science", category: "Scientific" },
];
const OPTIONS = [
  { label: "Strongly Agree", score: 5 }, { label: "Agree", score: 4 },
  { label: "Neutral", score: 3 }, { label: "Disagree", score: 2 },
  { label: "Strongly Disagree", score: 1 },
];
const COURSES = [
  { id: "cs", name: "Computer Science", slug: "computer-science", icon: "⬡", color: "#00eaff", weights: { logic: 10, math: 9, tech: 10, curiosity: 7, creativity: 5 }, careers: ["Software Engineer", "AI/ML Engineer", "Data Scientist", "Cloud Architect", "Cybersecurity Analyst"], universities: ["University of Lagos", "Covenant University", "University of Ibadan", "Babcock University"], description: "Design algorithms, build systems, and shape the digital world.", salary: "₦2.5M – ₦8M / year", skills: ["Algorithm Design", "Programming", "System Architecture", "Data Analysis"] },
  { id: "eng", name: "Engineering", slug: "engineering", icon: "⚙", color: "#f59e0b", weights: { logic: 9, math: 10, science: 8, curiosity: 6, tech: 7 }, careers: ["Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Petroleum Engineer"], universities: ["University of Lagos", "Obafemi Awolowo University", "ABU Zaria", "FUTA"], description: "Build bridges, machines, energy systems, and the physical world.", salary: "₦1.8M – ₦6M / year", skills: ["Technical Drawing", "Physics", "Calculus", "Project Management"] },
  { id: "med", name: "Medicine", slug: "medicine", icon: "✦", color: "#f43f5e", weights: { science: 10, curiosity: 9, communication: 7, logic: 6, writing: 5 }, careers: ["Medical Doctor", "Surgeon", "Researcher", "Public Health Officer"], universities: ["University of Lagos", "University of Ibadan", "ABU Zaria"], description: "Heal, diagnose, and advance human health through science.", salary: "₦3M – ₦12M / year", skills: ["Anatomy", "Biochemistry", "Clinical Reasoning", "Patient Care"] },
  { id: "arch", name: "Architecture", slug: "architecture", icon: "◈", color: "#a855f7", weights: { creativity: 10, art: 10, math: 6, logic: 7, curiosity: 6 }, careers: ["Architect", "Urban Designer", "Interior Designer", "Structural Consultant"], universities: ["University of Lagos", "Covenant University", "Obafemi Awolowo University"], description: "Design spaces that shape how humans live, work, and interact.", salary: "₦1.5M – ₦5M / year", skills: ["Structural Design", "3D Modelling", "Urban Planning", "Technical Drawing"] },
  { id: "law", name: "Law", slug: "law", icon: "⊗", color: "#f97316", weights: { communication: 10, writing: 10, curiosity: 8, leadership: 7, logic: 6 }, careers: ["Barrister", "Corporate Lawyer", "Judge", "Legal Consultant"], universities: ["University of Lagos", "University of Ibadan", "University of Nigeria"], description: "Argue, advocate, and uphold justice in society.", salary: "₦1.2M – ₦7M / year", skills: ["Legal Research", "Argumentation", "Critical Analysis", "Written Advocacy"] },
  { id: "psych", name: "Psychology", slug: "psychology", icon: "◉", color: "#10b981", weights: { communication: 9, curiosity: 9, writing: 7, science: 6, leadership: 5 }, careers: ["Clinical Psychologist", "Counselor", "HR Specialist", "Researcher"], universities: ["University of Lagos", "University of Ibadan", "Babcock University"], description: "Understand the human mind and help people thrive.", salary: "₦900K – ₦4M / year", skills: ["Behavioral Analysis", "Counseling", "Research Methods", "Empathy"] },
];

const WAEC_SUBJECTS = ["English Language", "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature in English", "Further Mathematics", "Agricultural Science", "Geography", "Commerce", "Accounting", "Technical Drawing", "Computer Studies"];
const WAEC_GRADES = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];
const GRADE_ORDER = ["A1","B2","B3","C4","C5","C6","D7","E8","F9"];

function gradeColor(g) {
  if (!g) return T.muted;
  const i = GRADE_ORDER.indexOf(g);
  if (i <= 1) return "#10b981";
  if (i <= 3) return "#00eaff";
  if (i <= 5) return "#f59e0b";
  return "#f43f5e";
}
function gradePassesMin(userGrade, minGrade) {
  return GRADE_ORDER.indexOf(userGrade) <= GRADE_ORDER.indexOf(minGrade);
}
function computeScores(answers) {
  return answers.reduce((acc, { trait, score }) => { acc[trait] = (acc[trait] || 0) + score; return acc; }, {});
}
function rankCourses(traits) {
  return COURSES.map((c) => {
    let total = 0, wSum = 0;
    Object.entries(c.weights).forEach(([t, w]) => { total += (traits[t] || 0) * w; wSum += w * 5; });
    return { ...c, match: Math.round((total / wSum) * 100) };
  }).sort((a, b) => b.match - a.match);
}

// Eligibility engine (client-side for demo)
function checkEligibility(jambScore, gradeMap, req) {
  const subjects = req.requiredSubjects;
  const jambMet = jambScore >= req.minJamb;
  const jambGap = jambMet ? 0 : req.minJamb - jambScore;
  const missing = subjects.filter(s => !gradeMap[s.toLowerCase()]);
  const failed = subjects.filter(s => gradeMap[s.toLowerCase()]).filter(s => !gradePassesMin(gradeMap[s.toLowerCase()], req.minGrade)).map(s => ({ subject: s, userGrade: gradeMap[s.toLowerCase()], required: req.minGrade }));
  const creditCount = subjects.filter(s => { const g = gradeMap[s.toLowerCase()]; return g && gradePassesMin(g, "C6"); }).length;
  let status;
  if (jambMet && missing.length === 0 && failed.length === 0 && creditCount >= req.creditsRequired) status = "eligible";
  else if (jambGap <= 20 && missing.length === 0 && failed.length <= 1) status = "possible";
  else status = "ineligible";
  return { status, jambMet, jambGap, missingSubjects: missing, failedGrades: failed, creditCount, minJamb: req.minJamb, minGrade: req.minGrade };
}

const DEMO_REQUIREMENTS = {
  "computer-science": [
    { uniName: "University of Lagos", shortName: "UNILAG", colorHex: "#00eaff", logoSymbol: "⬡", state: "Lagos", minJamb: 220, requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "University of Ibadan", shortName: "UI", colorHex: "#a855f7", logoSymbol: "◈", state: "Oyo", minJamb: 200, requiredSubjects: ["English Language", "Mathematics", "Physics"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "Covenant University", shortName: "CU", colorHex: "#f59e0b", logoSymbol: "✦", state: "Ogun", minJamb: 180, requiredSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "Obafemi Awolowo University", shortName: "OAU", colorHex: "#10b981", logoSymbol: "⊗", state: "Osun", minJamb: 210, requiredSubjects: ["English Language", "Mathematics", "Physics"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "Babcock University", shortName: "BU", colorHex: "#f43f5e", logoSymbol: "◉", state: "Ogun", minJamb: 160, requiredSubjects: ["English Language", "Mathematics", "Physics"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "ABU Zaria", shortName: "ABU", colorHex: "#f97316", logoSymbol: "⚙", state: "Kaduna", minJamb: 190, requiredSubjects: ["English Language", "Mathematics", "Physics"], minGrade: "C6", creditsRequired: 5 },
    { uniName: "University of Nigeria", shortName: "UNN", colorHex: "#00ff9d", logoSymbol: "⬡", state: "Enugu", minJamb: 200, requiredSubjects: ["English Language", "Mathematics", "Physics"], minGrade: "C6", creditsRequired: 5 },
  ],
  "medicine": [
    { uniName: "University of Lagos", shortName: "UNILAG", colorHex: "#00eaff", logoSymbol: "⬡", state: "Lagos", minJamb: 280, requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"], minGrade: "B3", creditsRequired: 5, notes: "Average admission 320+" },
    { uniName: "University of Ibadan", shortName: "UI", colorHex: "#a855f7", logoSymbol: "◈", state: "Oyo", minJamb: 270, requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"], minGrade: "B3", creditsRequired: 5 },
    { uniName: "Obafemi Awolowo University", shortName: "OAU", colorHex: "#10b981", logoSymbol: "⊗", state: "Osun", minJamb: 260, requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"], minGrade: "B3", creditsRequired: 5 },
    { uniName: "Babcock University", shortName: "BU", colorHex: "#f43f5e", logoSymbol: "◉", state: "Ogun", minJamb: 240, requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"], minGrade: "C4", creditsRequired: 5 },
    { uniName: "ABU Zaria", shortName: "ABU", colorHex: "#f97316", logoSymbol: "⚙", state: "Kaduna", minJamb: 250, requiredSubjects: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics"], minGrade: "B3", creditsRequired: 5 },
  ],
};

async function askClaude(messages, courseContext) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `You are StudyDNA's AI career advisor for Nigerian students. The student is exploring ${courseContext}. Answer questions about courses, careers, Nigerian universities, JAMB/WAEC requirements, and salary in 3-5 sentences.`, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "I couldn't connect. Please try again.";
}

/* ─── SHARED UI ───────────────────────────────────────────── */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let raf;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 110 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.1 + 0.15, tw: Math.random() * Math.PI * 2, sp: Math.random() * 0.1 + 0.03 }));
    const draw = () => { ctx.clearRect(0, 0, c.width, c.height); stars.forEach((s) => { s.tw += 0.015; const a = 0.2 + 0.15 * Math.sin(s.tw); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,234,255,${a})`; ctx.fill(); s.y -= s.sp; if (s.y < 0) { s.y = c.height; s.x = Math.random() * c.width; } }); raf = requestAnimationFrame(draw); };
    draw(); return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.55 }} />;
}
const Pill = ({ children, color = T.neon }) => (<span style={{ fontFamily: "'DM Sans'", fontSize: 11, color, border: `1px solid ${color}44`, borderRadius: 999, padding: "3px 10px", letterSpacing: 0.5 }}>{children}</span>);
const StatBar = ({ value, max = 100, color = T.neon, label, sublabel }) => (<div><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>{label}</span>{sublabel && <span style={{ fontFamily: "'Orbitron'", fontSize: 10, color }}>{sublabel}</span>}</div><div style={{ height: 4, background: T.muted + "44", borderRadius: 999 }}><div style={{ width: `${(value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}66, ${color})`, borderRadius: 999, boxShadow: `0 0 6px ${color}66`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} /></div></div>);
const GlowBtn = ({ children, onClick, color = T.neon, variant = "outline", style = {}, disabled = false }) => {
  const base = { fontFamily: "'Orbitron'", fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", borderRadius: 10, padding: "11px 28px", transition: "all 0.2s", border: "none", outline: "none", ...style };
  return (<button onClick={disabled ? undefined : onClick} style={variant === "filled" ? { ...base, background: disabled ? T.muted : color, color: disabled ? T.sub : "#000", boxShadow: disabled ? "none" : `0 0 24px ${color}55` } : { ...base, background: "transparent", color: disabled ? T.muted : color, border: `1.5px solid ${disabled ? T.muted : color}`, boxShadow: disabled ? "none" : `0 0 14px ${color}22` }} onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.boxShadow = `0 0 32px ${color}66`; }} onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.boxShadow = variant === "filled" ? `0 0 24px ${color}55` : `0 0 14px ${color}22`; }}>{children}</button>);
};

/* ─── NAVBAR ──────────────────────────────────────────────── */
const ALL_STEPS = ["Profile", "Personality", "Skills", "Exam Results", "Analysis", "Results", "Universities"];
const STEP_MAP = { signup: 0, personality: 1, skills: 2, exam: 3, processing: 4, results: 5, eligibility: 6 };
function Navbar({ screen, user }) {
  const current = STEP_MAP[screen] ?? -1;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, zIndex: 200, background: `${T.bg}ee`, borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(20px)", display: "flex", alignItems: "center", padding: "0 32px", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${T.neon}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: `0 0 12px ${T.neon}44` }}>◈</div>
        <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 15, color: T.white }}>Study<span style={{ color: T.neon }}>DNA</span></span>
      </div>
      {current >= 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center", overflowX: "auto" }}>
          {ALL_STEPS.map((s, i) => {
            const done = i < current; const active = i === current;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? T.green : active ? T.neon : "transparent", border: `1.5px solid ${done ? T.green : active ? T.neon : T.muted}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'Orbitron'", color: (done || active) ? "#000" : T.muted, fontWeight: 800, flexShrink: 0 }}>{done ? "✓" : i + 1}</div>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: active ? T.white : done ? T.sub : T.muted, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < ALL_STEPS.length - 1 && <div style={{ width: 16, height: 1, background: done ? T.green + "66" : T.muted + "33", flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {user && <span style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 12 }}>{user.name?.split(" ")[0]}</span>}
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${T.purple}44`, border: `1.5px solid ${T.purpleL}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{user ? user.name?.[0]?.toUpperCase() : "?"}</div>
      </div>
    </div>
  );
}

/* ─── LANDING ─────────────────────────────────────────────── */
function Landing({ onStart }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const features = [
    { icon: "◈", label: "Personality Matrix", desc: "Deep personality & skill analysis" },
    { icon: "⬡", label: "AI Course Matching", desc: "Smart algorithm across 6 courses" },
    { icon: "✦", label: "Exam Eligibility", desc: "WAEC + JAMB university matching" },
    { icon: "◉", label: "University Finder", desc: "7 Nigerian universities checked" },
  ];
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-24px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>
        <Pill color={T.neon}>Nigerian Academic Intelligence Platform</Pill>
        <h1 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: "clamp(36px, 4vw, 60px)", color: T.white, lineHeight: 1.06, margin: "24px 0 20px", textShadow: `0 0 80px ${T.neon}22` }}>Discover Your<br /><span style={{ color: T.neon }}>Academic</span><br />DNA</h1>
        <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 16, lineHeight: 1.75, marginBottom: 40, maxWidth: 440 }}>Answer 15 questions. Enter your WAEC & JAMB scores. Our AI maps your personality to the right course — then checks every Nigerian university that will accept you.</p>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <GlowBtn onClick={onStart} color={T.neon} variant="filled" style={{ padding: "14px 40px", fontSize: 12 }}>Begin Analysis</GlowBtn>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: T.muted }}>~8 minutes · Free</span>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 52, paddingTop: 32, borderTop: `1px solid ${T.border}` }}>
          {[["6", "Courses"], ["7", "Universities"], ["2", "Exam Types"]].map(([v, l]) => (<div key={l}><div style={{ fontFamily: "'Orbitron'", fontSize: 22, fontWeight: 900, color: T.neon }}>{v}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.muted, marginTop: 3 }}>{l}</div></div>))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px 80px 32px", gap: 16, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(24px)", transition: "all 1s 0.15s cubic-bezier(0.16,1,0.3,1)" }}>
        {features.map((f, i) => (
          <div key={f.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 18, backdropFilter: "blur(16px)", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: `all 0.7s ${0.2 + i * 0.08}s cubic-bezier(0.16,1,0.3,1)`, cursor: "default" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = `0 0 20px ${T.neon}10`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.neon}10`, border: `1px solid ${T.neon}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: T.neon, flexShrink: 0 }}>{f.icon}</div>
            <div><div style={{ fontFamily: "'Orbitron'", fontSize: 13, fontWeight: 700, color: T.white, marginBottom: 3 }}>{f.label}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>{f.desc}</div></div>
            <div style={{ marginLeft: "auto", color: T.muted }}>→</div>
          </div>
        ))}
      </div>
      <div style={{ position: "fixed", top: "30%", left: "8%", width: 500, height: 500, background: `radial-gradient(circle, ${T.purple}16 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0 }} />
    </div>
  );
}

/* ─── SIGNUP ──────────────────────────────────────────────── */
function Signup({ onComplete }) {
  const [form, setForm] = useState({ name: "", age: "", country: "Nigeria", interest: "" });
  const valid = form.name.trim() && form.age && form.interest.trim();
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", borderRight: `1px solid ${T.border}` }}>
        <Pill color={T.purpleL}>Step 1 of 7</Pill>
        <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 34, color: T.white, margin: "18px 0 14px" }}>Your Profile</h2>
        <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 14, lineHeight: 1.8, marginBottom: 36 }}>We personalise your course recommendations and filter universities in your country.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[{ icon: "◈", label: "Personalized Results", desc: "Your profile shapes the algorithm" }, { icon: "⬡", label: "Nigerian University Filter", desc: "Only universities in your region" }, { icon: "✦", label: "Private & Secure", desc: "Your data stays in your session" }].map((item) => (
            <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ color: T.neon, fontSize: 14, marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
              <div><div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: T.white }}>{item.label}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.muted }}>{item.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 64px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {[{ key: "name", label: "Full Name", placeholder: "Ada Okonkwo" }, { key: "age", label: "Age", placeholder: "17", type: "number" }, { key: "country", label: "Country", placeholder: "Nigeria" }, { key: "interest", label: "Academic Interest", placeholder: "e.g. Science, Arts, Commerce" }].map(({ key, label, placeholder, type = "text" }) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.sub, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 7, fontWeight: 600 }}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", color: T.white, fontFamily: "'DM Sans'", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={(e) => (e.target.style.borderColor = T.neon)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
            </div>
          ))}
          <GlowBtn onClick={() => valid && onComplete(form)} disabled={!valid} color={T.neon} variant="filled" style={{ width: "100%", padding: "14px", textAlign: "center", marginTop: 8 }}>Continue to Personality Test →</GlowBtn>
        </div>
      </div>
    </div>
  );
}

/* ─── QUESTION SCREEN ─────────────────────────────────────── */
function QuestionScreen({ questions, subtitle, phase, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fade, setFade] = useState(false);
  const q = questions[idx];
  const progress = ((idx + (selected ? 1 : 0)) / questions.length) * 100;
  const traitTotals = answers.reduce((acc, { trait, score }) => { acc[trait] = (acc[trait] || 0) + score; return acc; }, {});
  const colors = ["#10b981", "#00eaff", "#94a3b8", "#f97316", "#f43f5e"];
  const choose = (opt) => {
    setSelected(opt.score);
    setTimeout(() => {
      const next = [...answers, { trait: q.trait, score: opt.score }];
      if (idx + 1 < questions.length) { setFade(true); setTimeout(() => { setIdx(idx + 1); setSelected(null); setFade(false); }, 300); }
      else onComplete(next);
    }, 380);
  };
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "280px 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ borderRight: `1px solid ${T.border}`, padding: "36px 24px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <Pill color={T.purpleL}>{subtitle}</Pill>
          <h3 style={{ fontFamily: "'Orbitron'", fontSize: 17, fontWeight: 800, color: T.white, margin: "14px 0 6px" }}>Progress</h3>
          <div style={{ height: 5, background: T.muted + "44", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}><div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.purple}, ${T.neon})`, borderRadius: 999, transition: "width 0.4s" }} /></div>
          <div style={{ fontFamily: "'Orbitron'", fontSize: 10, color: T.neon }}>{idx + 1}/{questions.length} · {Math.round(progress)}%</div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Journey Phases</div>
          {["Profile", "Personality", "Skills", "Exam Results", "Analysis", "Results", "Universities"].map((ph, i) => (
            <div key={ph} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < phase ? T.green : i === phase ? T.neon : "transparent", border: `1.5px solid ${i < phase ? T.green : i === phase ? T.neon : T.muted}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontFamily: "'Orbitron'", color: i <= phase ? "#000" : T.muted, fontWeight: 800, flexShrink: 0 }}>{i < phase ? "✓" : i + 1}</div>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: i === phase ? T.white : i < phase ? T.sub : T.muted, fontWeight: i === phase ? 600 : 400 }}>{ph}</span>
            </div>
          ))}
        </div>
        {Object.keys(traitTotals).length > 0 && (
          <div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Live Signals</div>
            {Object.entries(traitTotals).map(([trait, score]) => (<StatBar key={trait} label={trait.charAt(0).toUpperCase() + trait.slice(1)} value={score} max={10} sublabel={score + "/10"} color={T.neon} />))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", maxWidth: 760 }}>
        <div style={{ marginBottom: 10 }}><Pill color={T.sub}>{q.category}</Pill></div>
        <h2 style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "clamp(20px, 2.2vw, 26px)", color: T.white, lineHeight: 1.55, marginBottom: 44, opacity: fade ? 0 : 1, transform: fade ? "translateX(-14px)" : "none", transition: "all 0.28s" }}>{q.text}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPTIONS.map((opt) => {
            const isSel = selected === opt.score; const col = colors[5 - opt.score];
            return (
              <button key={opt.label} onClick={() => !selected && choose(opt)} style={{ display: "flex", alignItems: "center", gap: 18, padding: "15px 22px", background: isSel ? `${col}12` : T.card, border: `1px solid ${isSel ? col : T.border}`, borderRadius: 12, color: isSel ? col : T.white, fontFamily: "'DM Sans'", fontSize: 14, cursor: selected ? "default" : "pointer", textAlign: "left", transition: "all 0.18s", boxShadow: isSel ? `0 0 18px ${col}22` : "none" }} onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = col; e.currentTarget.style.background = `${col}08`; } }} onMouseLeave={(e) => { if (!isSel) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; } }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${isSel ? col : T.muted}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron'", fontSize: 9, color: isSel ? col : T.muted, flexShrink: 0, fontWeight: 700 }}>{opt.score}</div>
                <span style={{ fontWeight: isSel ? 600 : 400 }}>{opt.label}</span>
                {isSel && <span style={{ marginLeft: "auto", fontSize: 13 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── EXAM CHAMBER ────────────────────────────────────────── */
function ExamChamber({ onComplete }) {
  const [examType, setExamType] = useState("WAEC");
  const [jambScore, setJambScore] = useState("");
  const [grades, setGrades] = useState({});
  const [activeSubject, setActiveSubject] = useState(null);
  const [jambYear, setJambYear] = useState("2024");

  const enteredCount = Object.keys(grades).length;
  const canContinue = jambScore && parseInt(jambScore) >= 0 && parseInt(jambScore) <= 400 && enteredCount >= 5;

  const subjectGroups = [
    { label: "Core Subjects", subjects: ["English Language", "Mathematics"] },
    { label: "Sciences", subjects: ["Physics", "Chemistry", "Biology", "Further Mathematics"] },
    { label: "Social Sciences", subjects: ["Economics", "Government", "Geography", "Commerce"] },
    { label: "Humanities", subjects: ["Literature in English", "Accounting", "Agricultural Science", "Technical Drawing"] },
  ];

  const handleContinue = () => {
    const results = Object.entries(grades).map(([subject, grade]) => ({ subject, grade }));
    onComplete({ examType, jambScore: parseInt(jambScore), jambYear: parseInt(jambYear), results });
  };

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "300px 1fr", position: "relative", zIndex: 1 }}>
      {/* LEFT sidebar */}
      <div style={{ borderRight: `1px solid ${T.border}`, padding: "36px 24px", display: "flex", flexDirection: "column", gap: 28, overflowY: "auto" }}>
        <div>
          <Pill color={T.gold}>Step 4 of 7</Pill>
          <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 20, color: T.white, margin: "14px 0 10px" }}>Exam Chamber</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: T.sub, lineHeight: 1.7 }}>Enter your O-Level results and JAMB score. We'll find universities that will accept you.</p>
        </div>

        {/* JAMB Score input */}
        <div style={{ background: `${T.gold}0d`, border: `1px solid ${T.gold}33`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontFamily: "'Orbitron'", fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>JAMB UTME Score</div>
          <input type="number" min="0" max="400" placeholder="e.g. 245" value={jambScore} onChange={(e) => setJambScore(e.target.value)}
            style={{ width: "100%", background: T.card, border: `1px solid ${jambScore ? T.gold + "66" : T.border}`, borderRadius: 10, padding: "12px 14px", color: T.white, fontFamily: "'Orbitron'", fontSize: 18, fontWeight: 800, outline: "none", boxSizing: "border-box", textAlign: "center" }}
            onFocus={(e) => (e.target.style.borderColor = T.gold)} onBlur={(e) => (e.target.style.borderColor = jambScore ? T.gold + "66" : T.border)} />
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted, textAlign: "center", marginTop: 6 }}>Maximum: 400 points</div>
          {jambScore && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 4, background: T.muted + "44", borderRadius: 999 }}>
                <div style={{ width: `${(parseInt(jambScore) / 400) * 100}%`, height: "100%", background: parseInt(jambScore) >= 200 ? T.gold : T.red, borderRadius: 999, transition: "width 0.3s" }} />
              </div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: parseInt(jambScore) >= 200 ? T.gold : T.red, marginTop: 5, textAlign: "center" }}>
                {parseInt(jambScore) >= 250 ? "Excellent score" : parseInt(jambScore) >= 200 ? "Good score" : parseInt(jambScore) >= 150 ? "Below average" : "Low score"}
              </div>
            </div>
          )}
        </div>

        {/* Exam type toggle */}
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>O-Level Exam Type</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["WAEC", "NECO"].map((t) => (
              <button key={t} onClick={() => setExamType(t)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: examType === t ? `${T.neon}18` : T.card, border: `1.5px solid ${examType === t ? T.neon : T.border}`, color: examType === t ? T.neon : T.sub, fontFamily: "'Orbitron'", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>Subjects entered</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 12, color: enteredCount >= 5 ? T.green : T.neon, fontWeight: 700 }}>{enteredCount} / 5 min</span>
          </div>
          <div style={{ height: 4, background: T.muted + "44", borderRadius: 999 }}>
            <div style={{ width: `${Math.min((enteredCount / 5) * 100, 100)}%`, height: "100%", background: enteredCount >= 5 ? T.green : T.neon, borderRadius: 999, transition: "width 0.4s" }} />
          </div>
          {enteredCount > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(grades).map(([subj, grade]) => (
                <div key={subj} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.sub, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{subj}</span>
                  <span style={{ fontFamily: "'Orbitron'", fontSize: 11, fontWeight: 700, color: gradeColor(grade), background: gradeColor(grade) + "18", border: `1px solid ${gradeColor(grade)}44`, borderRadius: 6, padding: "2px 8px" }}>{grade}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <GlowBtn onClick={handleContinue} disabled={!canContinue} color={T.green} variant="filled" style={{ width: "100%", textAlign: "center", fontSize: 11 }}>
          {canContinue ? "Run Eligibility Check →" : `Enter ${Math.max(0, 5 - enteredCount)} more subjects`}
        </GlowBtn>
      </div>

      {/* RIGHT — subject grid */}
      <div style={{ padding: "40px 48px", overflowY: "auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 24, color: T.white, marginBottom: 8 }}>O-Level Subject Results</h2>
          <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 14 }}>Click a subject to enter your grade. Enter at least 5 subjects including English and Mathematics.</p>
        </div>

        {subjectGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>{group.label}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {group.subjects.map((subject) => {
                const grade = grades[subject];
                const isActive = activeSubject === subject;
                const gc = gradeColor(grade);
                return (
                  <div key={subject}>
                    <button onClick={() => setActiveSubject(isActive ? null : subject)}
                      style={{ width: "100%", background: grade ? `${gc}10` : isActive ? `${T.neon}08` : T.card, border: `1.5px solid ${grade ? gc + "66" : isActive ? T.neon : T.border}`, borderRadius: 14, padding: "18px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", position: "relative" }}
                      onMouseEnter={(e) => { if (!grade && !isActive) { e.currentTarget.style.borderColor = T.neon + "44"; } }}
                      onMouseLeave={(e) => { if (!grade && !isActive) { e.currentTarget.style.borderColor = T.border; } }}
                    >
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: grade ? T.white : T.sub, marginBottom: 8 }}>{subject}</div>
                      {grade ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: "'Orbitron'", fontSize: 20, fontWeight: 900, color: gc }}>{grade}</span>
                          <span style={{ fontSize: 10, color: gc }}>{GRADE_ORDER.indexOf(grade) <= 2 ? "Excellent" : GRADE_ORDER.indexOf(grade) <= 4 ? "Credit" : GRADE_ORDER.indexOf(grade) <= 5 ? "Pass" : "Fail"}</span>
                        </div>
                      ) : (
                        <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted }}>{isActive ? "Select grade below ↓" : "Click to enter grade"}</div>
                      )}
                    </button>
                    {/* Grade picker */}
                    {isActive && (
                      <div style={{ marginTop: 6, background: T.sidebar, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px", display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 4 }}>
                        {WAEC_GRADES.map((g) => {
                          const gc2 = gradeColor(g);
                          return (
                            <button key={g} onClick={() => { setGrades(prev => ({ ...prev, [subject]: g })); setActiveSubject(null); }}
                              style={{ padding: "8px 4px", background: grades[subject] === g ? `${gc2}20` : "transparent", border: `1px solid ${grades[subject] === g ? gc2 : T.muted + "44"}`, borderRadius: 8, color: gc2, fontFamily: "'Orbitron'", fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = `${gc2}18`; e.currentTarget.style.borderColor = gc2; }}
                              onMouseLeave={(e) => { if (grades[subject] !== g) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.muted + "44"; } }}
                            >{g}</button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PROCESSING ──────────────────────────────────────────── */
function Processing({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Mapping Personality Matrix", desc: "Scoring 10 trait dimensions" },
    { label: "Calibrating Skill Signals", desc: "Weighting cognitive abilities" },
    { label: "Running Course Match Algorithm", desc: "Comparing 6 course profiles" },
    { label: "Parsing Exam Results", desc: "Reading WAEC/NECO grades" },
    { label: "Checking University Requirements", desc: "Matching against 7 institutions" },
    { label: "Generating Eligibility Report", desc: "Building your university map" },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setStep(i); if (i >= steps.length) { clearInterval(t); setTimeout(onDone, 900); } }, 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", borderRight: `1px solid ${T.border}` }}>
        <Pill color={T.neon}>Phase 5 of 7</Pill>
        <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 30, color: T.white, margin: "18px 0 12px" }}>Analyzing Your DNA</h2>
        <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 14, lineHeight: 1.75, marginBottom: 40 }}>Cross-referencing your personality, skills, and exam results against every university's requirements.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {steps.map((s, i) => {
            const done = i < step; const active = i === step - 1;
            return (
              <div key={s.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", opacity: done || active ? 1 : 0.22, transition: "opacity 0.4s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: done ? T.green : active ? T.neon : "transparent", border: `1.5px solid ${done ? T.green : active ? T.neon : T.muted}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontFamily: "'Orbitron'", color: (done || active) ? "#000" : T.muted, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{done ? "✓" : ""}</div>
                <div><div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: done ? T.sub : active ? T.white : T.muted }}>{s.label}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted }}>{s.desc}</div></div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 200, height: 200 }}>
          {[1, 2, 3].map(r => (<div key={r} style={{ position: "absolute", inset: r * -28, borderRadius: "50%", border: `1px solid ${T.neon}${Math.round((0.14 - r * 0.03) * 255).toString(16).padStart(2, "0")}`, animation: `pulseRing ${1.8 + r * 0.35}s ease-in-out infinite` }} />))}
          <div style={{ width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle at 40% 40%, ${T.purple}88, ${T.neon}22)`, border: `2px solid ${T.neon}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, boxShadow: `0 0 80px ${T.neon}33`, animation: "spin 10s linear infinite" }}>◈</div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulseRing{0%,100%{opacity:.4}50%{opacity:.1}}`}</style>
    </div>
  );
}

/* ─── RESULTS ─────────────────────────────────────────────── */
function Results({ ranked, user, onCourseClick, onEligibility, onChat }) {
  const top = ranked[0];
  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "320px 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ borderRight: `1px solid ${T.border}`, padding: "36px 24px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>
        <div>
          <Pill color={T.green}>Step 6 — Course Results</Pill>
          <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 19, color: T.white, margin: "12px 0 6px" }}>Your Academic DNA</h2>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.muted }}>Hello, {user?.name?.split(" ")[0]}. Based on your personality & skills:</p>
        </div>
        {/* top match */}
        <div style={{ background: `${top.color}10`, border: `1px solid ${top.color}44`, borderRadius: 16, padding: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle, ${top.color}22, transparent)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 8, color: top.color, letterSpacing: 3, textTransform: "uppercase" }}>#1 Best Match</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 20, fontWeight: 900, color: top.color }}>{top.match}%</span>
          </div>
          <div style={{ fontFamily: "'Orbitron'", fontWeight: 800, fontSize: 15, color: T.white, marginBottom: 6 }}>{top.name}</div>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.sub, lineHeight: 1.6, marginBottom: 14 }}>{top.description}</p>
          <div style={{ height: 3, background: T.muted + "44", borderRadius: 999, marginBottom: 14 }}><div style={{ width: `${top.match}%`, height: "100%", background: top.color, borderRadius: 999 }} /></div>
          <div style={{ display: "flex", gap: 6 }}>
            <GlowBtn color={top.color} onClick={() => onCourseClick(top)} style={{ flex: 1, fontSize: 9, padding: "8px 10px", textAlign: "center" }}>Details</GlowBtn>
            <GlowBtn color={T.green} onClick={() => onEligibility(top)} style={{ flex: 1, fontSize: 9, padding: "8px 10px", textAlign: "center" }}>Check Unis</GlowBtn>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>All Matches</div>
          {ranked.map((c, i) => (
            <button key={c.id} onClick={() => onCourseClick(c)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s", width: "100%", marginBottom: 8 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color + "66"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 14, color: c.color, width: 18, flexShrink: 0 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: T.white }}>{c.name}</div>
                <div style={{ marginTop: 4, height: 2, background: T.muted + "44", borderRadius: 999 }}><div style={{ width: `${c.match}%`, height: "100%", background: c.color + "88", borderRadius: 999 }} /></div>
              </div>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 11, fontWeight: 700, color: c.color, flexShrink: 0 }}>{c.match}%</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "40px 48px", overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 24, color: T.white, marginBottom: 8 }}>Course Universe</h2>
          <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 13 }}>Click a course to explore details, or check university eligibility with your exam results.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {ranked.map((course, i) => (
            <div key={course.id} style={{ background: T.card, border: `1px solid ${course.color}22`, borderRadius: 18, padding: "24px 22px", position: "relative", overflow: "hidden", transition: "all 0.25s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = course.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 36px ${course.color}12`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = course.color + "22"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, background: `radial-gradient(circle, ${course.color}14, transparent)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${course.color}14`, border: `1px solid ${course.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: course.color }}>{course.icon}</div>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'Orbitron'", fontSize: 17, fontWeight: 900, color: course.color }}>{course.match}%</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted }}>#{i + 1}</div></div>
              </div>
              <div style={{ fontFamily: "'Orbitron'", fontWeight: 800, fontSize: 14, color: T.white, marginBottom: 6 }}>{course.name}</div>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.sub, lineHeight: 1.6, marginBottom: 14 }}>{course.description}</p>
              <StatBar value={course.match} max={100} color={course.color} />
              <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                <GlowBtn color={course.color} onClick={() => onCourseClick(course)} style={{ flex: 1, fontSize: 9, padding: "8px 10px", textAlign: "center" }}>Details</GlowBtn>
                <GlowBtn color={T.green} onClick={() => onEligibility(course)} style={{ flex: 1, fontSize: 9, padding: "8px 10px", textAlign: "center" }}>Check Unis</GlowBtn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ELIGIBILITY RESULTS ─────────────────────────────────── */
function EligibilityResults({ course, examData, onBack, onChat }) {
  const requirements = DEMO_REQUIREMENTS[course.slug] || DEMO_REQUIREMENTS["computer-science"];
  const gradeMap = examData.results.reduce((m, r) => { m[r.subject.toLowerCase()] = r.grade; return m; }, {});
  const ranked = requirements.map(req => ({ ...req, eligibility: checkEligibility(examData.jambScore, gradeMap, req) })).sort((a, b) => { const o = { eligible: 0, possible: 1, ineligible: 2 }; const d = o[a.eligibility.status] - o[b.eligibility.status]; return d !== 0 ? d : a.eligibility.jambGap - b.eligibility.jambGap; });

  const eligible = ranked.filter(r => r.eligibility.status === "eligible");
  const possible = ranked.filter(r => r.eligibility.status === "possible");
  const ineligible = ranked.filter(r => r.eligibility.status === "ineligible");

  const statusConfig = {
    eligible:   { color: T.green,  label: "Eligible",   icon: "✓", desc: "You meet all requirements" },
    possible:   { color: T.amber,  label: "Possible",   icon: "~", desc: "Close — minor gap to bridge" },
    ineligible: { color: T.red,    label: "Not Eligible", icon: "✗", desc: "Requirements not met" },
  };

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", display: "grid", gridTemplateColumns: "300px 1fr", position: "relative", zIndex: 1 }}>
      {/* LEFT */}
      <div style={{ borderRight: `1px solid ${T.border}`, padding: "36px 24px", display: "flex", flexDirection: "column", gap: 22, overflowY: "auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.sub, fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>← Back to Results</button>
        <div>
          <Pill color={T.green}>Step 7 — University Eligibility</Pill>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
            <span style={{ fontSize: 28, color: course.color }}>{course.icon}</span>
            <div>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 15, fontWeight: 800, color: T.white }}>{course.name}</div>
              <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted }}>Checking {ranked.length} universities</div>
            </div>
          </div>
        </div>
        {/* summary stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[{ label: "Eligible", count: eligible.length, color: T.green, icon: "✓" }, { label: "Possible", count: possible.length, color: T.amber, icon: "~" }, { label: "Not Eligible", count: ineligible.length, color: T.red, icon: "✗" }].map(({ label, count, color, icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `${color}0d`, border: `1px solid ${color}33`, borderRadius: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color, fontWeight: 800, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, color: T.white }}>{label}</div></div>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 18, fontWeight: 900, color }}>{count}</span>
            </div>
          ))}
        </div>
        {/* exam summary */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px" }}>
          <div style={{ fontFamily: "'Orbitron'", fontSize: 9, color: T.neon, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Your Inputs</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>JAMB Score</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 14, color: T.gold, fontWeight: 800 }}>{examData.jambScore}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>Exam Type</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 11, color: T.neon }}>{examData.examType}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.sub }}>Subjects Entered</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 11, color: T.neon }}>{examData.results.length}</span>
          </div>
        </div>
        <GlowBtn color={T.purpleL} onClick={() => onChat(course)} style={{ width: "100%", textAlign: "center", fontSize: 9 }}>Ask AI Advisor</GlowBtn>
      </div>

      {/* RIGHT — university cards */}
      <div style={{ padding: "40px 48px", overflowY: "auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 24, color: T.white, marginBottom: 8 }}>University Galaxy</h2>
          <p style={{ fontFamily: "'DM Sans'", color: T.sub, fontSize: 13 }}>Universities ranked by your eligibility for <span style={{ color: course.color }}>{course.name}</span>.</p>
        </div>

        {[{ group: "eligible", list: eligible, heading: "Eligible Universities", color: T.green }, { group: "possible", list: possible, heading: "Borderline — Possible", color: T.amber }, { group: "ineligible", list: ineligible, heading: "Not Currently Eligible", color: T.red }].map(({ group, list, heading, color }) => list.length === 0 ? null : (
          <div key={group} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${color}33` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
              <span style={{ fontFamily: "'Orbitron'", fontSize: 11, fontWeight: 700, color, letterSpacing: 2, textTransform: "uppercase" }}>{heading}</span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.muted, marginLeft: "auto" }}>{list.length} universit{list.length === 1 ? "y" : "ies"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {list.map((req) => {
                const sc = statusConfig[req.eligibility.status];
                return (
                  <div key={req.uniName} style={{ background: T.card, border: `1px solid ${req.colorHex}22`, borderRadius: 16, padding: "24px 24px", position: "relative", overflow: "hidden", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = req.colorHex + "55"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = req.colorHex + "22"; }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, background: `radial-gradient(circle, ${sc.color}08, transparent)`, pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${req.colorHex}18`, border: `1.5px solid ${req.colorHex}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: req.colorHex, flexShrink: 0 }}>{req.logoSymbol}</div>
                        <div>
                          <div style={{ fontFamily: "'Orbitron'", fontWeight: 800, fontSize: 16, color: T.white }}>{req.uniName}</div>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.muted }}>{req.shortName} · {req.state} State</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${sc.color}14`, border: `1px solid ${sc.color}44`, borderRadius: 99, padding: "6px 14px" }}>
                        <span style={{ fontFamily: "'Orbitron'", fontSize: 12, fontWeight: 800, color: sc.color }}>{sc.icon}</span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, color: sc.color }}>{sc.label}</span>
                      </div>
                    </div>

                    {/* Key metrics row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
                      {[
                        { label: "Your JAMB", value: examData.jambScore, compare: req.minJamb, suffix: "", good: examData.jambScore >= req.minJamb },
                        { label: "Required JAMB", value: req.minJamb, compare: null, suffix: "" },
                        { label: "Min Grade", value: req.minGrade, compare: null, suffix: "" },
                      ].map(({ label, value, good, compare }) => (
                        <div key={label} style={{ background: `rgba(255,255,255,0.03)`, borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, marginBottom: 4 }}>{label}</div>
                          <div style={{ fontFamily: "'Orbitron'", fontSize: 16, fontWeight: 800, color: good === true ? T.green : good === false ? T.red : T.white }}>{value}</div>
                          {compare !== null && good === false && <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.red, marginTop: 2 }}>↑ Need {compare - value} more</div>}
                          {compare !== null && good === true && <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.green, marginTop: 2 }}>↑ {value - compare} above cut-off</div>}
                        </div>
                      ))}
                    </div>

                    {/* Required subjects */}
                    <div style={{ marginBottom: req.eligibility.missingSubjects.length > 0 || req.eligibility.failedGrades.length > 0 ? 14 : 0 }}>
                      <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Required Subjects</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {req.requiredSubjects.map((subj) => {
                          const userGrade = gradeMap[subj.toLowerCase()];
                          const passes = userGrade && gradePassesMin(userGrade, req.minGrade);
                          const gc = userGrade ? gradeColor(userGrade) : T.muted;
                          return (
                            <div key={subj} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: passes ? `${T.green}0d` : userGrade ? `${T.red}0d` : `${T.muted}0d`, border: `1px solid ${passes ? T.green + "44" : userGrade ? T.red + "44" : T.muted + "33"}`, borderRadius: 8 }}>
                              <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: passes ? T.white : userGrade ? T.red : T.muted }}>{subj}</span>
                              {userGrade && <span style={{ fontFamily: "'Orbitron'", fontSize: 10, fontWeight: 700, color: gc }}>{userGrade}</span>}
                              {!userGrade && <span style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted }}>—</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Warnings */}
                    {req.eligibility.missingSubjects.length > 0 && (
                      <div style={{ background: `${T.red}0a`, border: `1px solid ${T.red}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.red }}>⚠ Missing: {req.eligibility.missingSubjects.join(", ")}</span>
                      </div>
                    )}
                    {req.eligibility.failedGrades.length > 0 && (
                      <div style={{ background: `${T.amber}0a`, border: `1px solid ${T.amber}33`, borderRadius: 10, padding: "10px 14px" }}>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: T.amber }}>⚠ Below minimum grade in: {req.eligibility.failedGrades.map(f => `${f.subject} (${f.userGrade})`).join(", ")}</span>
                      </div>
                    )}
                    {req.notes && <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.muted, marginTop: 10, fontStyle: "italic" }}>ℹ {req.notes}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI CHAT ─────────────────────────────────────────────── */
function AIChat({ course, onBack }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: `Hello! I'm your StudyDNA AI Advisor. I can answer questions about **${course.name}** — JAMB requirements, WAEC subjects, careers, universities, and study strategies. What would you like to know?` }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...msgs, { role: "user", content: input }];
    setMsgs(next); setInput(""); setLoading(true);
    try { const reply = await askClaude(next.map(m => ({ role: m.role, content: m.content })), `${course.name} (${course.match}% match)`); setMsgs(m => [...m, { role: "assistant", content: reply }]); }
    catch { setMsgs(m => [...m, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };
  const renderMd = t => t.replace(/\*\*(.*?)\*\*/g, (_, x) => `<strong style="color:${T.neon}">${x}</strong>`);
  const suggestions = ["What JAMB score do I need?", "Which subjects are required for WAEC?", "What careers can I get?", "Which university is easiest to get into?", "How do I improve my JAMB score?"];
  return (
    <div style={{ paddingTop: 60, height: "100vh", display: "grid", gridTemplateColumns: "280px 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ borderRight: `1px solid ${T.border}`, padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.sub, fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>← Back</button>
        <div style={{ background: `${course.color}10`, border: `1px solid ${course.color}33`, borderRadius: 12, padding: "16px" }}>
          <div style={{ fontFamily: "'Orbitron'", fontSize: 9, color: course.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Advising on</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 22, color: course.color }}>{course.icon}</span>
            <div><div style={{ fontFamily: "'Orbitron'", fontSize: 13, fontWeight: 800, color: T.white }}>{course.name}</div><div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.sub }}>{course.match}% match</div></div>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 10, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Quick Questions</div>
          {suggestions.map(s => (<button key={s} onClick={() => setInput(s)} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 9, padding: "9px 12px", color: T.sub, fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all 0.18s", display: "block", marginBottom: 6 }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.neon + "44"; e.currentTarget.style.color = T.white; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.sub; }}>{s}</button>))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div style={{ padding: "18px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${T.purple}33`, border: `1.5px solid ${T.purpleL}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
          <div><div style={{ fontFamily: "'Orbitron'", fontSize: 13, fontWeight: 700, color: T.white }}>StudyDNA AI Advisor</div><div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: T.green, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, display: "inline-block" }} /> Online</div></div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
              {m.role === "assistant" && <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${T.purple}33`, border: `1px solid ${T.purpleL}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 4 }}>⬡</div>}
              <div style={{ maxWidth: "70%", background: m.role === "user" ? `${T.neon}10` : T.card, border: `1px solid ${m.role === "user" ? T.neon + "33" : T.border}`, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "13px 17px", fontFamily: "'DM Sans'", fontSize: 14, color: T.white, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
            </div>
          ))}
          {loading && <div style={{ display: "flex", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: `${T.purple}33`, border: `1px solid ${T.purpleL}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⬡</div><div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "18px 18px 18px 4px", padding: "13px 18px", display: "flex", gap: 5, alignItems: "center" }}>{[0, 1, 2].map(d => <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: T.neon, animation: `bounce 1s ${d * 0.2}s ease-in-out infinite` }} />)}</div></div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "14px 28px 22px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={`Ask about ${course.name}, JAMB, WAEC...`} style={{ flex: 1, background: T.card, border: `1px solid ${T.border}`, borderRadius: 11, padding: "12px 16px", color: T.white, fontFamily: "'DM Sans'", fontSize: 14, outline: "none" }} onFocus={(e) => (e.target.style.borderColor = T.neon)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
          <button onClick={send} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? `${T.neon}18` : "transparent", border: `1.5px solid ${input.trim() && !loading ? T.neon : T.muted}`, borderRadius: 11, width: 48, cursor: input.trim() && !loading ? "pointer" : "default", color: input.trim() && !loading ? T.neon : T.muted, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>→</button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}

/* ─── APP ROOT ────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [pAns, setPAns] = useState([]);
  const [sAns, setSAns] = useState([]);
  const [ranked, setRanked] = useState([]);
  const [examData, setExamData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chatCourse, setChatCourse] = useState(null);

  const finishProcessing = () => {
    const traits = computeScores([...pAns, ...sAns]);
    setRanked(rankCourses(traits));
    setScreen("results");
  };

  const navScreens = ["signup", "personality", "skills", "exam", "processing", "results", "eligibility"];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.white, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <StarField />
      {navScreens.includes(screen) && <Navbar screen={screen} user={user} />}
      {screen === "landing" && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, zIndex: 200, display: "flex", alignItems: "center", padding: "0 32px", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1.5px solid ${T.neon}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: `0 0 12px ${T.neon}44` }}>◈</div>
            <span style={{ fontFamily: "'Orbitron'", fontWeight: 900, fontSize: 15, color: T.white }}>Study<span style={{ color: T.neon }}>DNA</span></span>
          </div>
          <Landing onStart={() => setScreen("signup")} />
        </>
      )}
      {screen === "signup" && <Signup onComplete={(u) => { setUser(u); setScreen("personality"); }} />}
      {screen === "personality" && <QuestionScreen questions={PERSONALITY_QS} subtitle="Phase 1 — Personality Matrix" phase={1} onComplete={(a) => { setPAns(a); setScreen("skills"); }} />}
      {screen === "skills" && <QuestionScreen questions={SKILLS_QS} subtitle="Phase 2 — Skills Lab" phase={2} onComplete={(a) => { setSAns(a); setScreen("exam"); }} />}
      {screen === "exam" && <ExamChamber onComplete={(data) => { setExamData(data); setScreen("processing"); }} />}
      {screen === "processing" && <Processing onDone={finishProcessing} />}
      {screen === "results" && !selectedCourse && !chatCourse && <Results ranked={ranked} user={user} onCourseClick={(c) => setSelectedCourse(c)} onEligibility={(c) => { setSelectedCourse(c); setScreen("eligibility"); }} onChat={(c) => { setChatCourse(c); setScreen("chat"); }} />}
      {screen === "eligibility" && selectedCourse && examData && <EligibilityResults course={selectedCourse} examData={examData} onBack={() => { setScreen("results"); setSelectedCourse(null); }} onChat={(c) => { setChatCourse(c); setScreen("chat"); }} />}
      {screen === "chat" && chatCourse && <AIChat course={chatCourse} onBack={() => { setScreen(selectedCourse ? "eligibility" : "results"); }} />}
    </div>
  );
}
