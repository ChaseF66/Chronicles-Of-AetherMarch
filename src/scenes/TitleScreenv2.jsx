// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// TitleScreen.jsx — Session 3 revamp v3

import { useState, useEffect } from "react";
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
    { label: "NEW GAME",  action: () => fadeOutAndGo(onNewGame)  },
    { label: "CONTINUE",  action: () => fadeOutAndGo(onContinue) },
    { label: "SETTINGS",  action: null },
    { label: "CREDITS",   action: null },
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

      {/* ── DARK VIGNETTE ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, transparent 20%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── BOTTOM ATMOSPHERE ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, transparent 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── AETHER CRACKS ── */}
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
            @keyframes chroniclesDrift {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 0.9; }
            }
            @keyframes menuBreath {
              0%, 100% { opacity: 0.85; }
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

      {/* ── CHRONICLES OF ──
          Sits just above the painted AETHERMARCH logo.
          The logo text in the image lives roughly 35–55% down the screen.
          top: 33% lands us just above its upper edge.
          translateX(-50%) centers it, slight tilt keeps it organic.
      ── */}
      <div style={{
        position: "absolute",
        top: "33%",
        left: "50%",
        transform: phase >= 2
          ? "translateX(-50%) translateY(0px) rotate(-0.5deg)"
          : "translateX(-50%) translateY(-12px) rotate(-0.5deg)",
        zIndex: 10,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(16px, 1.8vw, 24px)",
        letterSpacing: "clamp(12px, 2.8vw, 32px)",
        color: "rgba(74,240,224,0.72)",
        textShadow: "0 0 24px rgba(74,240,224,0.25), 0 2px 10px rgba(0,0,0,0.9)",
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 1.8s ease 0.4s, transform 1.8s ease 0.4s",
        animation: phase >= 2 ? "chroniclesDrift 7s ease-in-out infinite" : "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}>CHRONICLES OF</div>

      {/* ── BOTTOM UI ZONE ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-end",
        paddingBottom: "8vh",
      }}>

        {/* Menu — atmospheric, no hard box */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(12px)",
          transition: "all 1s ease",
          animation: phase >= 4 ? "menuBreath 5s ease-in-out infinite" : "none",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "10px",
        }}>

          {/* Soft line above */}
          <div style={{
            width: "clamp(160px, 22vw, 300px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(74,240,224,0.22), transparent)",
          }}/>

          {/* Menu row */}
          <div style={{
            display: "flex", flexDirection: "row",
            alignItems: "center",
            filter: "drop-shadow(0 0 20px rgba(0,0,0,0.95))",
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
                    padding: "8px 28px",
                    cursor: isDisabled ? "default" : "pointer",
                    opacity: isDisabled ? 0.3 : 1,
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Barely-there separator */}
                  {i > 0 && (
                    <div style={{
                      position: "absolute", left: 0,
                      top: "20%", height: "60%", width: "1px",
                      background: "rgba(74,240,224,0.1)",
                    }}/>
                  )}

                  {/* Hover — soft radial glow, no box */}
                  {isHovered && !isDisabled && (
                    <div style={{
                      position: "absolute", inset: "-6px -10px",
                      background: "radial-gradient(ellipse at center, rgba(74,240,224,0.09) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }}/>
                  )}

                  <span style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "clamp(11px, 1.15vw, 15px)",
                    letterSpacing: "5px",
                    color: isHovered && !isDisabled
                      ? "#4af0e0"
                      : "rgba(215,232,230,0.88)",
                    textShadow: isHovered && !isDisabled
                      ? "0 0 16px rgba(74,240,224,0.7), 0 0 4px rgba(74,240,224,0.4)"
                      : "0 1px 8px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)",
                    transition: "all 0.2s ease",
                  }}>{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Soft line below */}
          <div style={{
            width: "clamp(160px, 22vw, 300px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(74,240,224,0.22), transparent)",
          }}/>

        </div>

        {/* Version */}
        <div style={{
          position: "absolute", bottom: "16px", right: "20px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "8px", letterSpacing: "2px",
          color: "rgba(74,240,224,0.2)",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>v0.1.0 — ACT 1 PROLOGUE</div>

        {/* Bottom left */}
        <div style={{
          position: "absolute", bottom: "16px", left: "20px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "8px", letterSpacing: "2px",
          color: "rgba(74,240,224,0.2)",
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 1s ease",
        }}>DISTRICT 7 — AETHERMARCH</div>

      </div>
    </div>
  );
}
