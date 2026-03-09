// src/app/page.js
// Root page — renders the full StudyDNA single-page application.
// dynamic import with ssr:false prevents "document is not defined" during
// Next.js server-side rendering, since the app uses browser-only APIs.

import dynamic from "next/dynamic";

const StudyDNA = dynamic(() => import("./StudyDNA"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: "100vh",
      background: "#060810",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      color: "#00eaff",
      fontSize: "18px",
      letterSpacing: "0.1em",
    }}>
      Loading StudyDNA...
    </div>
  ),
});

export default function Page() {
  return <StudyDNA />;
}
