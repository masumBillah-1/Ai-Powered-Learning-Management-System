"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const faqData = [
  {
    id: "01",
    question: "What exactly will I learn in this multidisciplinary bootcamp?",
    answer: "This bootcamp is a complete power-pack. You will master Graphics Design (UI/UX & Branding), Digital Marketing (Social Media, SEO & Ads), and Full-Stack Web Development. We ensure you become a versatile digital professional who can handle any project from start to finish.",
    tag: "Curriculum", icon: "🎯",
  },
  {
    id: "02",
    question: "Do I need prior experience in design or coding?",
    answer: "Not at all! We start from absolute zero in all three sectors. Whether it's picking your first color palette in Graphics, running your first ad in Marketing, or writing your first line of code in Web — we guide you every step of the way.",
    tag: "Beginner", icon: "🌱",
  },
  {
    id: "03",
    question: "Will I get real-world projects to build my portfolio?",
    answer: "Yes! You will complete 10+ professional projects, including Brand Identity design, live Ad Campaign strategies, and fully functional Web Applications. By the end of the course, you'll have a world-class portfolio to show clients or employers.",
    tag: "Projects", icon: "💼",
  },
  {
    id: "04",
    question: "How does the job placement support work?",
    answer: "Our dedicated placement cell works 1-on-1 with you. We help you build a professional presence on LinkedIn/Behance, conduct mock interviews, and share your profile with our network of creative agencies and tech firms.",
    tag: "Career", icon: "🚀",
  },
  {
    id: "05",
    question: "Is the course schedule flexible for students/professionals?",
    answer: "Absolutely. The modules are structured so you can learn at your own pace. While there are weekly deadlines to keep you on track, the recorded sessions and 24/7 support allow you to balance this with your study or job.",
    tag: "Schedule", icon: "⏰",
  },
  {
    id: "06",
    question: "What tools and software will be covered?",
    answer: "You will master industry-standard tools like Figma and Adobe Suite for Design; Meta Business Suite and Google Analytics for Marketing; and React, Next.js, and Tailwind CSS for Web Development.",
    tag: "Tools", icon: "🛠️",
  },
];

const tagColors: Record<string, string> = {
  Curriculum: "#FF0F7B",
  Beginner:   "#00C48C",
  Projects:   "#F89B29",
  Career:     "#832388",
  Schedule:   "#61DAFB",
  Tools:      "#E3436B",
};

/* ══════════════════════════════════════
   ANIMATED HEIGHT WRAPPER
══════════════════════════════════════ */
const AnimatedAnswer = ({ open, children }: { open: boolean; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  });
  return (
    <div style={{
      maxHeight: open ? `${height + 8}px` : "0px",
      opacity: open ? 1 : 0,
      overflow: "hidden",
      transition: "max-height 0.48s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease",
    }}>
      <div ref={ref}>{children}</div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .faq-section {
          position: relative;
          padding: 110px 20px 130px;
          overflow: hidden;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s;
        }
        .dark .faq-section { background: #07040f; }

        /* blobs */
        .faq-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          animation: faqBlob 14s ease-in-out infinite;
        }
        .faq-blob-1 {
          width:480px;height:480px;top:-140px;left:-80px;
          background:radial-gradient(circle,rgba(255,15,123,0.08),transparent 70%);
        }
        .faq-blob-2 {
          width:380px;height:380px;top:-60px;right:-70px;
          background:radial-gradient(circle,rgba(131,35,136,0.08),transparent 70%);
          animation-direction:reverse;animation-duration:17s;
        }
        .faq-blob-3 {
          width:320px;height:320px;bottom:-40px;left:35%;
          background:radial-gradient(circle,rgba(248,155,41,0.07),transparent 70%);
          animation-duration:11s;
        }
        .dark .faq-blob-1{background:radial-gradient(circle,rgba(255,15,123,0.15),transparent 70%);}
        .dark .faq-blob-2{background:radial-gradient(circle,rgba(131,35,136,0.15),transparent 70%);}
        .dark .faq-blob-3{background:radial-gradient(circle,rgba(248,155,41,0.12),transparent 70%);}
        @keyframes faqBlob {
          0%,100%{transform:translate(0,0) scale(1);}
          33%{transform:translate(18px,-12px) scale(1.07);}
          66%{transform:translate(-14px,10px) scale(0.96);}
        }

        .faq-inner {
          position:relative;z-index:2;
          max-width:800px;margin:0 auto;
        }

        /* ── HEADER ── */
        .faq-header { text-align:center; margin-bottom:68px; }

        .faq-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          font-size:11px;font-weight:700;letter-spacing:0.22em;
          text-transform:uppercase;color:#FF0F7B;
          border:1px solid rgba(255,15,123,0.22);
          background:rgba(255,15,123,0.05);
          padding:7px 20px;border-radius:50px;margin-bottom:22px;
        }
        .dark .faq-eyebrow{
          border-color:rgba(255,15,123,0.3);
          background:rgba(255,15,123,0.08);
        }
        .faq-ey-dot {
          width:6px;height:6px;border-radius:50%;
          background:linear-gradient(135deg,#FF0F7B,#F89B29);
          animation:faqDotPing 1.6s ease infinite;
        }
        @keyframes faqDotPing{
          0%,100%{transform:scale(1);opacity:1;}
          50%{transform:scale(1.7);opacity:0.4;}
        }

        .faq-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(2rem,4.5vw,3.4rem);
          font-weight:800;color:#0d0a1a;
          line-height:1.1;letter-spacing:-0.03em;
          margin-bottom:16px;
        }
        .dark .faq-title{color:#f5f0ff;}

        .faq-title-hl {
          position:relative;display:inline-block;
          background:linear-gradient(135deg,#832388,#E3436B,#F89B29);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .faq-title-hl::after {
          content:'';position:absolute;
          left:0;bottom:-3px;width:100%;height:3px;
          border-radius:2px;
          background:linear-gradient(135deg,#832388,#E3436B,#F89B29);
          transform-origin:left;
          animation:faqUL 1.2s 0.6s ease both;
        }
        @keyframes faqUL{from{transform:scaleX(0);}to{transform:scaleX(1);}}

        .faq-sub {
          font-size:15.5px;color:#6b6880;
          max-width:440px;margin:0 auto;line-height:1.75;
        }
        .dark .faq-sub{color:#8a80a0;}

        /* stats */
        .faq-stats{
          display:flex;justify-content:center;
          align-items:center;gap:28px;
          margin-top:30px;flex-wrap:wrap;
        }
        .faq-sv{
          font-family:'Syne',sans-serif;font-size:1.5rem;
          font-weight:800;display:block;
          background:linear-gradient(135deg,#FF0F7B,#F89B29);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;line-height:1;
        }
        .faq-sl{
          font-size:11px;font-weight:600;
          color:#9088a8;letter-spacing:0.05em;
          text-transform:uppercase;display:block;margin-top:3px;
        }
        .faq-sdiv{
          width:1px;height:34px;
          background:rgba(0,0,0,0.07);
        }
        .dark .faq-sdiv{background:rgba(255,255,255,0.07);}

        /* ══ LIST ══ */
        .faq-list{display:flex;flex-direction:column;gap:10px;}

        .faq-item{
          position:relative;
          border-radius:22px;overflow:hidden;
          transition:transform 0.3s ease, box-shadow 0.3s ease;
          cursor:pointer;
        }
        .faq-item:hover{transform:translateY(-2px);}

        /* animated gradient border */
        .faq-item::before{
          content:'';position:absolute;inset:0;
          border-radius:22px;padding:1.5px;
          background:var(--igrad,linear-gradient(135deg,#FF0F7B,#F89B29));
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;mask-composite:exclude;
          opacity:0;transition:opacity 0.3s;pointer-events:none;z-index:3;
        }
        .faq-item.is-open::before,
        .faq-item:hover::before{opacity:1;}

        .faq-shell{
          position:relative;z-index:1;border-radius:22px;
          background:#f8f7fc;
          transition:background 0.3s;
        }
        .dark .faq-shell{background:#110e1f;}
        .faq-item.is-open .faq-shell{background:#fff5fa;}
        .dark .faq-item.is-open .faq-shell{background:#18102a;}

        /* ── QUESTION ROW ── */
        .faq-row{
          width:100%;
          display:grid;
          grid-template-columns:50px 1fr 44px;
          align-items:center;
          gap:14px;
          padding:20px 22px;
          background:none;border:none;cursor:pointer;text-align:left;
        }

        /* icon badge */
        .faq-ibadge{
          width:44px;height:44px;border-radius:13px;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;flex-shrink:0;
          background:rgba(0,0,0,0.04);
          transition:background 0.3s, transform 0.35s;
        }
        .dark .faq-ibadge{background:rgba(255,255,255,0.06);}
        .faq-item.is-open .faq-ibadge{
          background:var(--icolor,#FF0F7B);
          transform:rotate(-8deg) scale(1.08);
        }

        /* meta + question */
        .faq-qtxt-wrap{min-width:0;}
        .faq-qtag{
          display:inline-block;
          font-size:10px;font-weight:700;
          letter-spacing:0.1em;text-transform:uppercase;
          color:var(--icolor,#FF0F7B);
          border:1px solid var(--icolor,#FF0F7B);
          padding:2px 9px;border-radius:50px;
          opacity:0.6;margin-bottom:5px;
          transition:opacity 0.3s;
        }
        .faq-item.is-open .faq-qtag{opacity:1;}
        .faq-qtext{
          font-size:clamp(14.5px,2vw,16.5px);
          font-weight:700;color:#1a0a2e;
          line-height:1.45;transition:color 0.3s;
          display:block;
        }
        .dark .faq-qtext{color:#ede8f8;}
        .faq-item.is-open .faq-qtext,
        .faq-item:hover .faq-qtext{color:var(--icolor,#FF0F7B);}

        /* toggle cross */
        .faq-cross{
          width:38px;height:38px;flex-shrink:0;
          border-radius:11px;
          display:flex;align-items:center;justify-content:center;
          background:rgba(0,0,0,0.04);
          transition:background 0.3s, transform 0.4s;
        }
        .dark .faq-cross{background:rgba(255,255,255,0.06);}
        .faq-item.is-open .faq-cross{
          background:var(--icolor,#FF0F7B);
          transform:rotate(45deg);
        }
        .faq-cross svg{
          width:14px;height:14px;
          stroke:#888;stroke-width:2.5;
          transition:stroke 0.3s;
        }
        .faq-item.is-open .faq-cross svg{stroke:#fff;}

        /* ── ANSWER ── */
        .faq-ans-inner{
          padding:0 22px 24px;
          padding-left:calc(22px + 50px + 14px);
        }
        .faq-ans-line{
          height:1px;
          background:linear-gradient(90deg,var(--icolor,#FF0F7B),transparent);
          opacity:0.18;margin-bottom:16px;border-radius:1px;
        }
        .faq-ans-text{
          font-size:15px;color:#5a4a70;line-height:1.82;
        }
        .dark .faq-ans-text{color:#9880b8;}
        .faq-ans-foot{
          display:flex;align-items:center;gap:8px;
          margin-top:16px;padding-top:12px;
          border-top:1px solid rgba(0,0,0,0.04);
        }
        .dark .faq-ans-foot{border-top-color:rgba(255,255,255,0.04);}
        .faq-ans-dot{
          width:5px;height:5px;border-radius:50%;
          background:var(--icolor,#FF0F7B);flex-shrink:0;
        }
        .faq-ans-label{
          font-size:11px;font-weight:600;
          color:var(--icolor,#FF0F7B);opacity:0.65;
        }

        /* ══ FOOTER ══ */
        .faq-footer{
          margin-top:60px;
          text-align:center;
          display:flex;flex-direction:column;align-items:center;gap:16px;
        }
        .faq-footer-note{
          font-size:14.5px;color:#9088a8;
        }
        .dark .faq-footer-note{color:#6a6080;}
        .faq-cta{
          position:relative;
          display:inline-flex;align-items:center;gap:12px;
          background:linear-gradient(135deg,#FF0F7B,#E3436B,#F89B29);
          color:#fff;font-family:'Syne',sans-serif;
          font-weight:700;font-size:16px;
          padding:16px 42px;border-radius:50px;
          text-decoration:none;border:none;cursor:pointer;
          overflow:hidden;
          box-shadow:0 10px 40px rgba(255,15,123,0.38);
          transition:transform 0.3s, box-shadow 0.3s;
        }
        .faq-cta::after{
          content:'';position:absolute;
          top:0;left:-100%;width:55%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent);
          transform:skewX(-18deg);
          animation:faqShimmer 3.5s ease infinite;
        }
        @keyframes faqShimmer{
          0%{left:-100%;}55%{left:160%;}100%{left:160%;}
        }
        .faq-cta:hover{
          transform:translateY(-4px) scale(1.03);
          box-shadow:0 18px 55px rgba(255,15,123,0.52);
        }
        .faq-cta>*{position:relative;z-index:1;}
        .faq-cta-arr{
          width:28px;height:28px;border-radius:50%;
          background:rgba(255,255,255,0.2);
          display:flex;align-items:center;justify-content:center;
          font-size:13px;
          transition:transform 0.25s;
        }
        .faq-cta:hover .faq-cta-arr{transform:translateX(5px);}

        @media(max-width:500px){
          .faq-row{grid-template-columns:42px 1fr 38px;gap:10px;padding:16px 14px;}
          .faq-ans-inner{padding-left:14px;}
          .faq-stats{gap:18px;}
        }
      `}</style>

      <section className="faq-section">
        <div className="faq-blob faq-blob-1" />
        <div className="faq-blob faq-blob-2" />
        <div className="faq-blob faq-blob-3" />

        <div className="faq-inner">

          {/* ── Header ── */}
          <div className="faq-header">
            <div className="faq-eyebrow">
              <span className="faq-ey-dot" />
              Got Questions?
              <span className="faq-ey-dot" />
            </div>
            <h2 className="faq-title">
              Your Questions{" "}
              <span className="faq-title-hl">Answered</span>
              <br />About Bootcamp
            </h2>
            <p className="faq-sub">
              Everything you need to know before you take the leap into your digital career journey.
            </p>
            <div className="faq-stats">
              <div className="text-center">
                <span className="faq-sv">6</span>
                <span className="faq-sl">Topics</span>
              </div>
              <div className="faq-sdiv" />
              <div className="text-center">
                <span className="faq-sv">24/7</span>
                <span className="faq-sl">Support</span>
              </div>
              <div className="faq-sdiv" />
              <div className="text-center">
                <span className="faq-sv">100%</span>
                <span className="faq-sl">Honest</span>
              </div>
            </div>
          </div>

          {/* ── List ── */}
          <div className="faq-list">
            {faqData.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const color = tagColors[faq.tag] ?? "#FF0F7B";
              return (
                <div
                  key={idx}
                  className={`faq-item${isOpen ? " is-open" : ""}`}
                  style={{
                    "--icolor": color,
                    "--igrad": `linear-gradient(135deg, ${color}, #F89B29)`,
                  } as React.CSSProperties}
                  onClick={() => toggle(idx)}
                >
                  <div className="faq-shell">
                    {/* Question row */}
                    <button className="faq-row" aria-expanded={isOpen}>
                      <div className="faq-ibadge">
                        <span>{faq.icon}</span>
                      </div>
                      <div className="faq-qtxt-wrap">
                        <span className="faq-qtag">{faq.tag}</span>
                        <span className="faq-qtext">{faq.question}</span>
                      </div>
                      <div className="faq-cross">
                        <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5"  y1="12" x2="19" y2="12" />
                        </svg>
                      </div>
                    </button>

                    {/* Answer */}
                    <AnimatedAnswer open={isOpen}>
                      <div className="faq-ans-inner">
                        <div className="faq-ans-line" />
                        <p className="faq-ans-text">{faq.answer}</p>
                        <div className="faq-ans-foot">
                          <div className="faq-ans-dot" />
                          <span className="faq-ans-label">{faq.tag} • Bootcamp FAQ</span>
                        </div>
                      </div>
                    </AnimatedAnswer>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div className="faq-footer">
            <p className="faq-footer-note">Still have questions? We're happy to help!</p>
            <Link href="/faq">
              <button className="faq-cta">
                <span>See All Questions</span>
                <div className="faq-cta-arr">→</div>
              </button>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default FAQ;