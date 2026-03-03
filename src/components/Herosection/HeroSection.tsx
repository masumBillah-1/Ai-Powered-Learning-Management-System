import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;0,800;0,900;1,900&family=Poppins:wght@400;500;600;700&display=swap');

        :root {
          --bp: #FF0F7B;
          --bo: #F89B29;
          --bpu: #832388;
          --br: #E3436B;
          --by: #FDE047;
          --g1: linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%);
          --g2: linear-gradient(135deg, #832388 0%, #E3436B 55%, #F89B29 100%);
          --g3: linear-gradient(135deg, #FF0F7B 0%, #832388 100%);
        }

        .hero-wrap {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', sans-serif;
        }

        .hero-bg {
          position: absolute !important;
          inset: 0;
          z-index: 0;
          object-fit: cover !important;
          object-position: center center !important;
          width: 100vw !important;
          height: 100vh !important;
          animation: heroZoom 18s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1.00); }
          to   { transform: scale(1.03); }
        }

        .hero-ov1 {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            160deg,
            rgba(255, 15, 123, 0.28) 0%,
            rgba(131, 35, 136, 0.22) 28%,
            rgba(227, 67, 107, 0.14) 55%,
            rgba(248, 155, 41, 0.20) 100%
          );
        }
        [data-theme="dark"] .hero-ov1, .dark .hero-ov1 {
          background: linear-gradient(
            160deg,
            rgba(255, 15, 123, 0.50) 0%,
            rgba(131, 35, 136, 0.45) 30%,
            rgba(18, 5, 30, 0.70)    60%,
            rgba(8, 4, 14, 0.80)    100%
          );
        }

        .hero-ov2 {
          position: absolute; inset: 0; z-index: 2;
          background:
            radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,0,0,0.45) 0%, transparent 100%),
            radial-gradient(ellipse 40% 40% at 0%   0%,  rgba(255,15,123,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 100% 0%,  rgba(248,155,41,0.18) 0%, transparent 70%);
        }
        [data-theme="dark"] .hero-ov2 {
          background:
            radial-gradient(ellipse 70% 70% at 50% 110%, rgba(0,0,0,0.75) 0%, transparent 100%),
            radial-gradient(ellipse 50% 50% at 0%   0%,  rgba(255,15,123,0.30) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 100% 0%,  rgba(131,35,136,0.30) 0%, transparent 70%);
        }

        .hero-ov3 {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(253, 224, 71, 0.06) 50%,
            transparent 70%
          );
          background-size: 300% 300%;
          animation: heroMesh 8s ease-in-out infinite;
        }
        @keyframes heroMesh {
          0%, 100% { background-position: 0% 0%; }
          50%       { background-position: 100% 100%; }
        }

        .hero-ov4 {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 65%;
          z-index: 4;
          background: linear-gradient(
            to top,
            rgba(20, 4, 30, 0.72) 0%,
            rgba(30, 8, 40, 0.48) 40%,
            transparent 100%
          );
        }
        [data-theme="dark"] .hero-ov4 {
          background: linear-gradient(
            to top,
            rgba(6, 2, 12, 0.88) 0%,
            rgba(12, 4, 22, 0.65) 45%,
            transparent 100%
          );
        }

        .hero-noise {
          position: absolute; inset: 0; z-index: 5;
          opacity: 0.03;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 6;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(255,15,123,0.22) 0%, transparent 65%);
          animation: heroOrbDrift 12s ease-in-out infinite;
          filter: blur(1px);
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          top: -160px; right: -120px;
          background: radial-gradient(circle, rgba(248,155,41,0.20) 0%, transparent 65%);
          animation: heroOrbDrift 15s ease-in-out infinite reverse;
          filter: blur(1px);
        }
        .hero-orb-3 {
          width: 300px; height: 300px;
          bottom: 5%; left: 50%; transform: translateX(-50%);
          background: radial-gradient(circle, rgba(131,35,136,0.18) 0%, transparent 65%);
          animation: heroOrbDrift3 10s ease-in-out infinite;
          filter: blur(1px);
        }
        @keyframes heroOrbDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.08); }
          66%       { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes heroOrbDrift3 {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50%       { transform: translateX(-48%) scale(1.1); }
        }

        .hero-spark {
          position: absolute;
          z-index: 7;
          pointer-events: none;
          animation: heroSparkle ease-in-out infinite;
        }
        .hero-spark::before {
          content: '✦';
          font-size: inherit;
          background: var(--g1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hs1 { font-size:18px; top:12%; left:8%;  animation-duration:3s;  animation-delay:0s; }
        .hs2 { font-size:12px; top:18%; right:12%; animation-duration:4s;  animation-delay:-1s; }
        .hs3 { font-size:22px; top:8%;  left:45%; animation-duration:3.5s; animation-delay:-0.5s; }
        .hs4 { font-size:10px; top:30%; left:3%;  animation-duration:5s;  animation-delay:-2s; }
        .hs5 { font-size:14px; top:25%; right:5%; animation-duration:4.5s; animation-delay:-1.5s; }
        @keyframes heroSparkle {
          0%, 100% { opacity: 0.8; transform: scale(1)   rotate(0deg); }
          25%       { opacity: 0.3; transform: scale(0.6) rotate(90deg); }
          50%       { opacity: 1;   transform: scale(1.3) rotate(180deg); }
          75%       { opacity: 0.5; transform: scale(0.8) rotate(270deg); }
        }

        .hero-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 6;
          border: 1.5px solid;
          animation: heroRingSpin linear infinite;
        }
        .ring-1 {
          width: 180px; height: 180px;
          top: 5%; right: 8%;
          border-color: rgba(255,15,123,0.25);
          animation-duration: 20s;
        }
        .ring-2 {
          width: 100px; height: 100px;
          top: 10%; right: 12%;
          border-color: rgba(248,155,41,0.2);
          animation-duration: 15s;
          animation-direction: reverse;
        }
        .ring-3 {
          width: 140px; height: 140px;
          bottom: 18%; left: 6%;
          border-color: rgba(131,35,136,0.2);
          animation-duration: 18s;
        }
        @keyframes heroRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 100px 24px 80px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 22px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.28);
          backdrop-filter: blur(16px);
          box-shadow:
            0 0 0 1px rgba(255,15,123,0.3),
            0 8px 32px rgba(255,15,123,0.25),
            inset 0 1px 0 rgba(255,255,255,0.15);
          margin-bottom: 32px;
          animation: heroFadeDown 0.9s ease both;
          letter-spacing: 0.01em;
        }
        .hero-badge-live {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .hero-badge-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74,222,128,0.8);
          animation: heroPing 1.4s ease infinite;
        }
        @keyframes heroPing {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.6); opacity:0.4; }
        }
        .hero-badge-divider {
          width: 1px; height: 16px;
          background: rgba(255,255,255,0.3);
        }
        .hero-badge-avatars { display: flex; }
        .hero-badge-avatars span {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.5);
          margin-left: -8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
        }
        .hero-badge-avatars span:first-child { margin-left: 0; }

        .hero-eyebrow {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-bottom: 14px;
          animation: heroFadeDown 0.9s 0.05s ease both;
        }

        .hero-headline {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.025em;
          width: 100%;
          max-width: 100vw;
          margin-bottom: 28px;
          animation: heroFadeDown 0.9s 0.12s ease both;
          color: #fff;
          text-shadow: 0 2px 30px rgba(0,0,0,0.3);
        }
        .hl-l1 {
          display: block;
          font-size: clamp(3.5rem, 10vw, 8rem);
          margin-bottom: 2px;
        }
        .hl-l2 {
          display: block;
          font-size: clamp(3.5rem, 10vw, 8rem);
          margin-bottom: 2px;
        }
        .hl-l3 {
          display: block;
          font-size: clamp(2.5rem, 7vw, 5.5rem);
          font-style: italic;
          letter-spacing: 0.01em;
          margin-top: 6px;
        }
        .hl-grad {
          background: var(--g1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline;
        }
        .hl-grad2 {
          background: var(--g2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline;
        }
        .hl-underline {
          position: relative;
          display: inline-block;
        }
        .hl-underline::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 100%; height: 4px;
          border-radius: 2px;
          background: var(--g1);
          transform-origin: left;
          animation: heroUnderline 1.2s 1s ease both;
        }
        @keyframes heroUnderline {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        .hl-box {
          position: relative;
          display: inline-block;
          padding: 0 12px;
        }
        .hl-box::before {
          content: '';
          position: absolute;
          inset: 0px -4px;
          background: var(--g1);
          border-radius: 8px;
          z-index: -1;
          opacity: 0.22;
          animation: heroBoxFade 1s 0.7s ease both;
        }
        @keyframes heroBoxFade {
          from { opacity:0; transform:scaleX(0.4); }
          to   { opacity:0.22; transform:scaleX(1); }
        }
        .hl-glow {
          background: var(--g2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(255,15,123,0.5));
        }

        .hero-sub {
          font-size: clamp(14px, 1.8vw, 16px);
          color: rgba(255,255,255,0.78);
          max-width: 480px;
          line-height: 1.8;
          margin-bottom: 42px;
          animation: heroFadeDown 0.9s 0.25s ease both;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          padding: 14px 24px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          animation: heroFadeDown 0.9s 0.38s ease both;
        }
        .hero-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--g1);
          color: white;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 16px;
          padding: 16px 40px;
          border-radius: 50px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,15,123,0.5),
            0 10px 40px rgba(255,15,123,0.5),
            0 0 80px rgba(255,15,123,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: skewX(-20deg);
          animation: heroBtnShimmer 3s ease infinite;
        }
        @keyframes heroBtnShimmer {
          0%   { left: -100%; }
          60%  { left: 160%; }
          100% { left: 160%; }
        }
        .hero-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow:
            0 0 0 1px rgba(255,15,123,0.6),
            0 18px 55px rgba(255,15,123,0.65),
            0 0 100px rgba(255,15,123,0.25);
        }
        .hero-btn > * { position: relative; z-index: 1; }
        .hero-btn svg { transition: transform 0.2s ease; }
        .hero-btn:hover svg { transform: translateX(5px); }
        .hero-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(14px);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          padding: 15px 34px;
          border-radius: 50px;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.28);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .hero-btn-ghost:hover {
          background: rgba(255,255,255,0.20);
          border-color: rgba(255,255,255,0.5);
          transform: translateY(-3px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.2),
            0 10px 30px rgba(0,0,0,0.2);
        }
        .play-icon {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .hero-stat {
          position: absolute;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: 20px;
          font-family: 'Nunito', sans-serif;
          animation: heroFloatY 4s ease-in-out infinite;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .hero-stat .s-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hero-stat .s-val {
          display: block;
          font-size: 18px; font-weight: 900; line-height: 1;
          color: #fff;
        }
        .hero-stat .s-label {
          display: block;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.65);
          margin-top: 2px;
        }
        .stat-students { left: 3%; top: 35%; animation-delay: 0s; }
        .stat-courses  { right: 3%; top: 28%; animation-delay: 1.6s; }
        .stat-rating   { right: 4%; bottom: 26%; animation-delay: 0.9s; }
        .stat-students .s-icon { background: linear-gradient(135deg, rgba(255,15,123,0.3), rgba(131,35,136,0.2)); }
        .stat-courses  .s-icon { background: linear-gradient(135deg, rgba(248,155,41,0.3), rgba(227,67,107,0.2)); }
        .stat-rating   .s-icon { background: linear-gradient(135deg, rgba(253,224,71,0.3), rgba(248,155,41,0.2)); }
        .hero-stars { color: #FDE047; font-size: 12px; letter-spacing: 1px; }

        .hero-bottom {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 100px;
          z-index: 9;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(10,2,18,0.6));
        }

        @keyframes heroFloatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes heroFadeDown {
          from { opacity:0; transform:translateY(-26px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @media (max-width: 768px) {
          .stat-students { left:2%; top:auto; bottom:44%; }
          .stat-courses  { right:2%; top:auto; bottom:56%; }
          .stat-rating   { display: none; }
          .hero-content  { padding: 80px 16px 60px; }
        }
        @media (max-width: 480px) {
          .hero-ring { display: none; }
          .stat-students, .stat-courses { display: none; }
        }
      `}</style>

      <section className="hero-wrap">
        <Image
          src="/home-background-min.webp"
          alt="Students learning"
          fill
          className="hero-bg"
          priority
          quality={92}
        />

        <div className="hero-ov1" />
        <div className="hero-ov2" />
        <div className="hero-ov3" />
        <div className="hero-ov4" />
        <div className="hero-noise" />

        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <span className="hero-spark hs1" />
        <span className="hero-spark hs2" />
        <span className="hero-spark hs3" />
        <span className="hero-spark hs4" />
        <span className="hero-spark hs5" />

        <div className="hero-ring ring-1" />
        <div className="hero-ring ring-2" />
        <div className="hero-ring ring-3" />

        <div className="hero-stat stat-students">
          <div className="s-icon">👥</div>
          <div>
            <span className="s-val">12,000+</span>
            <span className="s-label">Active Students</span>
          </div>
        </div>

        <div className="hero-stat stat-courses">
          <div className="s-icon">📚</div>
          <div>
            <span className="s-val">200+</span>
            <span className="s-label">Courses Available</span>
          </div>
        </div>

        <div className="hero-stat stat-rating">
          <div className="s-icon">⭐</div>
          <div>
            <span className="s-val">4.9 / 5.0</span>
            <span className="hero-stars">★★★★★</span>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-avatars">
              <span>😊</span>
              <span>🎓</span>
              <span>✨</span>
            </div>
            <div className="hero-badge-divider" />
            <div className="hero-badge-live">
              <div className="hero-badge-live-dot" />
              <span>1,500+ Users Learning Now</span>
            </div>
          </div>

          <h1 className="hero-headline">
            <span className="hero-eyebrow">✦ Your future starts here ✦</span>
            <span className="hl-l1">
              Learn{' '}
              <span className="hl-grad hl-underline">Smarter.</span>
            </span>
            <span className="hl-l2">
              Grow{' '}
              <span className="hl-grad hl-box">Faster.</span>
            </span>
            <span className="hl-l3">
              <span className="hl-glow">Succeed Anywhere.</span>
            </span>
          </h1>

          <p className="hero-sub">
            Practical, industry-ready courses taught by expert instructors.
            Learn at your own pace or live from anywhere in the world.
          </p>

          <div className="hero-btns">
            <a href="#" className="hero-btn">
              <span>Explore Courses</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#" className="hero-btn-ghost">
              <div className="play-icon">▶</div>
              Watch Demo
            </a>
          </div>
        </div>

        <div className="hero-bottom" />
      </section>
    </>
  );
};

export default HeroSection;