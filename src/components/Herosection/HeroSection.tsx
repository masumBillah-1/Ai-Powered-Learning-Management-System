'use client';
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,300&family=Outfit:wght@400;600;700;800&display=swap');

        :root {
          --pk: #FF0F7B; --or: #F89B29; --pu: #832388; --re: #E3436B;
          --g1: linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%);
          --g2: linear-gradient(135deg, #832388 0%, #E3436B 55%, #F89B29 100%);
        }

        .hx-wrap {
          position: relative; width: 100%; height: 100vh; min-height: 700px;
          overflow: hidden; display: flex; align-items: center; justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Real photo background ── */
        .hx-bg-img {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 30%;
          animation: hxZoom 20s ease-in-out infinite alternate;
        }
        @keyframes hxZoom {
          from { transform: scale(1.00); }
          to   { transform: scale(1.04); }
        }

        /* ── Dark cinematic overlays ── */
      .hx-ov1 {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    160deg,
    rgba(5,1,15,0.55) 0%,
    rgba(10,1,25,0.45) 30%,
    rgba(8,2,18,0.35) 60%,
    rgba(5,1,12,0.50) 100%
  );
}.hx-ov1 {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    160deg,
    rgba(5,1,15,0.55) 0%,
    rgba(10,1,25,0.45) 30%,
    rgba(8,2,18,0.35) 60%,
    rgba(5,1,12,0.50) 100%
  );
}
        .hx-ov2 {
          position: absolute; inset: 0; z-index: 2;
          background:
            radial-gradient(ellipse 80% 60% at 50% 110%, rgba(0,0,0,0.7) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 0% 0%, rgba(255,15,123,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 100% 0%, rgba(248,155,41,0.12) 0%, transparent 60%);
        }
     .hx-ov3 {
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 60%; z-index: 3;
  background: linear-gradient(to top, rgba(5,1,15,0.60) 0%, rgba(8,2,20,0.30) 40%, transparent 100%);
}
        /* ── Scanline texture ── */
        .hx-scanline {
          position: absolute; inset: 0; z-index: 4; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px);
        }

        /* ── Color tint pulse ── */
        .hx-tint {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(135deg, rgba(255,15,123,0.08) 0%, transparent 50%, rgba(248,155,41,0.06) 100%);
          animation: hxTintPulse 6s ease-in-out infinite;
        }
        @keyframes hxTintPulse {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .hx-content {
          position: relative; z-index: 10; width: 100%; max-width: 980px;
          margin: 0 auto; padding: 0 32px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        /* ── Pill ── */
        .hx-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 18px 7px 10px; border-radius: 100px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(255,15,123,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
          margin-bottom: 40px; animation: hxFade 1s 0.1s ease both;
        }
        .hx-pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 10px #4ade80;
          animation: hxPulse 1.6s ease infinite; flex-shrink: 0;
        }
        .hx-pill-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.03em;
          color: rgba(255,255,255,0.75);
        }
        .hx-pill-icon {
          width: 26px; height: 26px; border-radius: 50%; background: var(--g1);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; box-shadow: 0 0 12px rgba(255,15,123,0.5); flex-shrink: 0;
        }
        @keyframes hxPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.8); }
        }

        /* ── Headline ── */
        .hx-headline {
          font-family: 'Outfit', sans-serif;
          font-weight: 800; line-height: 1.0; letter-spacing: -0.03em;
          color: #fff; animation: hxFade 1s 0.2s ease both;
        }
        .hx-line1 {
          display: block; font-size: clamp(3.2rem, 9vw, 7.5rem);
          color: rgba(255,255,255,0.95); margin-bottom: -2px;
        }
        .hx-line2 {
          display: block; font-size: clamp(3.2rem, 9vw, 7.5rem); margin-bottom: -2px;
        }
        .hx-line3 {
          display: block; font-size: clamp(1.4rem, 3.5vw, 2.8rem);
          font-weight: 300; font-style: italic; letter-spacing: 0.01em;
          margin-top: 12px; color: rgba(255,255,255,0.4);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .hx-grad {
          background: var(--g1); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hx-grad2 {
          background: var(--g2); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hx-highlight { position: relative; display: inline-block; }
        .hx-highlight::before {
          content: ''; position: absolute; inset: -2px -8px;
          background: var(--g1); border-radius: 6px; z-index: -1;
          opacity: 0; transform: scaleX(0.2);
          animation: hxHighlight 1s 1.2s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes hxHighlight { to { opacity: 0.18; transform: scaleX(1); } }
        .hx-underword { position: relative; display: inline-block; }
        .hx-underword::after {
          content: ''; position: absolute; left: 0; bottom: 2px;
          width: 100%; height: 3px; border-radius: 3px; background: var(--g1);
          transform: scaleX(0); transform-origin: left;
          animation: hxUnderline 0.9s 1.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes hxUnderline { to { transform: scaleX(1); } }

        /* ── Descriptor row ── */
        .hx-desc-row {
          display: flex; align-items: center; gap: 20px;
          margin-top: 34px; margin-bottom: 40px;
          animation: hxFade 1s 0.4s ease both;
        }
        .hx-desc-line { width: 40px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25)); }
        .hx-desc-line.right { background: linear-gradient(90deg, rgba(255,255,255,0.25), transparent); }
        .hx-desc {
          font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4);
          letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Buttons ── */
        .hx-btns {
          display: flex; align-items: center; gap: 14px;
          flex-wrap: wrap; justify-content: center;
          animation: hxFade 1s 0.5s ease both;
        }
        .hx-cta {
          position: relative; display: inline-flex; align-items: center; gap: 12px;
          padding: 15px 36px; border-radius: 100px;
          font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px;
          color: #fff; text-decoration: none; border: none; cursor: pointer;
          overflow: hidden; background: var(--g1);
          box-shadow: 0 0 0 1px rgba(255,15,123,0.4), 0 8px 30px rgba(255,15,123,0.5), 0 0 60px rgba(255,15,123,0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hx-cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
          pointer-events: none;
        }
        .hx-cta::after {
          content: ''; position: absolute; top: 0; left: -60%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-25deg); animation: hxShimmer 3.5s ease infinite 1s;
        }
        @keyframes hxShimmer { 0% { left:-60%; } 55% { left:160%; } 100% { left:160%; } }
        .hx-cta:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 0 1px rgba(255,15,123,0.5), 0 16px 45px rgba(255,15,123,0.65), 0 0 80px rgba(255,15,123,0.2);
        }
        .hx-cta-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 14px; transition: transform 0.2s ease;
        }
        .hx-cta:hover .hx-cta-arrow { transform: translateX(3px); }
        .hx-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 100px;
          font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px;
          color: rgba(255,255,255,0.7); text-decoration: none; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px); transition: all 0.25s ease;
        }
        .hx-ghost:hover { color:#fff; border-color:rgba(255,255,255,0.35); background:rgba(255,255,255,0.12); transform:translateY(-2px); }
        .hx-play {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; font-size: 10px;
        }

        /* ── Stats bar ── */
   .hx-stats{
  display:flex;
  align-items:stretch;
  margin-top:50px;
  border-radius:20px;
  overflow:hidden;

  /* glass effect */
  background:rgba(255,255,255,0.14);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);

  border:1px solid rgba(255,255,255,0.4);

  box-shadow:
    0 10px 40px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.6);
}
        .hx-stat-item {
          flex: 1; padding: 22px 28px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }
        .hx-stat-item:last-child { border-right: none; }
        .hx-stat-val {
          display: block; font-family: 'Outfit', sans-serif; font-weight: 800;
          font-size: clamp(1.4rem, 2.8vw, 2rem);
          background: var(--g1); -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1;
        }
        .hx-stat-lbl {
          display: block; font-size: 10.5px; font-weight: 500;
          color: rgba(255,255,255,0.4); letter-spacing: 0.1em;
          text-transform: uppercase; margin-top: 5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Floating badges ── */
        .hx-badge {
          position: absolute; z-index: 12; display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: 16px;
          background: rgba(5,1,15,0.8); border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(24px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          animation: hxFloat ease-in-out infinite;
        }
        .hx-badge-icon { font-size: 20px; line-height: 1; }
        .hx-badge-info { display: flex; flex-direction: column; gap: 2px; }
        .hx-badge-val { font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700; color: #fff; line-height: 1; }
        .hx-badge-sub { font-size: 10px; color: rgba(255,255,255,0.45); font-family: 'Plus Jakarta Sans', sans-serif; }
        .hx-badge-dot { width:7px; height:7px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80; animation:hxPulse 1.6s ease infinite; flex-shrink:0; }

        .badge-tl { top:22%; left:4%; animation-duration:5s; animation-delay:0s; }
        .badge-tr { top:18%; right:4%; animation-duration:6s; animation-delay:-1.5s; }
        .badge-br { bottom:26%; right:4%; animation-duration:4.5s; animation-delay:-0.8s; }
        @keyframes hxFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

        /* ── Corner accents ── */
        .hx-corner { position:absolute; z-index:5; width:48px; height:48px; pointer-events:none; }
        .hx-corner-tl { top:20px; left:20px; border-top:1px solid rgba(255,15,123,0.3); border-left:1px solid rgba(255,15,123,0.3); }
        .hx-corner-tr { top:20px; right:20px; border-top:1px solid rgba(248,155,41,0.3); border-right:1px solid rgba(248,155,41,0.3); }
        .hx-corner-bl { bottom:20px; left:20px; border-bottom:1px solid rgba(131,35,136,0.3); border-left:1px solid rgba(131,35,136,0.3); }
        .hx-corner-br { bottom:20px; right:20px; border-bottom:1px solid rgba(227,67,107,0.3); border-right:1px solid rgba(227,67,107,0.3); }

   .hx-fade-bottom {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 120px;
  z-index: 8; pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(5,1,15,0.40));
}

        @keyframes hxFade { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width: 900px) {
          .badge-tl, .badge-tr, .badge-br { display: none; }
          .hx-stat-item { padding: 16px 16px; }
        }
        @media (max-width: 600px) {
          .hx-content { padding: 0 18px; }
          .hx-stats { flex-wrap: wrap; border-radius: 16px; }
          .hx-stat-item { flex: 1 1 50%; border-right: 1px solid rgba(255,255,255,0.07); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 14px; }
          .hx-corner { display: none; }
          .hx-desc-row { display: none; }
        }
      `}</style>

      <section className="hx-wrap">

        {/* ── Real education background image (Unsplash) ── */}
        <img
          src="https://png.pngtree.com/background/20250105/original/pngtree-beautiful-green-nature-blurred-background-picture-image_15534396.jpg"
          alt="Students learning together"
          className="hx-bg-img"
        />

        {/* ── Overlays ── */}
        <div className="hx-ov1" />
        <div className="hx-ov2" />
        <div className="hx-ov3" />
        <div className="hx-tint" />
        <div className="hx-scanline" />

        {/* ── Corner accents ── */}
        <div className="hx-corner hx-corner-tl" />
        <div className="hx-corner hx-corner-tr" />
        <div className="hx-corner hx-corner-bl" />
        <div className="hx-corner hx-corner-br" />

        {/* ── Floating badges ── */}
        <div className="hx-badge badge-tl">
          <div className="hx-badge-icon">🎓</div>
          <div className="hx-badge-info">
            <span className="hx-badge-val">12,000+</span>
            <span className="hx-badge-sub">Active Learners</span>
          </div>
          <div className="hx-badge-dot" />
        </div>

        <div className="hx-badge badge-tr">
          <div className="hx-badge-icon">⭐</div>
          <div className="hx-badge-info">
            <span className="hx-badge-val">4.9 / 5.0</span>
            <span className="hx-badge-sub">Student Rating</span>
          </div>
        </div>

        <div className="hx-badge badge-br">
          <div className="hx-badge-icon">📚</div>
          <div className="hx-badge-info">
            <span className="hx-badge-val">200+ Courses</span>
            <span className="hx-badge-sub">Live & On-demand</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="hx-content">
          <div className="hx-pill">
            <div className="hx-pill-dot" />
            <span className="hx-pill-text">1,500+ students learning right now</span>
            <div className="hx-pill-icon">✦</div>
          </div>

          <h1 className="hx-headline">
            <span className="hx-line1">
              <span className="hx-grad hx-underword">Learn</span> Smarter.
            </span>
            <span className="hx-line2">
              Grow <span className="hx-grad2 hx-highlight">Faster.</span>
            </span>
            <span className="hx-line3">
              Succeed — anywhere in the world.
            </span>
          </h1>

          <div className="hx-desc-row">
            <div className="hx-desc-line" />
            <span className="hx-desc">Practical · Expert-led · Industry-ready</span>
            <div className="hx-desc-line right" />
          </div>

          <div className="hx-btns">
            <a href="#" className="hx-cta">
              <span>Explore Courses</span>
              <div className="hx-cta-arrow">→</div>
            </a>
            <a href="#" className="hx-ghost">
              <div className="hx-play">▶</div>
              Watch Demo
            </a>
          </div>

          <div className="hx-stats">
            <div className="hx-stat-item">
              <span className="hx-stat-val">12K+</span>
              <span className="hx-stat-lbl">Students</span>
            </div>

            <div className="hx-stat-item">
              <span className="hx-stat-val">200+</span>
              <span className="hx-stat-lbl">Courses</span>
            </div>

            <div className="hx-stat-item">
              <span className="hx-stat-val">4.9★</span>
              <span className="hx-stat-lbl">Rating</span>
            </div>

            <div className="hx-stat-item">
              <span className="hx-stat-val">98%</span>
              <span className="hx-stat-lbl">Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hx-fade-bottom" />
      </section>
    </>
  );
};

export default HeroSection;