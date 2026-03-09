// src/app/layout.js
export const metadata = {
  title: "StudyDNA — Discover Your Academic Path",
  description: "Personality-powered course recommendations for Nigerian students. Find your ideal university course and check eligibility across 98+ universities.",
  keywords: ["JAMB", "WAEC", "Nigerian university", "course selection", "career guidance"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#060810" }}>
        {children}
      </body>
    </html>
  );
}
