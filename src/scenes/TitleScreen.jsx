// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// TitleScreen.jsx — Rebuilt title screen

import { useState, useEffect, useRef } from "react";
import { useAudio, stopAudio, TRACKS } from "../hooks/useAudio";

// ── AETHER CRACK PARTICLE ─────────────────────────────────────────────────────
function AetherCrack({ x, y, angle, length, opacity, delay }) {
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  const mx = x + Math.cos(angle) * length * 0.4 + (Math.random() - 0.5) * 20;
  const my = y + Math.sin(angle) * length * 0.4 + (Math.random() - 0.5) * 20;
  return (
    <path
      d={`M${x},${y} Q${mx},${my} ${x2},${y2}`}
      stroke="#4af0e0"
      strokeWidth={0.8}
      fill="none"
      opacity={opacity}
      style={{
        animation: `aetherPulse ${2 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ── GENERATE CRACKS ───────────────────────────────────────────────────────────
function generateCracks(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 50 + Math.random() * 50,
    angle: (Math.random() * Math.PI * 2),
    length: 20 + Math.random() * 60,
    opacity: 0.1 + Math.random() * 0.3,
    delay: Math.random() * 3,
  }));
}

const CRACKS = generateCracks(35);

export default function TitleScreen({ onNewGame, onContinue }) {
  const [phase, setPhase] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  useAudio(TRACKS.TITLE);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function fadeOutAndGo(action) {
    stopAudio(action);
  }

  const menuItems = [
    { label: "NEW GAME",  action: () => fadeOutAndGo(onNewGame),  icon: "⚙" },
    { label: "CONTINUE",  action: () => fadeOutAndGo(onContinue), icon: "▶" },
    { label: "SETTINGS",  action: null, icon: "◈" },
    { label: "CREDITS",   action: null, icon: "✦" },
  ];

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#000",
      position: "relative", overflow: "hidden",
      fontFamily: "'Cinzel', serif",
    }}>

      {/* ── REAL BACKGROUND IMAGE ── */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: 'url("/art/title-screen-bg.png")',
        backgroundSize: "85%",
        backgroundPosition: "center 0%",
        backgroundRepeat: "no-repeat",
        opacity: phase >= 1 ? 0.9 : 0,
        transition: "opacity 2.5s ease",
        zIndex: 0,
      }}/>

      {/* ── DARK VIGNETTE — bottom heavy to anchor menu ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── BOTTOM DARK GRADIENT — menu readability ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── AETHER CRACKS — contaminated energy bleeding through ── */}
      <svg style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }}>
        <defs>
          <style>{`
            @keyframes aetherPulse {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
          `}</style>
        </defs>
        {CRACKS.map(c => (
          <AetherCrack key={c.id}
            x={`${c.x}%`} y={`${c.y}%`}
            angle={c.angle} length={c.length}
            opacity={c.opacity} delay={c.delay}
          />
        ))}
        {/* Ground aether conduit line */}
        <line x1="0" y1="99%" x2="100%" y2="99%"
          stroke="#4af0e0" strokeWidth="0.5" opacity="0.2"
          style={{ animation: "aetherPulse 4s ease-in-out infinite" }}
        />
      </svg>

      {/* ── SCANLINES ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
      }}/>

      {/* ── TITLE CONTENT ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: "3vh",
        gap: 0,
      }}>

        {/* CHRONICLES OF */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(10px, 1.1vw, 13px)",
          letterSpacing: "clamp(6px, 1.8vw, 16px)",
          color: "rgba(74,240,224,0.7)",
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.9s ease 0.1s",
          marginBottom: "8px",
          textShadow: "0 0 10px rgba(74,240,224,0.3)",
          display: "none"
        }}>CHRONICLES OF</div>

        {/* Divider */}
        <div style={{
          width: phase >= 2 ? "clamp(200px, 35%, 420px)" : "0%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(74,240,224,0.4), transparent)",
          marginBottom: "14px",
          transition: "width 1.2s ease 0.5s",
          display: "none"
        }}/>

        {/* Tagline */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontStyle: "italic",
          fontSize: "clamp(11px, 1.3vw, 15px)",
          color: "rgba(74,240,224,0.55)",
          letterSpacing: "1px",
          marginBottom: "clamp(32px, 5vh, 56px)",
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.8s ease",
          textShadow: "0 0 8px rgba(74,240,224,0.2)",
          display: "none"
        }}>
          "Aethermarch doesn't make heroes. It makes us."
        </div>

        {/* Menu — horizontal layout */}
        <div style={{
          display: "flex", flexDirection: "row",
          alignItems: "center", gap: "8px",
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
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
                  display: "flex", alignItems: "center",
                  padding: "8px 20px",
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isDisabled ? 0.3 : 1,
                  transition: "all 0.15s ease",
                  position: "relative",
                }}
              >
                {/* Separator between items */}
                {i > 0 && (
                  <div style={{
                    position: "absolute", left: 0,
                    top: "20%", height: "60%", width: "1px",
                    background: "rgba(74,240,224,0.2)",
                  }}/>
                )}
                {/* Hover bg */}
                {isHovered && !isDisabled && (
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(74,240,224,0.06)",
                    border: "1px solid rgba(74,240,224,0.25)",
                    pointerEvents: "none",
                  }}/>
                )}
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "clamp(9px, 1vw, 12px)",
                  letterSpacing: "3px",
                  color: isHovered && !isDisabled ? "#4af0e0" : "rgba(200,220,218,0.75)",
                  textShadow: isHovered && !isDisabled ? "0 0 10px rgba(74,240,224,0.5)" : "none",
                  transition: "all 0.15s",
                }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Version */}
        <div style={{
          position: "absolute", bottom: "16px", right: "20px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "8px", letterSpacing: "2px",
          color: "rgba(74,240,224,0.25)",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>v0.1.0 — ACT 1 PROLOGUE</div>

        {/* Bottom left */}
        <div style={{
          position: "absolute", bottom: "16px", left: "20px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "8px", letterSpacing: "2px",
          color: "rgba(74,240,224,0.25)",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>DISTRICT 7 — AETHERMARCH</div>

      </div>
    </div>
  );
}