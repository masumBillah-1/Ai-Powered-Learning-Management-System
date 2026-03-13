// "use client";

// import React, { useEffect, useRef, useState } from 'react';

// /* ══════════════════════════════════════════════
//    MERN STACK DEVELOPMENT TIMELINE DATA
// ══════════════════════════════════════════════ */
// const timelineData = [
//   {
//     id: 1,
//     phase: '01',
//     tag: 'Foundation',
//     title: 'MongoDB Mastery',
//     subtitle: 'Database Architecture',
//     duration: '2 Weeks',
//     icon: '🍃',
//     color: '#00ED64',
//     colorDark: '#00684A',
//     colorGlow: 'rgba(0,237,100,0.3)',
//     skills: ['Schema Design', 'CRUD Operations', 'Aggregation Pipeline', 'Indexing'],
//     desc: 'NoSQL database fundamentals, document modeling, and MongoDB Atlas cloud setup.',
//     side: 'left',
//   },
//   {
//     id: 2,
//     phase: '02',
//     tag: 'Backend Core',
//     title: 'Express.js Deep Dive',
//     subtitle: 'Server & API Development',
//     duration: '3 Weeks',
//     icon: '⚡',
//     color: '#FF0F7B',
//     colorDark: '#B0005A',
//     colorGlow: 'rgba(255,15,123,0.3)',
//     skills: ['REST API Design', 'Middleware', 'Authentication', 'Error Handling'],
//     desc: 'Build production-grade REST APIs with Express, JWT auth, and robust middleware chains.',
//     side: 'right',
//   },
//   {
//     id: 3,
//     phase: '03',
//     tag: 'Frontend Magic',
//     title: 'React.js Universe',
//     subtitle: 'UI Component Architecture',
//     duration: '4 Weeks',
//     icon: '⚛️',
//     color: '#61DAFB',
//     colorDark: '#1A8FBF',
//     colorGlow: 'rgba(97,218,251,0.3)',
//     skills: ['Hooks & State', 'Context API', 'React Router', 'Performance Optimization'],
//     desc: 'Master modern React patterns, custom hooks, and build reusable component systems.',
//     side: 'left',
//   },
//   {
//     id: 4,
//     phase: '04',
//     tag: 'Runtime Engine',
//     title: 'Node.js Powerhouse',
//     subtitle: 'Server-Side JavaScript',
//     duration: '3 Weeks',
//     icon: '🟢',
//     color: '#F89B29',
//     colorDark: '#B06B00',
//     colorGlow: 'rgba(248,155,41,0.3)',
//     skills: ['Event Loop', 'Streams & Buffers', 'File System', 'NPM Ecosystem'],
//     desc: 'Deep understanding of async programming, event-driven architecture, and Node internals.',
//     side: 'right',
//   },
//   {
//     id: 5,
//     phase: '05',
//     tag: 'Integration',
//     title: 'Full-Stack Fusion',
//     subtitle: 'Connecting Everything',
//     duration: '2 Weeks',
//     icon: '🔗',
//     color: '#832388',
//     colorDark: '#5A1760',
//     colorGlow: 'rgba(131,35,136,0.3)',
//     skills: ['Mongoose ODM', 'Axios & Fetch', 'State Management', 'CORS & Security'],
//     desc: 'Connect frontend & backend seamlessly — full data flow from React to MongoDB.',
//     side: 'left',
//   },
//   {
//     id: 6,
//     phase: '06',
//     tag: 'Production',
//     title: 'Deploy & Scale',
//     subtitle: 'Go Live with Confidence',
//     duration: '2 Weeks',
//     icon: '🚀',
//     color: '#E3436B',
//     colorDark: '#9C1A3D',
//     colorGlow: 'rgba(227,67,107,0.3)',
//     skills: ['Docker Basics', 'CI/CD Pipeline', 'Cloud Deploy', 'Performance & SEO'],
//     desc: 'Deploy full MERN apps to Vercel, Railway & MongoDB Atlas. Monitor, scale, and ship.',
//     side: 'right',
//   },
// ];

// /* ══════════════════════════════════════════════
//    TIMELINE ITEM COMPONENT
// ══════════════════════════════════════════════ */
// const TimelineItem = ({ item, index }: { item: typeof timelineData[0]; index: number }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) setVisible(true); },
//       { threshold: 0.2 }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   const isLeft = item.side === 'left';

//   return (
//     <div
//       ref={ref}
//       className={`tl-item ${isLeft ? 'tl-left' : 'tl-right'} ${visible ? 'tl-visible' : ''}`}
//       style={{ '--delay': `${index * 0.12}s`, '--color': item.color, '--glow': item.colorGlow } as React.CSSProperties}
//     >
//       {/* ── Center node ── */}
//       <div className="tl-node-wrap">
//         <div className="tl-node-ring" />
//         <div className="tl-node-ring tl-ring-2" />
//         <div className="tl-node">
//           <span className="tl-node-icon">{item.icon}</span>
//         </div>
//         <div className="tl-connector" />
//       </div>

//       {/* ── Card ── */}
//       <div className="tl-card">
//         {/* Top bar */}
//         <div className="tl-card-header">
//           <div className="tl-phase-badge">
//             <span className="tl-phase-num">{item.phase}</span>
//           </div>
//           <div className="tl-tags">
//             <span className="tl-tag">{item.tag}</span>
//             <span className="tl-duration">
//               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
//               {item.duration}
//             </span>
//           </div>
//         </div>

//         {/* Title */}
//         <div className="tl-title-wrap">
//           <h3 className="tl-title">{item.title}</h3>
//           <p className="tl-subtitle">{item.subtitle}</p>
//         </div>

//         {/* Desc */}
//         <p className="tl-desc">{item.desc}</p>

//         {/* Skills */}
//         <div className="tl-skills">
//           {item.skills.map((s, i) => (
//             <span key={i} className="tl-skill">{s}</span>
//           ))}
//         </div>

//         {/* Glow accent line */}
//         <div className="tl-card-accent" />
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════
//    MAIN TIMELINE COMPONENT
// ══════════════════════════════════════════════ */
// const Timeline: React.FC = () => {
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

//         /* ── Root ── */
//         .tl-section {
//           position: relative;
//           width: 100%;
//           padding: 100px 20px 120px;
//           overflow: hidden;
//           background: #06030f;
//           font-family: 'DM Sans', sans-serif;
//         }

//         /* ── Background decoration ── */
//         .tl-bg-grid {
//           position: absolute;
//           inset: 0;
//           background-image:
//             linear-gradient(rgba(255,15,123,0.04) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,15,123,0.04) 1px, transparent 1px);
//           background-size: 60px 60px;
//           pointer-events: none;
//         }
//         .tl-bg-radial {
//           position: absolute;
//           inset: 0;
//           background:
//             radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,15,123,0.10) 0%, transparent 70%),
//             radial-gradient(ellipse 40% 50% at 10% 60%, rgba(131,35,136,0.08) 0%, transparent 60%),
//             radial-gradient(ellipse 40% 50% at 90% 40%, rgba(248,155,41,0.07) 0%, transparent 60%);
//           pointer-events: none;
//         }

//         /* ── Section header ── */
//         .tl-header {
//           text-align: center;
//           margin-bottom: 80px;
//           position: relative;
//           z-index: 2;
//         }
//         .tl-header-eyebrow {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 11px;
//           font-weight: 600;
//           letter-spacing: 0.25em;
//           text-transform: uppercase;
//           color: rgba(255,255,255,0.45);
//           margin-bottom: 20px;
//           padding: 7px 18px;
//           border-radius: 50px;
//           border: 1px solid rgba(255,255,255,0.1);
//           background: rgba(255,255,255,0.04);
//         }
//         .tl-header-eyebrow span {
//           width: 5px; height: 5px;
//           border-radius: 50%;
//           background: linear-gradient(135deg, #FF0F7B, #F89B29);
//           display: inline-block;
//         }
//         .tl-header-title {
//           font-family: 'Syne', sans-serif;
//           font-size: clamp(2.2rem, 5vw, 4rem);
//           font-weight: 800;
//           color: #fff;
//           line-height: 1.1;
//           letter-spacing: -0.03em;
//           margin-bottom: 16px;
//         }
//         .tl-header-title em {
//           font-style: normal;
//           background: linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//         .tl-header-sub {
//           font-size: 16px;
//           color: rgba(255,255,255,0.45);
//           max-width: 480px;
//           margin: 0 auto;
//           line-height: 1.7;
//         }

//         /* ── Progress bar indicator ── */
//         .tl-progress-bar {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 6px;
//           margin-top: 32px;
//         }
//         .tl-progress-seg {
//           height: 3px;
//           border-radius: 2px;
//           background: rgba(255,255,255,0.08);
//           flex: 1;
//           max-width: 60px;
//           transition: background 0.5s ease;
//         }
//         .tl-progress-seg.active {
//           background: linear-gradient(90deg, #FF0F7B, #F89B29);
//         }

//         /* ══════════════════════════════════════
//            TIMELINE TRACK
//         ══════════════════════════════════════ */
//         .tl-track {
//           position: relative;
//           max-width: 1000px;
//           margin: 0 auto;
//           z-index: 2;
//         }

//         /* Vertical center line */
//         .tl-track::before {
//           content: '';
//           position: absolute;
//           left: 50%;
//           top: 0; bottom: 0;
//           width: 1px;
//           transform: translateX(-50%);
//           background: linear-gradient(
//             to bottom,
//             transparent 0%,
//             rgba(255,15,123,0.4) 8%,
//             rgba(248,155,41,0.4) 35%,
//             rgba(97,218,251,0.4) 55%,
//             rgba(131,35,136,0.4) 80%,
//             transparent 100%
//           );
//         }

//         /* ══════════════════════════════════════
//            TIMELINE ITEM
//         ══════════════════════════════════════ */
//         .tl-item {
//           display: grid;
//           grid-template-columns: 1fr 80px 1fr;
//           align-items: center;
//           margin-bottom: 56px;
//           opacity: 0;
//           transition: opacity 0.7s ease, transform 0.7s ease;
//           transition-delay: var(--delay);
//         }
//         .tl-item.tl-left  { transform: translateX(-40px); }
//         .tl-item.tl-right { transform: translateX(40px); }
//         .tl-item.tl-visible {
//           opacity: 1;
//           transform: translateX(0);
//         }

//         /* ── Left items: card on left, empty on right ── */
//         .tl-left .tl-node-wrap { grid-column: 2; grid-row: 1; }
//         .tl-left .tl-card      { grid-column: 1; grid-row: 1; margin-right: 32px; }

//         /* ── Right items: empty on left, card on right ── */
//         .tl-right .tl-node-wrap { grid-column: 2; grid-row: 1; }
//         .tl-right .tl-card      { grid-column: 3; grid-row: 1; margin-left: 32px; }

//         /* ── Center node ── */
//         .tl-node-wrap {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 3;
//         }
//         .tl-node {
//           width: 52px; height: 52px;
//           border-radius: 50%;
//           background: #0f0620;
//           border: 2px solid var(--color);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 22px;
//           position: relative;
//           z-index: 2;
//           box-shadow:
//             0 0 0 6px rgba(0,0,0,0.5),
//             0 0 20px var(--glow),
//             0 0 40px var(--glow);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .tl-item:hover .tl-node {
//           transform: scale(1.15);
//           box-shadow:
//             0 0 0 6px rgba(0,0,0,0.5),
//             0 0 30px var(--glow),
//             0 0 60px var(--glow);
//         }
//         .tl-node-ring {
//           position: absolute;
//           width: 68px; height: 68px;
//           border-radius: 50%;
//           border: 1px solid var(--color);
//           opacity: 0.3;
//           animation: tlRingPulse 2.5s ease-in-out infinite;
//         }
//         .tl-ring-2 {
//           width: 84px; height: 84px;
//           opacity: 0.15;
//           animation-delay: 0.5s;
//         }
//         @keyframes tlRingPulse {
//           0%, 100% { transform: scale(1);    opacity: 0.3; }
//           50%       { transform: scale(1.12); opacity: 0; }
//         }

//         /* Connector line from node to card */
//         .tl-connector {
//           display: none;
//         }

//         /* ══════════════════════════════════════
//            CARD
//         ══════════════════════════════════════ */
//         .tl-card {
//           position: relative;
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 24px;
//           padding: 28px 28px 22px;
//           overflow: hidden;
//           transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
//           cursor: default;
//         }
//         .tl-card::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           border-radius: 24px;
//           background: linear-gradient(
//             135deg,
//             rgba(255,255,255,0.05) 0%,
//             transparent 60%
//           );
//           pointer-events: none;
//         }
//         /* Glow border on hover */
//         .tl-item:hover .tl-card {
//           border-color: var(--color);
//           box-shadow:
//             0 0 0 1px var(--color),
//             0 20px 60px rgba(0,0,0,0.4),
//             0 0 40px var(--glow);
//           transform: translateY(-4px);
//         }

//         /* Left card — right-align the top badge area */
//         .tl-left .tl-card-header { flex-direction: row-reverse; }
//         .tl-left .tl-tags { flex-direction: row-reverse; }
//         .tl-left .tl-title-wrap { text-align: right; }
//         .tl-left .tl-skills { justify-content: flex-end; }
//         .tl-left .tl-desc { text-align: right; }

//         /* ── Card header ── */
//         .tl-card-header {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           margin-bottom: 16px;
//         }
//         .tl-phase-badge {
//           width: 36px; height: 36px;
//           border-radius: 10px;
//           background: var(--color);
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }
//         .tl-phase-num {
//           font-family: 'Syne', sans-serif;
//           font-size: 13px;
//           font-weight: 800;
//           color: #06030f;
//         }
//         .tl-tags {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           flex-wrap: wrap;
//           flex: 1;
//         }
//         .tl-tag {
//           font-size: 11px;
//           font-weight: 600;
//           letter-spacing: 0.08em;
//           text-transform: uppercase;
//           color: var(--color);
//           background: rgba(255,255,255,0.05);
//           border: 1px solid rgba(255,255,255,0.1);
//           padding: 3px 10px;
//           border-radius: 50px;
//         }
//         .tl-duration {
//           display: flex;
//           align-items: center;
//           gap: 5px;
//           font-size: 12px;
//           font-weight: 500;
//           color: rgba(255,255,255,0.35);
//         }

//         /* ── Title ── */
//         .tl-title-wrap { margin-bottom: 10px; }
//         .tl-title {
//           font-family: 'Syne', sans-serif;
//           font-size: 1.4rem;
//           font-weight: 800;
//           color: #fff;
//           letter-spacing: -0.02em;
//           line-height: 1.15;
//           margin-bottom: 4px;
//         }
//         .tl-subtitle {
//           font-size: 13px;
//           font-weight: 500;
//           color: rgba(255,255,255,0.38);
//           letter-spacing: 0.02em;
//         }

//         /* ── Description ── */
//         .tl-desc {
//           font-size: 13.5px;
//           color: rgba(255,255,255,0.5);
//           line-height: 1.7;
//           margin-bottom: 18px;
//         }

//         /* ── Skills ── */
//         .tl-skills {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 7px;
//           margin-bottom: 6px;
//         }
//         .tl-skill {
//           font-size: 11.5px;
//           font-weight: 600;
//           color: var(--color);
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.07);
//           padding: 5px 12px;
//           border-radius: 8px;
//           transition: background 0.25s ease;
//         }
//         .tl-item:hover .tl-skill {
//           background: rgba(255,255,255,0.08);
//         }

//         /* ── Bottom accent glow line ── */
//         .tl-card-accent {
//           position: absolute;
//           bottom: 0; left: 0; right: 0;
//           height: 2px;
//           background: linear-gradient(90deg, transparent, var(--color), transparent);
//           opacity: 0;
//           transition: opacity 0.35s ease;
//         }
//         .tl-item:hover .tl-card-accent { opacity: 1; }

//         /* ══════════════════════════════════════
//            BOTTOM TOTAL BADGE
//         ══════════════════════════════════════ */
//         .tl-footer {
//           text-align: center;
//           margin-top: 20px;
//           position: relative;
//           z-index: 2;
//         }
//         .tl-total-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 14px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 20px;
//           padding: 20px 36px;
//           backdrop-filter: blur(10px);
//         }
//         .tl-total-item {
//           text-align: center;
//         }
//         .tl-total-val {
//           display: block;
//           font-family: 'Syne', sans-serif;
//           font-size: 1.8rem;
//           font-weight: 800;
//           background: linear-gradient(135deg, #FF0F7B, #F89B29);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           line-height: 1;
//         }
//         .tl-total-label {
//           font-size: 12px;
//           color: rgba(255,255,255,0.35);
//           font-weight: 500;
//           margin-top: 4px;
//           display: block;
//         }
//         .tl-total-divider {
//           width: 1px;
//           height: 40px;
//           background: rgba(255,255,255,0.1);
//         }

//         /* ══════════════════════════════════════
//            RESPONSIVE
//         ══════════════════════════════════════ */
//         @media (max-width: 768px) {
//           .tl-track::before {
//             left: 28px;
//             transform: none;
//           }
//           .tl-item {
//             grid-template-columns: 72px 1fr;
//             grid-template-rows: auto;
//           }
//           .tl-left .tl-node-wrap,
//           .tl-right .tl-node-wrap { grid-column: 1; grid-row: 1; }
//           .tl-left .tl-card,
//           .tl-right .tl-card {
//             grid-column: 2;
//             grid-row: 1;
//             margin-left: 16px;
//             margin-right: 0;
//           }
//           .tl-left .tl-card-header { flex-direction: row; }
//           .tl-left .tl-tags        { flex-direction: row; }
//           .tl-left .tl-title-wrap  { text-align: left; }
//           .tl-left .tl-skills      { justify-content: flex-start; }
//           .tl-left .tl-desc        { text-align: left; }
//           .tl-item.tl-left,
//           .tl-item.tl-right { transform: translateX(-20px); }
//           .tl-total-badge { flex-direction: column; padding: 20px 24px; gap: 16px; }
//           .tl-total-divider { width: 60px; height: 1px; }
//         }
//       `}</style>

//       <section className="tl-section">
//         {/* Background decorations */}
//         <div className="tl-bg-grid" />
//         <div className="tl-bg-radial" />

//         {/* ── Header ── */}
//         <div className="tl-header">
//           <div className="tl-header-eyebrow">
//             <span />
//             Learning Roadmap
//             <span />
//           </div>
//           <h2 className="tl-header-title">
//             Master the <em>MERN Stack</em>
//             <br />Step by Step
//           </h2>
//           <p className="tl-header-sub">
//             A structured, phase-by-phase journey from database to deployment — built for real-world developers.
//           </p>

//           {/* Progress segments */}
//           <div className="tl-progress-bar">
//             {timelineData.map((_, i) => (
//               <div key={i} className={`tl-progress-seg active`} />
//             ))}
//           </div>
//         </div>

//         {/* ── Timeline track ── */}
//         <div className="tl-track">
//           {timelineData.map((item, index) => (
//             <TimelineItem key={item.id} item={item} index={index} />
//           ))}
//         </div>

//         {/* ── Footer totals ── */}
//         <div className="tl-footer">
//           <div className="tl-total-badge">
//             <div className="tl-total-item">
//               <span className="tl-total-val">16</span>
//               <span className="tl-total-label">Weeks Total</span>
//             </div>
//             <div className="tl-total-divider" />
//             <div className="tl-total-item">
//               <span className="tl-total-val">6</span>
//               <span className="tl-total-label">Core Phases</span>
//             </div>
//             <div className="tl-total-divider" />
//             <div className="tl-total-item">
//               <span className="tl-total-val">24+</span>
//               <span className="tl-total-label">Skills Covered</span>
//             </div>
//             <div className="tl-total-divider" />
//             <div className="tl-total-item">
//               <span className="tl-total-val">∞</span>
//               <span className="tl-total-label">Possibilities</span>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Timeline;
"use client";

import React, { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════
   MERN STACK DEVELOPMENT TIMELINE DATA
══════════════════════════════════════════════ */
const timelineData = [
  {
    id: 1,
    phase: '01',
    tag: 'Foundation',
    title: 'MongoDB Mastery',
    subtitle: 'Database Architecture',
    duration: '2 Weeks',
    icon: '🍃',
    color: '#00ED64',
    colorDark: '#00684A',
    colorGlow: 'rgba(0,237,100,0.3)',
    skills: ['Schema Design', 'CRUD Operations', 'Aggregation Pipeline', 'Indexing'],
    desc: 'NoSQL database fundamentals, document modeling, and MongoDB Atlas cloud setup.',
    side: 'left',
  },
  {
    id: 2,
    phase: '02',
    tag: 'Backend Core',
    title: 'Express.js Deep Dive',
    subtitle: 'Server & API Development',
    duration: '3 Weeks',
    icon: '⚡',
    color: '#FF0F7B',
    colorDark: '#B0005A',
    colorGlow: 'rgba(255,15,123,0.3)',
    skills: ['REST API Design', 'Middleware', 'Authentication', 'Error Handling'],
    desc: 'Build production-grade REST APIs with Express, JWT auth, and robust middleware chains.',
    side: 'right',
  },
  {
    id: 3,
    phase: '03',
    tag: 'Frontend Magic',
    title: 'React.js Universe',
    subtitle: 'UI Component Architecture',
    duration: '4 Weeks',
    icon: '⚛️',
    color: '#61DAFB',
    colorDark: '#1A8FBF',
    colorGlow: 'rgba(97,218,251,0.3)',
    skills: ['Hooks & State', 'Context API', 'React Router', 'Performance Optimization'],
    desc: 'Master modern React patterns, custom hooks, and build reusable component systems.',
    side: 'left',
  },
  {
    id: 4,
    phase: '04',
    tag: 'Runtime Engine',
    title: 'Node.js Powerhouse',
    subtitle: 'Server-Side JavaScript',
    duration: '3 Weeks',
    icon: '🟢',
    color: '#F89B29',
    colorDark: '#B06B00',
    colorGlow: 'rgba(248,155,41,0.3)',
    skills: ['Event Loop', 'Streams & Buffers', 'File System', 'NPM Ecosystem'],
    desc: 'Deep understanding of async programming, event-driven architecture, and Node internals.',
    side: 'right',
  },
  {
    id: 5,
    phase: '05',
    tag: 'Integration',
    title: 'Full-Stack Fusion',
    subtitle: 'Connecting Everything',
    duration: '2 Weeks',
    icon: '🔗',
    color: '#832388',
    colorDark: '#5A1760',
    colorGlow: 'rgba(131,35,136,0.3)',
    skills: ['Mongoose ODM', 'Axios & Fetch', 'State Management', 'CORS & Security'],
    desc: 'Connect frontend & backend seamlessly — full data flow from React to MongoDB.',
    side: 'left',
  },
  {
    id: 6,
    phase: '06',
    tag: 'Production',
    title: 'Deploy & Scale',
    subtitle: 'Go Live with Confidence',
    duration: '2 Weeks',
    icon: '🚀',
    color: '#E3436B',
    colorDark: '#9C1A3D',
    colorGlow: 'rgba(227,67,107,0.3)',
    skills: ['Docker Basics', 'CI/CD Pipeline', 'Cloud Deploy', 'Performance & SEO'],
    desc: 'Deploy full MERN apps to Vercel, Railway & MongoDB Atlas. Monitor, scale, and ship.',
    side: 'right',
  },
];

const TimelineItem = ({ item, index }: { item: typeof timelineData[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isLeft = item.side === 'left';

  return (
    <div
      ref={ref}
      className={`tl-item ${isLeft ? 'tl-left' : 'tl-right'} ${visible ? 'tl-visible' : ''}`}
      style={{ '--delay': `${index * 0.12}s`, '--color': item.color, '--glow': item.colorGlow } as React.CSSProperties}
    >
      <div className="tl-node-wrap">
        <div className="tl-node-ring" />
        <div className="tl-node-ring tl-ring-2" />
        <div className="tl-node">
          <span className="tl-node-icon">{item.icon}</span>
        </div>
      </div>

      <div className="tl-card">
        <div className="tl-card-header">
          <div className="tl-phase-badge">
            <span className="tl-phase-num">{item.phase}</span>
          </div>
          <div className="tl-tags">
            <span className="tl-tag">{item.tag}</span>
            <span className="tl-duration">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {item.duration}
            </span>
          </div>
        </div>

        <div className="tl-title-wrap">
          <h3 className="tl-title">{item.title}</h3>
          <p className="tl-subtitle">{item.subtitle}</p>
        </div>

        <p className="tl-desc">{item.desc}</p>

        <div className="tl-skills">
          {item.skills.map((s, i) => (
            <span key={i} className="tl-skill">{s}</span>
          ))}
        </div>

        <div className="tl-card-accent" />
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        .tl-section {
          position: relative;
          width: 100%;
          padding: 100px 20px 120px;
          overflow: hidden;
          background: #06030f;
          font-family: 'Inter', sans-serif;
          color: #fff;
        }

        .tl-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,15,123,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,15,123,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .tl-bg-radial {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,15,123,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 10% 60%, rgba(131,35,136,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 90% 40%, rgba(248,155,41,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .tl-header {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
          z-index: 2;
        }
        .tl-header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
          padding: 7px 18px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
        }
        .tl-header-eyebrow span {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF0F7B, #F89B29);
          display: inline-block;
        }
        .tl-header-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
        }
        .tl-header-title em {
          font-style: normal;
          background: linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tl-header-sub {
          font-size: 16px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .tl-progress-bar {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 32px;
        }
        .tl-progress-seg {
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          flex: 1;
          max-width: 50px;
        }
        .tl-progress-seg.active {
          background: linear-gradient(90deg, #FF0F7B, #F89B29);
        }

        .tl-track {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          z-index: 2;
        }
        .tl-track::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent);
        }

        .tl-item {
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          align-items: center;
          margin-bottom: 60px;
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          transition-delay: var(--delay);
        }
        .tl-item.tl-left { transform: translateX(-30px); }
        .tl-item.tl-right { transform: translateX(30px); }
        .tl-item.tl-visible { opacity: 1; transform: translateX(0); }

        .tl-left .tl-node-wrap { grid-column: 2; }
        .tl-left .tl-card { grid-column: 1; margin-right: 30px; text-align: right; }
        .tl-right .tl-node-wrap { grid-column: 2; }
        .tl-right .tl-card { grid-column: 3; margin-left: 30px; }

        .tl-node {
          width: 50px; height: 50px;
          border-radius: 50%;
          background: #0f0620;
          border: 2px solid var(--color);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          z-index: 2;
          box-shadow: 0 0 20px var(--glow);
        }
        .tl-node-ring {
          position: absolute;
          width: 65px; height: 65px;
          border-radius: 50%;
          border: 1px solid var(--color);
          opacity: 0.2;
          animation: pulse 3s infinite;
        }
        @keyframes pulse { 0% {transform: scale(1); opacity: 0.2;} 50% {transform: scale(1.15); opacity: 0;} 100% {transform: scale(1); opacity: 0.2;} }

        .tl-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 25px;
          transition: all 0.4s ease;
        }
        .tl-item:hover .tl-card {
          border-color: var(--color);
          background: rgba(255,255,255,0.04);
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .tl-phase-badge {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--color);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          color: #000;
          font-size: 12px;
        }
        .tl-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; }
        .tl-left .tl-card-header { flex-direction: row-reverse; }

        .tl-tags { display: flex; gap: 8px; align-items: center; }
        .tl-left .tl-tags { flex-direction: row-reverse; }

        .tl-tag {
          font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color);
          background: rgba(255,255,255,0.05); padding: 3px 10px; border-radius: 50px;
        }
        .tl-duration { font-size: 12px; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 4px; }

        .tl-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 4px; }
        .tl-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 12px; font-weight: 500; }
        .tl-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 15px; }

        .tl-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .tl-left .tl-skills { justify-content: flex-end; }
        .tl-skill { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }

        .tl-total-val { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #FF0F7B, #F89B29); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tl-total-badge { display: inline-flex; align-items: center; gap: 20px; background: rgba(255,255,255,0.03); padding: 20px 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); margin-top: 40px; }
        
        @media (max-width: 768px) {
          .tl-track::before { left: 25px; transform: none; }
          .tl-item { grid-template-columns: 60px 1fr; }
          .tl-left .tl-node-wrap, .tl-right .tl-node-wrap { grid-column: 1; }
          .tl-left .tl-card, .tl-right .tl-card { grid-column: 2; margin-left: 15px; text-align: left; }
          .tl-left .tl-card-header, .tl-left .tl-tags, .tl-left .tl-skills { flex-direction: row; justify-content: flex-start; }
          .tl-total-badge { flex-direction: column; }
        }
      `}</style>

      <section className="tl-section">
        <div className="tl-bg-grid" />
        <div className="tl-bg-radial" />

        <div className="tl-header">
          <div className="tl-header-eyebrow"><span />Learning Path<span /></div>
          <h2 className="tl-header-title">Master the <em>MERN Stack</em></h2>
          <p className="tl-header-sub">A structured roadmap designed to take you from basic concepts to production-ready applications.</p>
          <div className="tl-progress-bar">
            {timelineData.map((_, i) => <div key={i} className="tl-progress-seg active" />)}
          </div>
        </div>

        <div className="tl-track">
          {timelineData.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="tl-total-badge">
            <div><span className="tl-total-val">16</span><span style={{fontSize:'12px', display:'block', color:'gray'}}>Weeks</span></div>
            <div style={{width:'1px', height:'30px', background:'rgba(255,255,255,0.1)'}} />
            <div><span className="tl-total-val">24+</span><span style={{fontSize:'12px', display:'block', color:'gray'}}>Skills</span></div>
            <div style={{width:'1px', height:'30px', background:'rgba(255,255,255,0.1)'}} />
            <div><span className="tl-total-val">06</span><span style={{fontSize:'12px', display:'block', color:'gray'}}>Phases</span></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Timeline;