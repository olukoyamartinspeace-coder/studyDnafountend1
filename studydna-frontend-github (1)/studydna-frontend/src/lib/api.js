// src/lib/api.js
// StudyDNA API client
//
// All communication with the backend goes through this file.
// Set NEXT_PUBLIC_API_URL in .env.local to point at the backend.
//
// Usage:
//   import { api } from "@/lib/api";
//   const { data } = await api.login({ email, password });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Auth token storage ───────────────────────────────────────────────────────
export const token = {
  get:    ()    => (typeof window !== "undefined" ? localStorage.getItem("studydna_token") : null),
  set:    (t)   => typeof window !== "undefined" && localStorage.setItem("studydna_token", t),
  clear:  ()    => typeof window !== "undefined" && localStorage.removeItem("studydna_token"),
};

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function request(method, path, body = null, requiresAuth = false) {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth) {
    const t = token.get();
    if (!t) throw new Error("Not authenticated");
    headers["Authorization"] = `Bearer ${t}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const msg = json?.error || `Request failed with status ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, errors: json?.errors });
  }

  return json;
}

const get  = (path, auth = false) => request("GET",  path, null, auth);
const post = (path, body, auth = false) => request("POST", path, body, auth);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const api = {
  signup: (body) => post("/api/auth/signup", body),
  login:  (body) => post("/api/auth/login",  body),

  // ─── Test ──────────────────────────────────────────────────────────────────
  getQuestions: (phase) => get(`/api/questions${phase ? `?phase=${phase}` : ""}`),
  submitTest:   (body)  => post("/api/submit-test", body, true),
  getResults:   (testId) => get(`/api/results${testId ? `?testId=${testId}` : ""}`, true),

  // ─── Courses & Universities ────────────────────────────────────────────────
  getCourses:      ()     => get("/api/courses"),
  getCourse:       (slug) => get(`/api/courses?slug=${slug}`),
  getUniversities: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/api/universities${q ? `?${q}` : ""}`);
  },

  // ─── Exam data ─────────────────────────────────────────────────────────────
  saveExamResults: (body)     => post("/api/exam-results", body, true),
  getExamResults:  (examType) => get(`/api/exam-results${examType ? `?examType=${examType}` : ""}`, true),
  saveJambScore:   (body)     => post("/api/jamb-score",   body, true),
  getJambScore:    ()         => get("/api/jamb-score",  true),

  // ─── Eligibility ──────────────────────────────────────────────────────────
  runEligibility:  (body)      => post("/api/eligibility", body, true),
  getEligibility:  (courseSlug) => get(`/api/eligibility?courseSlug=${courseSlug}`, true),

  // ─── AI Advisor (streaming) ───────────────────────────────────────────────
  // Returns a ReadableStream — consume with a reader in your component.
  async streamAdvisor(messages, courseContext = {}) {
    const t = token.get();
    if (!t) throw new Error("Not authenticated");

    const res = await fetch(`${BASE_URL}/api/ai-advisor`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${t}` },
      body:    JSON.stringify({ messages, ...courseContext }),
    });

    if (!res.ok) throw new Error(`AI advisor error: ${res.status}`);
    return res.body;
  },
};

export default api;
