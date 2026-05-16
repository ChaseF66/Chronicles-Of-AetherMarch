// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// TitleScreen.jsx — The main title screen

import { useState, useEffect, useRef } from "react";

export default function TitleScreen({ onNewGame, onContinue }) {
  const [phase, setPhase] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tick, setTick] = useState(0);
  const audioRef = useRef(null);

  // Staggered reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // city fades in
      setTimeout(() => setPhase(2), 1500),  // title appears
      setTimeout(() => setPhase(3), 2800),  // tagline appears
      setTimeout(() => setPhase(4), 4000),  // menu appears
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Audio — Cyan Crucible
  useEffect(() => {
    const audio = new Audio("/audio/cyan-crucible.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Fade in volume slowly
    audio.play().then(() => {
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.02, 0.7);
        audio.volume = vol;
        if (vol >= 0.7) clearInterval(fadeIn);
      }, 100);
    }).catch(() => {
      // Browser autoplay blocked — play on first click instead
      const unlock = () => {
        audio.play();
        window.removeEventListener("click", unlock);
      };
      window.addEventListener("click", unlock);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Fade out music before transitioning
  function fadeOutAndGo(action) {
    const audio = audioRef.current;
    if (!audio) { action(); return; }
    let vol = audio.volume;
    const fadeOut = setInterval(() => {
      vol = Math.max(vol - 0.05, 0);
      audio.volume = vol;
      if (vol <= 0) { clearInterval(fadeOut); audio.pause(); action(); }
    }, 50);
  }

  const menuItems = [
    { label: "NEW GAME",  action: () => fadeOutAndGo(onNewGame),   icon: "⚙" },
    { label: "CONTINUE",  action: () => fadeOutAndGo(onContinue),  icon: "▶" },
    { label: "SETTINGS",  action: null,        icon: "◈" },
    { label: "CREDITS",   action: null,        icon: "✦" },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#000",
      position: "relative", overflow: "hidden",
      fontFamily: "'Cinzel', serif",
    }}>

      {/* ── BACKGROUND LAYERS ── */}

      {/* Base sky gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 0%, #1a2a3a 0%, #080c14 50%, #000 100%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
      }}/>

      {/* Upper district glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "40%",
        background: "radial-gradient(ellipse at 50% 0%, #c8a84b22 0%, transparent 70%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2.5s ease",
      }}/>

      {/* Smog layer */}
      <div style={{
        position: "absolute", top: "30%", left: 0, right: 0, height: "25%",
        background: "linear-gradient(180deg, transparent 0%, #1a1208 40%, #0a0805 60%, transparent 100%)",
        opacity: phase >= 1 ? 0.7 : 0,
        transition: "opacity 2s ease",
      }}/>

      {/* City skyline SVG */}
      <svg style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: "55%",
        opacity: phase >= 1 ? 0.5 : 0,
        transition: "opacity 2s ease",
      }} viewBox="0 0 1400 500" preserveAspectRatio="none">
        {/* Far background buildings */}
        {[
          [0,200,80,300],[85,150,60,350],[150,180,90,320],[245,120,70,380],
          [320,200,80,300],[405,160,65,340],[475,140,85,360],[565,180,75,320],
          [645,120,60,380],[710,200,90,300],[805,160,70,340],[880,140,80,360],
          [965,180,65,320],[1035,120,75,380],[1115,200,80,300],[1200,160,85,340],
          [1290,140,110,360],
        ].map(([x,h,w,y],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#0a1020"/>
        ))}
        {/* Aethon towers — taller, prominent */}
        {[
          [580,320,40,180],[620,280,30,220],[650,300,35,200],
          [760,340,45,160],[805,300,30,200],
        ].map(([x,h,w,y],i) => (
          <rect key={`tower-${i}`} x={x} y={y} width={w} height={h} fill="#0d1525"/>
        ))}
        {/* Windows — aether tinted */}
        {Array.from({length:80},(_,i) => (
          <rect key={`win-${i}`}
            x={10+(i*17)%1380} y={100+(i*23)%320}
            width={5} height={8}
            fill={i%5===0 ? "#4af0e0" : i%3===0 ? "#e8b84b" : "#1a2a4a"}
            opacity={0.15+((i*7)%10)*0.04}
          />
        ))}
        {/* Ground aether conduits */}
        {[5,15,25,35,45,55,65,75,85,95].map((pct,i) => (
          <rect key={`conduit-${i}`}
            x={`${pct}%`} y={490} width={2} height={10}
            fill="#4af0e0" opacity={0.3}
          />
        ))}
      </svg>

      {/* Aether conduit lines — horizontal */}
      <div style={{
        position: "absolute", bottom: "2%", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 0%, #4af0e044 20%, #4af0e088 50%, #4af0e044 80%, transparent 100%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
        animation: "conduitPulse 3s ease-in-out infinite",
      }}/>

      {/* Steam particles */}
      {phase >= 1 && Array.from({length:12},(_,i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${5+i*8}%`,
          bottom: `${8+i*2}%`,
          width: 6+i*2, height: 6+i*2,
          borderRadius: "50%",
          background: "#aaccbb",
          opacity: 0,
          animation: `steamDrift ${4+i*0.6}s ease-out infinite`,
          animationDelay: `${i*0.4}s`,
        }}/>
      ))}

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, #00000015 3px, #00000015 4px)",
      }}/>

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }}/>

      {/* ── TITLE CONTENT ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>

        {/* Gear decorations */}
        <div style={{
          fontSize: 20, letterSpacing: 24, opacity: 0.4,
          marginBottom: 8,
          opacity: phase >= 2 ? 0.4 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.8s ease",
          color: "#c8a84b",
        }}>⚙ ⚙ ⚙</div>

        {/* CHRONICLES OF */}
        <div style={{
          fontSize: 13, letterSpacing: 10, color: "#7a9aaa",
          marginBottom: 4,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.8s ease 0.1s",
        }}>CHRONICLES OF</div>

        {/* AETHERMARCH — main title */}
        <div style={{
          fontSize: "clamp(36px, 7vw, 72px)",
          fontWeight: 600,
          letterSpacing: 8,
          color: "#e8b84b",
          textShadow: `
            0 0 20px #e8b84b88,
            0 0 40px #c8a84b44,
            0 0 80px #a88a3a22
          `,
          marginBottom: 6,
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(10px)",
          transition: "all 1s ease 0.2s",
          animation: phase >= 2 ? "flicker 4s ease-in-out infinite" : "none",
        }}>AETHERMARCH</div>

        {/* Divider line */}
        <div style={{
          width: phase >= 2 ? "40%" : "0%",
          height: 1,
          background: "linear-gradient(90deg, transparent, #c8a84b88, transparent)",
          marginBottom: 12,
          transition: "width 1.2s ease 0.4s",
        }}/>

        {/* Tagline */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontStyle: "italic",
          fontSize: 14,
          color: "#5a7a6a",
          letterSpacing: 1,
          marginBottom: 48,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.8s ease",
        }}>
          "Aethermarch doesn't make heroes. It makes us."
        </div>

        {/* Menu items */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s ease",
        }}>
          {menuItems.map((item, i) => {
            const isHovered = hoveredItem === i;
            const isDisabled = !item.action;
            return (
              <div
                key={i}
                onClick={() => item.action?.()}
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 32px",
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isDisabled ? 0.35 : 1,
                  transition: "all 0.15s ease",
                  position: "relative",
                  minWidth: 220,
                  justifyContent: "center",
                }}
              >
                {/* Hover border */}
                {isHovered && !isDisabled && (
                  <div style={{
                    position: "absolute", inset: 0,
                    border: "1px solid #e8b84b44",
                    background: "linear-gradient(90deg, transparent, #e8b84b08, transparent)",
                    pointerEvents: "none",
                  }}/>
                )}

                {/* Left indicator */}
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 10,
                  color: isHovered && !isDisabled ? "#e8b84b" : "transparent",
                  transition: "color 0.15s",
                  position: "absolute", left: 8,
                }}>▶</span>

                {/* Icon */}
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: 11,
                  color: isHovered && !isDisabled ? "#e8b84b" : "#4a6a5a",
                  transition: "color 0.15s",
                }}>{item.icon}</span>

                {/* Label */}
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: isHovered && !isDisabled ? "#e8b84b" : "#5a7a6a",
                  textShadow: isHovered && !isDisabled ? "0 0 12px #e8b84b66" : "none",
                  transition: "all 0.15s",
                }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Version tag */}
        <div style={{
          position: "absolute", bottom: 20, right: 24,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9, letterSpacing: 2,
          color: "#2a3a4a",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>
          v0.1.0 — ACT 1 PROLOGUE
        </div>

        {/* Bottom left lore tag */}
        <div style={{
          position: "absolute", bottom: 20, left: 24,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 9, letterSpacing: 2,
          color: "#2a3a4a",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>
          DISTRICT 7 — AETHERMARCH
        </div>

      </div>
    </div>
  );
}
