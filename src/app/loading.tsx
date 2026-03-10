export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); filter: blur(20px); }
          50% { opacity: 0.7; transform: scale(1.3); filter: blur(28px); }
        }

        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(10px) skewX(-5deg); }
          100% { opacity: 1; transform: translateY(0) skewX(0deg); }
        }

        @keyframes taglineFade {
          0% { opacity: 0; letter-spacing: 0.5em; }
          100% { opacity: 1; letter-spacing: 0.2em; }
        }

        @keyframes orbitSpin {
          from { transform: rotate(0deg) translateX(44px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
        }

        @keyframes orbitSpinReverse {
          from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(60px) rotate(360deg); }
        }

        @keyframes progressFill {
          0%   { width: 0%; }
          20%  { width: 25%; }
          50%  { width: 55%; }
          75%  { width: 78%; }
          100% { width: 95%; }
        }

        @keyframes dotPop {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-80px) translateX(20px) scale(0); opacity: 0; }
        }

        .bg-animate {
          background: linear-gradient(135deg, #fdf0f7, #fff0f9, #f0f4ff, #fff8f0);
          background-size: 400% 400%;
          animation: gradientShift 6s ease infinite;
        }

        .dark .bg-animate {
          background: linear-gradient(135deg, #0f0a1a, #150d24, #0a0f1e, #1a0d0f);
          background-size: 400% 400%;
          animation: gradientShift 6s ease infinite;
        }

        .logo-float { animation: logoFloat 2.8s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 2.8s ease-in-out infinite; }

        .text-reveal {
          animation: textReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .text-reveal-delay {
          animation: textReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
        }
        .tagline-fade {
          animation: taglineFade 0.9s ease 0.35s both;
        }

        .orbit-1 { animation: orbitSpin 2.2s linear infinite; }
        .orbit-2 { animation: orbitSpinReverse 3.4s linear infinite; }

        .progress-bar { animation: progressFill 3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        .dot-1 { animation: dotPop 1.2s ease-in-out 0s infinite; }
        .dot-2 { animation: dotPop 1.2s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dotPop 1.2s ease-in-out 0.4s infinite; }

        .particle { animation: particleFloat 2s ease-out infinite; }
        .particle:nth-child(2) { animation-delay: 0.4s; animation-duration: 2.4s; }
        .particle:nth-child(3) { animation-delay: 0.8s; animation-duration: 1.8s; }
        .particle:nth-child(4) { animation-delay: 1.2s; animation-duration: 2.2s; }
        .particle:nth-child(5) { animation-delay: 1.6s; animation-duration: 2.6s; }
      `}</style>

      <div className="bg-animate min-h-screen flex items-center justify-center overflow-hidden relative">

        {/* Background decorative blobs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-20 dark:opacity-10"
          style={{ background: "radial-gradient(circle, #FF0F7B, transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-20 dark:opacity-10"
          style={{ background: "radial-gradient(circle, #F89B29, transparent)", filter: "blur(60px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 dark:opacity-5"
          style={{ background: "radial-gradient(circle, #6710C2, transparent)", filter: "blur(80px)" }} />

        {/* Main card */}
        <div className="relative flex flex-col items-center">

          {/* Logo + Orbit system */}
          <div className="relative flex items-center justify-center mb-10" style={{ width: 160, height: 160 }}>

            {/* Outer orbit ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-pink-300/40 dark:border-pink-500/20" />
            <div className="absolute rounded-full border border-dashed border-orange-300/30 dark:border-orange-500/15"
              style={{ inset: "-18px" }} />

            {/* Orbiting dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="orbit-1 w-3 h-3 rounded-full shadow-lg"
                style={{ background: "linear-gradient(135deg, #FF0F7B, #F89B29)" }} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ inset: "-18px" }}>
              <div className="orbit-2 w-2 h-2 rounded-full shadow-md"
                style={{ background: "linear-gradient(135deg, #6710C2, #FF0F7B)" }} />
            </div>

            {/* Glow behind logo */}
            <div className="glow-pulse absolute inset-4 rounded-full"
              style={{ background: "linear-gradient(135deg, #FF0F7B, #F89B29)" }} />

            {/* Logo icon */}
            <div className="logo-float relative z-10 flex flex-col items-center justify-center">

              {/* Floating particles around icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: i % 2 === 0 ? "#FF0F7B" : "#F89B29",
                      left: `${20 + i * 12}%`,
                      top: `${10 + (i % 3) * 25}%`,
                    }}
                  />
                ))}
              </div>

              {/* Emoji + gradient bg pill */}
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ background: "linear-gradient(135deg, #FF0F7B, #F89B29)" }}>
                <span className="text-4xl select-none" role="img" aria-label="graduation">🎓</span>
                {/* shine overlay */}
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)" }} />
              </div>
            </div>
          </div>

          {/* Bouncing dots */}
          <div className="flex justify-center gap-2">
            <div className="dot-1 w-2.5 h-2.5 rounded-full" style={{ background: "#FF0F7B" }} />
            <div className="dot-2 w-2.5 h-2.5 rounded-full" style={{ background: "#c84fb0" }} />
            <div className="dot-3 w-2.5 h-2.5 rounded-full" style={{ background: "#F89B29" }} />
          </div>

        </div>
      </div>
    </>
  );
}